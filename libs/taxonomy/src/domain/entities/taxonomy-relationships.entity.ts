import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FlexType } from '../enums/flex-type.enum';
import { NodeType } from '../enums/node-type.enum';
import { TermTaxonomy } from './term-taxonomy.entity';

@Entity({ name: 'taxonomy_relationships' })
export class TaxonomyRelationShip {
  @PrimaryGeneratedColumn()
  node_id: number;

  @Column({
    type: 'enum',
    enum: NodeType,
    default: null,
  })
  node_type: NodeType;

  @Column()
  start_taxonomy_id: number;

  @Column()
  end_taxonomy_id: number;

  @Column({
    type: 'enum',
    enum: FlexType,
    default: FlexType.SIMPLEX,
  })
  flex_type: FlexType;

  @Column()
  tr_order: number;

  @CreateDateColumn()
  create_datetime: Date;

  @UpdateDateColumn()
  update_datetime: Date;

  @OneToOne(() => TermTaxonomy, (endTaxonomy) => endTaxonomy.taxonomyRelationship)
  @JoinColumn({ name: 'end_taxonomy_id', referencedColumnName: 'term_taxonomy_id' })
  endTaxonomy: TermTaxonomy;

  @ManyToOne(() => TermTaxonomy, (parentTaxonomy) => parentTaxonomy.childTaxonomyRelationship)
  @JoinColumn({ name: 'start_taxonomy_id', referencedColumnName: 'term_taxonomy_id' })
  parentTaxonomy: TermTaxonomy;
}
