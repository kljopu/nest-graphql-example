import { DuplicateNameException } from '@taxonomy/exceptions/duplicate-name.exception';
import { TermTaxonomy } from './term-taxonomy.entity';

/**
 * taxonomy의 집합은 보통 자식 taxonomy들로 사용할 가능성이 있다.
 */
export class TaxonomyCollection {
  private taxonomys: TermTaxonomy[];

  constructor(taxonomys: TermTaxonomy[]) {
    this.taxonomys = taxonomys;
  }

  get(): TermTaxonomy[] {
    return this.taxonomys;
  }

  /**
   * 부모 taxonomy에서 자식들의 taxonomy를 가져올땐
   * 자식들이 존재하지 않을 수 있다. 때문에 존재하지 않으면 -1을 반환하도록 한다.
   * @returns
   */
  getLastOrder(): number {
    if (this.taxonomys.length === 0) {
      return -1;
    }
    const taxonomy = this.taxonomys[this.taxonomys.length - 1];
    return taxonomy.taxonomyRelationship.tr_order;
  }

  /**
   * taxonomy collection에서 중복되는 이름이 있는지 체크합니다.
   *
   * @param name
   * @returns
   */
  checkDuplicateName(name: string): boolean {
    this.taxonomys.forEach((taxonomy) => {
      if (taxonomy.dictionary.name === name) {
        throw new DuplicateNameException();
      }
    });
    return true;
  }
}
