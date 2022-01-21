import { NodeType } from '@taxonomy/domain/enums/node-type.enum';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class DeleteTaxonomyService {
  /**
   * taxonomy를 sofe delete합니다. (HIERARCHY_CHILD -> HIERARCHY_CHILD_TEMP)
   *
   * @param parentTaxonomyId
   * @param targetTaxonomyId
   * @param entityManager EntityManager
   * @returns
   */
  async delete(
    parentTaxonomyId: number,
    targetTaxonomyId: number,
    entityManager: EntityManager,
  ): Promise<boolean> {
    const taxonomyRelationShipRepository = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );

    const childRelation = await taxonomyRelationShipRepository.findByParent(parentTaxonomyId);

    const targetRelation = childRelation.find(
      (relation) => relation.end_taxonomy_id === targetTaxonomyId,
    );

    const relationToChange = childRelation.reduce((relationIds, relation) => {
      if (relation.tr_order > targetRelation.tr_order) {
        relationIds.push(relation.node_id);
      }
      return relationIds;
    }, []);

    if (!targetRelation) {
      throw new NotFoundException();
    }

    targetRelation.node_type = NodeType.HIERARCHY_CHILD_TEMP;
    await taxonomyRelationShipRepository.saveInTransaction(targetRelation);

    // 연결을 끊은 대상 밑 순서로 order를 1씩 감소
    await taxonomyRelationShipRepository.decreaseOneOrder(relationToChange);
    return true;
  }
}
