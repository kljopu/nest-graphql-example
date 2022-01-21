import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TaxonomyRelationShip } from '@taxonomy/domain/entities/taxonomy-relationships.entity';
import { NodeType } from '@taxonomy/domain/enums/node-type.enum';
import { UpdateOrder } from '@taxonomy/interfaces/update-order.interface';
import { EntityRepository, In, MoreThan, Repository } from 'typeorm';

@EntityRepository(TaxonomyRelationShip)
export class TaxonomyRelationShipRepository extends Repository<TaxonomyRelationShip> {
  /**
   *
   * @param taxonomyId
   * @returns
   */
  async findByParent(parentTaxonomyId: number): Promise<TaxonomyRelationShip[]> {
    return await this.find({
      where: {
        node_type: NodeType.HIERARCHY_CHILD,
        start_taxonomy_id: parentTaxonomyId,
      },
      relations: ['endTaxonomy'],
      order: {
        tr_order: 'ASC',
      },
    });
  }

  async findOneByParent(
    parentTaxonomyId: number,
    endTaxonomyId: number,
  ): Promise<TaxonomyRelationShip> {
    return await this.createQueryBuilder('tr')
      .leftJoinAndSelect('tr.endTaxonomy', 'taxonomy')
      .innerJoinAndSelect('taxonomy.dictionary', 'dictionary')
      .where('tr.start_taxonomy_id = :startTaxonomyId', { startTaxonomyId: parentTaxonomyId })
      .andWhere('tr.end_taxonomy_id = :endTaxonomyId', { endTaxonomyId: endTaxonomyId })
      .andWhere('tr.node_type = :nodeType', { nodeType: NodeType.HIERARCHY_CHILD })
      .getOne();
  }

  async findOneWithTaxonomy(taxonomyId: number): Promise<TaxonomyRelationShip> {
    const taxonomyRelationship = await this.createQueryBuilder('tr')
      .leftJoinAndSelect('tr.endTaxonomy', 'taxonomy')
      .innerJoinAndSelect('taxonomy.dictionary', 'dictionary')
      .where('tr.end_taxonomy_id = :taxonomyId', { taxonomyId: taxonomyId })
      .getOne();

    return taxonomyRelationship;
  }

  async findByStartAndEnd(
    startTaxonomyId: number,
    endTaxonomyId: number,
  ): Promise<TaxonomyRelationShip> {
    const relationship = await this.findOne({
      where: {
        start_taxonomy_id: startTaxonomyId,
        end_taxonomy_id: endTaxonomyId,
      },
    });

    return relationship;
  }

  async findLowerOrderByEntity(entity: TaxonomyRelationShip): Promise<TaxonomyRelationShip[]> {
    return await this.find({
      where: {
        start_taxonomy_id: entity.start_taxonomy_id,
        tr_order: MoreThan(entity.tr_order),
      },
    });
  }

  async saveInTransaction(entity: Partial<TaxonomyRelationShip>): Promise<void> {
    await this.save(entity, { reload: false, transaction: false });
  }

  async saveMultiple(entities: Partial<TaxonomyRelationShip>[]): Promise<void> {
    await this.createQueryBuilder().insert().values(entities).updateEntity(false).execute();
  }

  /**
   *
   * @param taxonomyId 부모 taxonomyId
   * @returns 자식 taxonomy중 마지막 order + 1
   */
  async getNextOrder(taxonomyId: number): Promise<number> {
    const taxonomyMaxOrder = await this.createQueryBuilder('tr')
      .select('MAX(tr.tr_order) + 1', 'max')
      .where('tr.start_taxonomy_id = :targetTaxonomyId', {
        targetTaxonomyId: taxonomyId,
      })
      .andWhere('tr.node_type = :nodeType', { nodeType: NodeType.HIERARCHY_CHILD })
      .getRawOne();
    return taxonomyMaxOrder.max ?? 0;
  }

  /**
   *
   * @param taxonomyList 감소시킬 taxonomyId array
   */
  async decreaseOneOrder(taxonomyRelationList: number[]): Promise<void> {
    if (taxonomyRelationList.length) {
      await this.createQueryBuilder()
        .update()
        .set({
          tr_order: () => 'tr_order - 1',
        })
        .whereInIds(taxonomyRelationList)
        .execute();
    }
  }

  /**
   *
   * @param parentTaxonomyId
   * @param orderList
   */
  async updateByOrderList(parentTaxonomyId: number, orders: UpdateOrder[]): Promise<void> {
    const query = orders.reduce((query, order) => {
      query = query.concat(`WHEN end_taxonomy_id = ${order.id} THEN ${order.order} `);
      return query;
    }, '');

    await this.createQueryBuilder()
      .update()
      .set({
        tr_order: () => `CASE ${query} ELSE tr_order END`,
      })
      .where('start_taxonomy_id = :start_taxonomy_id', {
        start_taxonomy_id: parentTaxonomyId,
      })
      .execute();
  }

  /**
   *
   * @param taxonomyId
   * @returns 부모 taxonomy
   */
  async searchParentTaxonomy(taxonomyId: number): Promise<TaxonomyRelationShip> {
    const parents = await this.findOne({
      select: ['start_taxonomy_id'],
      where: {
        end_taxonomy_id: taxonomyId,
        node_type: NodeType.HIERARCHY_CHILD,
      },
    });

    if (!parents) {
      throw new NotFoundException();
    }

    return parents;
  }

  /**
   *
   * @param taxonomyId 현재 taxonomy위치의 taxonomy_id
   * @returns 현재 위치 부터 최상위까지 taxonom_id array
   */
  async allSearchParentTaxonomy(taxonomyId: number): Promise<number[]> {
    if (taxonomyId === 1) {
      return [];
    }
    const parentTaxonomy = await this.searchParentTaxonomy(taxonomyId);

    // 잘못된 연결 예외처리
    if (parentTaxonomy.start_taxonomy_id === taxonomyId) {
      throw new BadRequestException();
    }

    return [].concat(
      await this.allSearchParentTaxonomy(parentTaxonomy.start_taxonomy_id),
      taxonomyId,
    );
  }

  /**
   *
   * @param parentTaxonomy 부모 taxonomy id의 array
   * @returns 부모 taxonomy들의 한 레벨 자식들의 taxonomy id의 array
   */
  async searchChildTaxonomy(
    parentTaxonomy: number[],
    nodeType: NodeType = NodeType.HIERARCHY_CHILD,
  ): Promise<number[]> {
    const parents = await this.find({
      where: {
        start_taxonomy_id: In(parentTaxonomy),
        node_type: nodeType,
      },
    });
    return parents.map((parent) => parent.end_taxonomy_id);
  }

  /**
   *
   * @param startTaxonomyId 부모 taxonomy id의 array
   * @returns 부모 taxonomy들의 모든 자식들의 taxonoy id의 array
   */
  async allSearchChildTaxonomy(startTaxonomyId: number[]): Promise<number[]> {
    if (startTaxonomyId.length === 0) {
      return [];
    }
    const childTaxonomy = await this.searchChildTaxonomy(startTaxonomyId);
    return [].concat(await this.allSearchChildTaxonomy(childTaxonomy), childTaxonomy);
  }
}
