import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { LoginPlatform, TermUserType, UserSex, UserStatus } from '../enum';

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryColumn({ name: 'user_No' })
  @Field((type) => Number)
  public userNo: number;

  @Column({
    name: 'term_user_type',
    type: 'enum',
    enum: TermUserType,
    nullable: true,
  })
  @Field(() => TermUserType, { nullable: true })
  public termUserType?: TermUserType;

  @Column({
    name: 'email_id',
  })
  @Field((type) => String)
  public emailId: string;

  @Column({
    name: 'password',
  })
  @Field((type) => String)
  public password: string;

  @Column({
    name: 'nickname',
  })
  @Field((type) => String)
  public nickname: string;

  @Column({
    name: 'phone_number',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  public phoneNumber?: string;

  @Column({
    name: 'school_seq',
  })
  @Field((type) => Number)
  public schooSeq: number;

  @Column({
    name: 'sex',
    type: 'enum',
    enum: UserSex,
  })
  @Field((type) => UserSex)
  public sex: UserSex;

  @Column({
    name: 'birth_year',
    nullable: true,
  })
  @Field((type) => Number, { nullable: true })
  public birthYear: number;

  @Column({
    name: 'profile_photo',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  public profilePhoto: string;

  @Column({
    name: 'user_status',
    type: 'enum',
    enum: UserStatus,
    nullable: true,
  })
  @Field((type) => UserStatus, { nullable: true })
  public userStatus?: UserStatus;

  @Column({
    name: 'join_datetime',
    nullable: true,
  })
  @Field((type) => Date, { nullable: true })
  public joinDateTime?: Date;

  @Column({
    name: 'recent_login_datetime',
  })
  @Field((type) => Date, { nullable: true })
  public recentLoginDateTime: Date;

  @Column({
    name: 'device',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  public device?: string;

  //   @Field({
  //       name: 'connecting_count'
  //   })
  //   public connectingCount: number

  @Column({
    name: 'user_profile_text',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  public userProfileText?: string;

  @Column({
    name: 'login_platform',
    type: 'enum',
    enum: LoginPlatform,
    nullable: true,
  })
  @Field((type) => LoginPlatform, { nullable: true })
  public loginPlatform?: LoginPlatform;

  @Column({
    name: 'login_version',
    nullable: true,
  })
  @Field((type) => Number, { nullable: true })
  public loginVersion?: number;

  @Column({
    name: 'login_device',
    nullable: true,
  })
  @Field((type) => String, { nullable: true })
  public loginDevice?: string;
}
