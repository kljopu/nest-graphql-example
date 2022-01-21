import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { TutoringState } from './enum';

@ObjectType()
@Entity({ name: 'lecture_vedio_tutoring' })
export class LectureVedioTutoring {
  @PrimaryColumn({ name: 'lecture_vt_No' })
  @Field(() => Int)
  lectureVTNo: number;

  // student와 연결
  // @Field()
  // student

  // term_taxonomy와 연결
  // lecture_subject_id

  @Column({
    name: 'tutoring_state',
    type: 'enum',
    enum: TutoringState,
    nullable: true,
  })
  @Field(() => TutoringState, { nullable: true })
  public tutoringState?: TutoringState;

  // payment 엔티티와 연결
  //   @ManyToOne(
  //     (type) => Payment,
  //     // payment => user.cards,
  //     {
  //       onUpdate: 'CASCADE',
  //       onDelete: 'CASCADE',
  //       nullable: false,
  //     },
  //   )
  //   @JoinColumn({ name: 'payment_item', referencedColumnName: 'id', default: null })
  //   public user: User;

  //   @Column({ name: 'user_id' })
  //   @RelationId((payment: Payment) => lectureVedioTutoring.payment)
  //   public paymentItem: number;
}
