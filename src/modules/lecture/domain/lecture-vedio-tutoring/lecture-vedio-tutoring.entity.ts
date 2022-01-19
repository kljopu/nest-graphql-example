import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

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
}
