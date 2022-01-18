import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UsersInfoRequestDto {
  @IsOptional()
  @IsNumber()
  @Field({ nullable: true })
  userNo?: number;
}
