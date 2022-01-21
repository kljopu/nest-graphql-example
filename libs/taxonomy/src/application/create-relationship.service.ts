import { Injectable } from '@nestjs/common';
import { ConnectTaxonomy } from '@taxonomy/interfaces/connect-taxonomy.interface';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class CreateRelationshipService {
  /**
   * 다른 taxonomy와 relationship 갖도록 연결시켜주는 method입니다.
   *
   * @param connectTaxonomy ConnectTaxonomy
   * @param entityManager EntityManager
   * @returns
   */
  async connect(connectTaxonomy: ConnectTaxonomy, entityManager: EntityManager): Promise<boolean> {
    const taxonomyRelationshipRepository = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );
    const taxonomyRepository = entityManager.getCustomRepository(TaxonomyRepository);

    // validation
    await taxonomyRepository.exists(connectTaxonomy.endTaxonomyIds, connectTaxonomy.node_type);
    await taxonomyRepository.findOneByIdThrow(connectTaxonomy.startTaxonomyId);
    const childs = await taxonomyRelationshipRepository.searchChildTaxonomy(
      [connectTaxonomy.startTaxonomyId],
      connectTaxonomy.node_type,
    );

    const taxonomyIdsNotOverlap = connectTaxonomy.endTaxonomyIds.filter(
      (taxonomyId) => !childs.includes(taxonomyId),
    );

    if (taxonomyIdsNotOverlap) {
      const createGrades = taxonomyIdsNotOverlap.map((gradeTaxonomyId) => {
        return {
          flex_type: connectTaxonomy.flex_type,
          node_type: connectTaxonomy.node_type,
          start_taxonomy_id: connectTaxonomy.startTaxonomyId,
          end_taxonomy_id: gradeTaxonomyId,
        };
      });

      await taxonomyRelationshipRepository.saveMultiple(createGrades);
    }

    return true;
  }
}
