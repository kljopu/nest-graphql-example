import { Injectable, NotFoundException } from '@nestjs/common';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { EntityManager } from 'typeorm';
import { TermTaxonomy } from '../entities/term-taxonomy.entity';

@Injectable()
export class RelationService {
  async move(
    entityManager: EntityManager,
    origin: TermTaxonomy,
    target: TermTaxonomy,
  ): Promise<void> {
    this.isMoveable(origin, target);

    const taxonomyRepository = entityManager.getCustomRepository(TaxonomyRepository);
    const taxonomyRelationRepository = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );

    // 원본의 tr_order가 낮은 것들을 가져온다
    const lowerOrderRelationShips = await taxonomyRelationRepository.findLowerOrderByEntity(
      origin.taxonomyRelationship,
    );

    // 타겟의 경로에 있는 자식들을 모두 가져온다
    const targetChilds = await taxonomyRepository.findChildByParentTaxonomyId(
      target.term_taxonomy_id,
      target.taxonomy,
    );

    // #1 이동할 곳으로 원본을 업데이트한다.
    origin.parent = target.term_taxonomy_id;
    origin.taxonomyRelationship.start_taxonomy_id = target.term_taxonomy_id;
    origin.taxonomyRelationship.tr_order = targetChilds.getLastOrder() + 1;

    await taxonomyRepository.saveInTransaction(origin);
    await taxonomyRelationRepository.saveInTransaction(origin.taxonomyRelationship);

    // #2 이동하고 나서 기존 경로 tr_order를 정리한다.
    await taxonomyRelationRepository.decreaseOneOrder(
      lowerOrderRelationShips.map((relation) => relation.node_id),
    );

    // #3 이동한 원본과 자식들의 term_depth를 업데이트한다.
    const differenceDepth = target.term_depth + 1 - origin.term_depth;
    if (differenceDepth !== 0) {
      const childTaxonomyList = await taxonomyRelationRepository.allSearchChildTaxonomy([
        origin.term_taxonomy_id,
      ]);

      await taxonomyRepository.changeDepthOfTaxonomy(
        [origin.term_taxonomy_id].concat(childTaxonomyList),
        differenceDepth,
      );
    }

    return;
  }

  private isMoveable(origin: TermTaxonomy, target: TermTaxonomy): boolean {
    if (
      origin === null ||
      target === null ||
      origin.taxonomyRelationship === null ||
      target.taxonomyRelationship === null
    ) {
      throw new NotFoundException();
    }
    return true;
  }
}
