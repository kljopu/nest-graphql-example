import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TermTaxonomy } from '@taxonomy/domain/entities/term-taxonomy.entity';
import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  Column,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../../user/domain/entity/user.entity';

@Entity({ name: 'student' })
@ObjectType()
export class Student {
  @PrimaryColumn({ name: 'user_No', unique: true })
  @OneToOne(() => User, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn()
  @Field(() => Int, { name: 'user_No' })
  userNo: Number;

  @Column({ name: 'parent_phone_number', default: null, nullable: true })
  @Field(() => Int, { name: 'parent_phone_number', nullable: true })
  parentPhoneNumber: Number;

  @Column({ name: 'parant_name', default: null, nullable: true })
  @Field(() => String, { nullable: true })
  parentName: string;

  //   taxonomy와 연결
  @ManyToOne((type) => TermTaxonomy)
  @JoinColumn({ name: 'year', referencedColumnName: 'term_taxonomy_id' })
  @Field(() => Int, { nullable: true })
  public taxonomy: TermTaxonomy;

  @Column({ name: 'year' })
  @Field(() => Int)
  @RelationId((student: Student) => student.taxonomy)
  public year: number;
}
