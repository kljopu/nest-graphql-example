import { TermTaxonomy } from '@taxonomy/domain/entities/term-taxonomy.entity';
import { FindFolder } from '@taxonomy/interfaces/find-folder.interface';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetTaxonomyService {
  constructor(
    private readonly taxonomyRepository: TaxonomyRepository,
    private readonly taxonomyRelationShipRepository: TaxonomyRelationShipRepository,
  ) {}
  /**
   * 부모 taxonomy를 통해 자식 taxonomy들을 가져옵니다.
   *
   * @param findFolder FindFolder
   * @returns TermTaxonomy[]
   */
  async getOneDepth(findFolder: FindFolder): Promise<TermTaxonomy[]> {
    return await this.taxonomyRepository.findOneDepthByIdAndTaxonomy(
      findFolder.taxonomyId,
      findFolder.taxonomy,
    );
  }

  /**
   * 특정 Taxonomy와 연관된 학년을 가져옵니다.
   *
   * @param taxonomyId
   * @returns TermTaxonomy[]
   */
  async getGrade(taxonomyId: number): Promise<TermTaxonomy[]> {
    if (!taxonomyId) {
      return await this.taxonomyRepository.findGradeAll();
    }
    return await this.taxonomyRepository.findGradeByTaxonomy(taxonomyId);
  }

  /**
   * 현재를 기준으로 depth가 0까지의 부모 taxonomy들을 조회합니다.
   *
   * @param taxonomyId
   * @returns TermTaxonomy[]
   */
  async getPath(taxonomyId: number): Promise<TermTaxonomy[]> {
    const allParentTaxonomyIds = await this.taxonomyRelationShipRepository.allSearchParentTaxonomy(
      taxonomyId,
    );
    const allParentTaxonomyList = await this.taxonomyRepository.findByIdsWithDictionary(
      allParentTaxonomyIds,
    );

    return allParentTaxonomyList;
  }
}
