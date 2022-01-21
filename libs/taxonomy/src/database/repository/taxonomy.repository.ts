import { HttpException, NotFoundException } from '@nestjs/common';
import { TaxonomyCollection } from '@taxonomy/domain/entities/taxonomy.collection';
import { TermTaxonomy } from '@taxonomy/domain/entities/term-taxonomy.entity';
import { NodeType } from '@taxonomy/domain/enums/node-type.enum';
import { TaxonomyType } from '@taxonomy/domain/enums/taxonomy.enum';
import { Between, EntityRepository, FindOneOptions, In, Repository } from 'typeorm';

@EntityRepository(TermTaxonomy)
export class TaxonomyRepository extends Repository<TermTaxonomy> {
  async findByIds(ids: number[]): Promise<TermTaxonomy[]> {
    return await this.find({ where: { term_taxonomy_id: In(ids) } });
    // const taxonomys = await this.find({ where: { term_taxonomy_id: In(ids) } });

    // return new TaxonomyCollection(taxonomys);
  }

  async findOneDepthByIdAndTaxonomy(id: number, taxonomy: TaxonomyType): Promise<TermTaxonomy[]> {
    const taxonomyList = await this.createQueryBuilder('termTaxonomy')
      .leftJoinAndSelect(
        'termTaxonomy.taxonomyRelationship',
        'taxonomyRelationship',
        'taxonomyRelationship.node_type = :hierarchy',
        {
          hierarchy: NodeType.HIERARCHY_CHILD,
        },
      )
      .innerJoinAndSelect('termTaxonomy.dictionary', 'dictionary')
      .where('termTaxonomy.taxonomy = :taxonomy', { taxonomy: taxonomy })
      .andWhere('taxonomyRelationship.start_taxonomy_id = :start_taxonomy_id', {
        start_taxonomy_id: id ?? 1,
      })
      .orderBy('taxonomyRelationship.tr_order', 'ASC')
      .getMany();

    return taxonomyList;
  }

  async findByIdsWithDictionary(
    ids: number[],
    taxonomy: TaxonomyType = TaxonomyType.SCHOOL_GRADES,
  ): Promise<TermTaxonomy[]> {
    const taxonomyList = await this.createQueryBuilder('termTaxonomy')
      .select(['termTaxonomy.term_taxonomy_id', 'termTaxonomy.term_depth', 'dictionary.name'])
      .innerJoin('termTaxonomy.dictionary', 'dictionary')
      .where('termTaxonomy.taxonomy = :taxonomy', { taxonomy: taxonomy })
      .andWhereInIds(ids)
      .orderBy('termTaxonomy.term_depth')
      .getMany();

    return taxonomyList;
  }

  async findGradeAll(): Promise<TermTaxonomy[]> {
    return await this.createQueryBuilder('termTaxonomy')
      .select(['termTaxonomy.term_taxonomy_id', 'dictionary.name'])
      .innerJoin('termTaxonomy.dictionary', 'dictionary')
      .where('termTaxonomy.taxonomy = :taxonomy', { taxonomy: TaxonomyType.YEAR })
      .andWhere('termTaxonomy.term_depth = :depth', { depth: 2 })
      .andWhere('termTaxonomy.order > :start AND termTaxonomy.order < :end', { start: 10, end: 40 })
      .orderBy('termTaxonomy.order')
      .getMany();
  }

  async findGradeByTaxonomy(taxonomyId: number): Promise<TermTaxonomy[]> {
    return await this.createQueryBuilder('tt')
      .leftJoinAndSelect('tt.taxonomyRelationship', 'tr')
      .leftJoinAndSelect('tt.dictionary', 'td')
      .where('tr.start_taxonomy_id = :taxonomyId', { taxonomyId: taxonomyId })
      .andWhere('tr.node_type = :nodeType', { nodeType: NodeType.SUBJECT_YEAR })
      .getMany();
  }

