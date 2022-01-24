import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRelationshipService } from '@taxonomy/application/create-relationship.service';
import { CreateTaxonomyService } from '@taxonomy/application/create-taxonomy.service';
import { DeleteTaxonomyService } from '@taxonomy/application/delete-taxonomy.service';
import { MoveTaxonomyService } from '@taxonomy/application/move-taxonomy.service';
import { SortTaxonomyService } from '@taxonomy/application/sort-taxonomy.service';
import { UpdateTaxonomyService } from '@taxonomy/application/update-taxonomy.service';
import { TaxonomyRelationShipRepository } from '@taxonomy/database/repository/taxonomy-relationship.repository';
import { TaxonomyRepository } from '@taxonomy/database/repository/taxonomy.repository';
import { GetTaxonomyService } from '@taxonomy/application/get-taxonomy.service';
import { DictionaryRepository } from '@taxonomy/database/repository/dictionary.repository';
import { TermDictionaryFactory } from '@taxonomy/domain/factories/term-dictionary.factory';
import { RelationService } from '@taxonomy/domain/services/relation.service';

const application = [
  GetTaxonomyService,
  SortTaxonomyService,
  MoveTaxonomyService,
  UpdateTaxonomyService,
  DeleteTaxonomyService,
  CreateTaxonomyService,
  CreateRelationshipService,
];

const domain = [RelationService];

const factory = [TermDictionaryFactory];

const infrastructure = [
  TaxonomyRelationShipRepository,
  TaxonomyRepository,
  DictionaryRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature(infrastructure)],
  exports: [...application],
  controllers: [],
  providers: [...application, ...domain, ...factory],
})
export class TaxonomyModule {}
