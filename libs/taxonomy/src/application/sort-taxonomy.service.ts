import { TaxonomyRelationShip } from '@taxonomy/domain/entities/taxonomy-relationships.entity';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UpdateOrder } from '@taxonomy/interfaces/update-order.interface';
import { groupByOne } from '@taxonomy/utils';

@Injectable()
export class SortTaxonomyService {
  /**
   * taxonomy를 정렬합니다. (taxonomy_relationship의 tr_order값 이용)
   *
   * @param targetTaxonomyId number
   * @param taxonomyToSort OrderList
   * @returns
   */
  async sort(
    targetTaxonomyId: number,
    targetOrder: UpdateOrder[],
    entityManager: EntityManager,
  ): Promise<boolean> {
    const taxonomyRelationShipReposiotry = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );

    const childs = await taxonomyRelationShipReposiotry.findByParent(targetTaxonomyId);
    this.validate(childs, targetOrder);

    const relationshipToChange = this.getRelationshipToChange(childs, targetOrder);
    if (relationshipToChange.length !== 0) {
      await taxonomyRelationShipReposiotry.updateByOrderList(
        targetTaxonomyId,
        relationshipToChange,
      );
    }

    return true;
  }

  // 중복 체크 & id값이 유효한지 검증
  private validate(childRelationships: TaxonomyRelationShip[], orders: UpdateOrder[]): void {
    const endTaxonomyIds = childRelationships.map((child) => child.end_taxonomy_id);

    const targetOrderSet = new Set(orders.map((order) => order.order));
    if (targetOrderSet.size !== orders.length) {
      throw new BadRequestException();
    }

    orders.forEach((order) => {
      if (!endTaxonomyIds.includes(order.id)) {
        throw new NotFoundException();
      }
    });
  }

  // 변화된 값을 반환
  private getRelationshipToChange(
    childRelationships: TaxonomyRelationShip[],
    updateOrderList: UpdateOrder[],
  ): UpdateOrder[] {
    const taxonomyRelationships = groupByOne(childRelationships, (child) => child.end_taxonomy_id);

    return updateOrderList.filter(
      (order) => taxonomyRelationships[order.id].tr_order !== order.order,
    );
  }
}