  async exists(taxonomyIds: number[], nodeType: NodeType): Promise<boolean> {
    if (nodeType === NodeType.SUBJECT_YEAR) {
      await this.existsGrade(taxonomyIds);
    } else if (nodeType === NodeType.HIERARCHY_CHILD) {
      await this.existsSchoolGrade(taxonomyIds);
    }
    return true;
  }

  private async existsGrade(taxonomyIds: number[]): Promise<boolean> {
    const found = await this.find({
      where: {
        term_taxonomy_id: In(taxonomyIds),
        taxonomy: TaxonomyType.YEAR,
        term_depth: 2,
        order: Between(10, 40),
      },
    });

    if (taxonomyIds.length !== found.length) {
      throw new NotFoundException();
    }

    return true;
  }

  private async existsSchoolGrade(taxonomyIds: number[]): Promise<boolean> {
    const found = await this.find({
      where: {
        term_taxonomy_id: In(taxonomyIds),
        taxonomy: TaxonomyType.SCHOOL_GRADES,
      },
    });

    if (taxonomyIds.length !== found.length) {
      throw new NotFoundException();
    }

    return true;
  }

  async findOneByIdThrow(id: number, findOption?: FindOneOptions): Promise<TermTaxonomy> {
    const found = await this.findOne(id, findOption);

    if (!found) {
      throw new NotFoundException('taxonomy_id가 없습니다');
    }

    return found;
  }

  async findChildByParentTaxonomyId(
    parentTaxonomyId: number,
    taxonomy: TaxonomyType,
  ): Promise<TaxonomyCollection> {
    const taxonomyList = await this.createQueryBuilder('taxonomy')
      .leftJoinAndSelect('taxonomy.taxonomyRelationship', 'tr')
      .innerJoinAndSelect('taxonomy.dictionary', 'dictionary')
      .where('tr.start_taxonomy_id = :parentTaxonomyId', { parentTaxonomyId: parentTaxonomyId })
      .andWhere('taxonomy.taxonomy = :taxonomy', { taxonomy: taxonomy })
      .orderBy('tr.tr_order', 'ASC')
      .getMany();

    return new TaxonomyCollection(taxonomyList);
  }

  async findOneWithRelationShip(taxonomyId: number): Promise<TermTaxonomy> {
    return await this.createQueryBuilder('tt')
      .leftJoinAndSelect('tt.taxonomyRelationship', 'tr')
      .leftJoinAndSelect('tt.dictionary', 'td')
      .where('tt.term_taxonomy_id = :taxonomyId', { taxonomyId: taxonomyId })
      .getOne();
  }

  async findManyWithRelationShip(taxonomyIds: number[]): Promise<TermTaxonomy[]> {
    return await this.createQueryBuilder('tt')
      .leftJoinAndSelect('tt.taxonomyRelationship', 'tr')
      .leftJoinAndSelect('tt.dictionary', 'td')
      .where('tt.term_taxonomy_id IN (:taxonomyIds)', { taxonomyIds: taxonomyIds })
      .getMany();
  }

  async saveInTransaction(entity: TermTaxonomy): Promise<void> {
    await this.save(entity, { reload: false, transaction: false });
  }

  /**
   *
   * @param id
   * @returns
   */
  async checkById(id: number): Promise<TermTaxonomy> {
    const checkId = await this.findOne(id);

    if (!checkId) {
      throw new HttpException('중복된 taxonomy_id가 존재합니다.', 400);
    }
    return checkId;
  }

  /**
   *
   * @param taxonomyIds 값을 증가 또는 감소 taxonomy_id 리스트
   * @returns boolean
   */
  async changeDepthOfTaxonomy(taxonomyIds: number[], value: number): Promise<void> {
    await this.createQueryBuilder()
      .update()
      .set({
        term_depth: () => `term_depth + ${value}`,
      })
      .whereInIds(taxonomyIds)
      .execute();
  }
}
