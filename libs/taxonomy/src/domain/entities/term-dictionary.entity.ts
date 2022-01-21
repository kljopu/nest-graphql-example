import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TermTaxonomy } from './term-taxonomy.entity';

@Entity({ name: 'term_dictionary' })
export class TermDictionary {
  @PrimaryGeneratedColumn()
  term_id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 200 })
  description: string;

  @OneToMany(() => TermTaxonomy, (term_taxonomy) => term_taxonomy.dictionary)
  @JoinColumn({ referencedColumnName: 'term_id' })
  taxonomy: TermTaxonomy;

  isSameName(name: string): boolean {
    return this.name === name;
  }
}
