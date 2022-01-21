import { MoveTaxonomy } from '@taxonomy/interfaces/move-taxonomy.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { groupByOne } from '@taxonomy/utils';
import { RelationService } from '@taxonomy/domain/services/relation.service';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';

@Injectable()
export class MoveTaxonomyService {
  constructor(private readonly relationService: RelationService) {}

  /**
   * taxonomy를 이동합니다.
   *
   * @param moveTaxonomy
   * @param entityManager
   * @returns
   */
  async handle(moveTaxonomy: MoveTaxonomy, entityManager: EntityManager): Promise<boolean> {
    const taxonomyRepository = entityManager.getCustomRepository(TaxonomyRepository);

    // #1-1 원본, 타겟 탁사노미(relationship포함) 가져온다
    const taxonomyList = await taxonomyRepository.findManyWithRelationShip([
      moveTaxonomy.taxonomyId,
      moveTaxonomy.targetTaxonomyId,
    ]);

    const taxonomyListGroupBytaxonomyId = groupByOne(
      taxonomyList,
      (taxonomy) => taxonomy.term_taxonomy_id,
    );

    const origin = taxonomyListGroupBytaxonomyId[moveTaxonomy.taxonomyId];
    const target = taxonomyListGroupBytaxonomyId[moveTaxonomy.targetTaxonomyId];

    // #1-2 command와 맞는지 확인한다.
    if (
      origin.taxonomyRelationship.start_taxonomy_id !== moveTaxonomy.parentTaxonomyId ||
      origin.taxonomyRelationship.end_taxonomy_id !== moveTaxonomy.taxonomyId ||
      target.taxonomyRelationship.start_taxonomy_id !== moveTaxonomy.targetParentTaxonomyId ||
      target.taxonomyRelationship.end_taxonomy_id !== moveTaxonomy.targetTaxonomyId
    ) {
      throw new BadRequestException();
    }

    // #2 관계서비스 이용해서 move한다
    await this.relationService.move(entityManager, origin, target);

    return true;
  }
}
