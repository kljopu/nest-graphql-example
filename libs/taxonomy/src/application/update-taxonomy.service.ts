import { UpdateTaxonomy } from '@taxonomy/interfaces/update-taxonomy.interface';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TermDictionaryFactory } from '@taxonomy/domain/factories/term-dictionary.factory';

@Injectable()
export class UpdateTaxonomyService {
  constructor(private readonly termDictionaryFactory: TermDictionaryFactory) {}

  /**
   * taxonomy를 업데이트합니다.
   *
   * @param updateTaxonomy
   * @param entityManager
   * @returns
   */
  async handle(updateTaxonomy: UpdateTaxonomy, entityManager: EntityManager): Promise<boolean> {
    const taxonomyRepository = entityManager.getCustomRepository(TaxonomyRepository);
    const taxonomyRelationshipRepository = entityManager.getCustomRepository(
      TaxonomyRelationShipRepository,
    );

    const relationship = await taxonomyRelationshipRepository.findOneWithTaxonomy(
      updateTaxonomy.taxonomyId,
    );
    // const childTaxonomyIds = await taxonomyRelationshipRepository.searchChildTaxonomy([
    //   relationship.start_taxonomy_id,
    // ]);

    // const childTaxonomy = await taxonomyRepository.findByTaxonomyIds(childTaxonomyIds);
    // childTaxonomy.checkDuplicateName(updateTaxonomy.name);

    const dictionary = await this.termDictionaryFactory.create(entityManager, updateTaxonomy.name);
    const taxonomy = relationship.endTaxonomy;
    taxonomy.dictionary = dictionary;
    await taxonomyRepository.saveInTransaction(taxonomy);

    return true;
  }
}
