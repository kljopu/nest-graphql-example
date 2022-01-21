import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurriculumTh } from '../enums/curriculum-th.enum';
import { TaxonomyType } from '../enums/taxonomy.enum';
import { TaxonomyRelationShip } from './taxonomy-relationships.entity';
import { TermDictionary } from './term-dictionary.entity';

@Entity({ name: 'term_taxonomy' })
export class TermTaxonomy {
  @PrimaryGeneratedColumn()
  term_taxonomy_id: number;

  @Column({
    type: 'enum',
    enum: TaxonomyType,
  })
  taxonomy: TaxonomyType;

  @Column({
    length: 500,
    default: null,
  })
  description: string;

  @Column({ default: 0 })
  count: number;

  @Column()
  parent: number;

  @Column({ default: 0 })
  term_depth: number;

  @Column({
    length: 15,
    default: '0.0.1',
  })
  version: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  inventory_No: number;

  @Column({
    type: 'set',
    enum: CurriculumTh,
    default: null,
  })
  curriculum_th: CurriculumTh[];

  @CreateDateColumn({ default: Date.now() })
  create_datetime: Date;

  @UpdateDateColumn({ default: Date.now() })
  update_datetime: Date;

  @ManyToOne(() => TermDictionary, (dictionary) => dictionary.taxonomy, { eager: true })
  @JoinColumn({ name: 'term_id', referencedColumnName: 'term_id' })
  dictionary: TermDictionary;

  /**
   *  OneToOne 관계에서 외래키가 없는 테이블은 조인컬럼을 사용하지 않지만, 외래키가 있는 테이블에서 외래키로 여러 테이블의 관계를 정의할때,
   *  join시 사용하는 컬럼인식이 잘 되지 않아 양쪽으로 입력해줘야함
   */
  @OneToOne(() => TaxonomyRelationShip, (taxonomyRelationship) => taxonomyRelationship.endTaxonomy)
  taxonomyRelationship: TaxonomyRelationShip;

  @OneToMany(
    () => TaxonomyRelationShip,
    (childTaxonomyRelationship) => childTaxonomyRelationship.parentTaxonomy,
  )
  @JoinColumn({ name: 'term_taxonomy_id', referencedColumnName: 'start_taxonomy_id' })
  childTaxonomyRelationship: TaxonomyRelationShip[];

  // domain entity작업시 이동해야할 로직
  isRoot(): boolean {
    if (this.term_taxonomy_id === 1) {
      return true;
    }
    return false;
  }
}
