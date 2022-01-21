import { Injectable } from '@nestjs/common';
import { TermTaxonomy } from '@taxonomy/domain/entities/term-taxonomy.entity';
import { CurriculumTh } from '@taxonomy/domain/enums/curriculum-th.enum';
import { FlexType } from '@taxonomy/domain/enums/flex-type.enum';
import { NodeType } from '@taxonomy/domain/enums/node-type.enum';
import { TaxonomyType } from '@taxonomy/domain/enums/taxonomy.enum';
import { CreateTaxonomy } from '@taxonomy/interfaces/create-taxonomy.interface';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { EntityManager } from 'typeorm';
import { TermDictionaryFactory } from '@taxonomy/domain/factories/term-dictionary.factory';

@Injectable()
export class CreateTaxonomyService {
  constructor(private readonly termDictionaryFactory: TermDictionaryFactory) {}
  /**
   *
   * @param createTaxonomy CreateTaxonomy
   * @param taxonomyType TaxonomyType
   * @param entityManager EntityManager
   * @returns TermTaxonomy
   */
  async handle(
    createTaxonomy: CreateTaxonomy,
    taxonomyType: TaxonomyType,
    entityManager: EntityManager,
  ): Promise<TermTaxonomy> {
    const taxonomyRelationShipRepository = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );
    const taxonomyRepository = entityManager.getCustomRepository(TaxonomyRepository);

    const parentTaxonomy = await taxonomyRepository.findOneByIdThrow(
      createTaxonomy.parentTaxonomyId,
    );

    // FIXME: repository에서 collection을 반환하도록 수정하는게 좋을 것 같다.
    const childTaxonomys = await taxonomyRepository.findChildByParentTaxonomyId(
      createTaxonomy.parentTaxonomyId,
      taxonomyType,
    );

    // 부모의 자식들중 중복이름 체크
    // this.validateTaxonomy.checkDuplicateName(childTaxonomys, createTaxonomy.name);

    const dictionary = await this.termDictionaryFactory.create(entityManager, createTaxonomy.name);

    const newTaxonomy = await taxonomyRepository.save({
      taxonomy: taxonomyType,
      dictionary: dictionary,
      parent: createTaxonomy.parentTaxonomyId,
      term_depth: parentTaxonomy.isRoot() ? 0 : parentTaxonomy.term_depth + 1,
      version: createTaxonomy.version,
      curriculum_th: [CurriculumTh.EIGHT, CurriculumTh.NINE],
    });

    await taxonomyRelationShipRepository.saveInTransaction({
      node_type: NodeType.HIERARCHY_CHILD,
      flex_type: FlexType.SIMPLEX,
      start_taxonomy_id: createTaxonomy.parentTaxonomyId,
      endTaxonomy: newTaxonomy,
      tr_order: childTaxonomys.getLastOrder() + 1,
    });

    return newTaxonomy;
  }
}
