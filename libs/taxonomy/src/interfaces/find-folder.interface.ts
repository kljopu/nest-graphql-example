import { TaxonomyType } from '@taxonomy/domain/enums/taxonomy.enum';

export interface FindFolder {
  taxonomyId?: number;
  taxonomy: TaxonomyType;
}
