import { TermDictionary } from '@taxonomy/domain/entities/term-dictionary.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TermDictionary)
export class DictionaryRepository extends Repository<TermDictionary> {
  async exists(name: string): Promise<boolean> {
    const found = await this.findOne({ name: name });
    if (!found) {
      return false;
    }

    return true;
  }

  async findOrCreateByName(name: string): Promise<TermDictionary> {
    const found = await this.findOne({ name: name });
    const newDictionaryName = found ?? (await this.save({ name: name }));

    return newDictionaryName;
  }
}
