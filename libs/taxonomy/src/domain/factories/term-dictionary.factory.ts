import { Injectable } from '@nestjs/common';
import { DictionaryRepository } from '@taxonomy/database/repository/dictionary.repository';
import { EntityManager } from 'typeorm';
import { TermDictionary } from '../entities/term-dictionary.entity';

/**
 * term-dictionary의 팩토리 클래스입니다.
 */
@Injectable()
export class TermDictionaryFactory {
  async create(entityManager: EntityManager, name: string): Promise<TermDictionary> {
    const dictionaryRepository = entityManager.getCustomRepository(DictionaryRepository);
    const found = await dictionaryRepository.findOne({ name: name });

    return found ?? (await dictionaryRepository.save({ name: name }));
  }
}
