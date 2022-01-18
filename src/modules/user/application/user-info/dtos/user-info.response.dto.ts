import { ObjectType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { User } from '../../../domain/entity/user.entity';
import { TermUserType } from '../../../domain/enum/term-user-type.enum';

@ObjectType()
export class UserInfoResponseDto {
  @Field((type) => [User], { nullable: true })
  users?: User[];
}

@ObjectType()
export class UserInfoResponse {
  @Field((type) => Number)
  public userNo: number;

  @Field(() => TermUserType, { nullable: true })
  public termUserType?: TermUserType;
}
