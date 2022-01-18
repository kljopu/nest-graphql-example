import { Resolver, Query, Args } from '@nestjs/graphql';
import { User } from '../../domain/entity/user.entity';
import { UserInfoApplicationService } from './user-info.application.service';
import { UserInfoResponseDto, UsersInfoRequestDto } from './dtos';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userInfoApplicationService: UserInfoApplicationService,
  ) {}

  //   @Query((returns) => any)
  //   public async test(): Promise<any> {
  //     return await true;
  //   }

  //   @Query((returns) => [User])
  //   async getAllUsers(): Promise<User[]> {
  //     return await this.userInfoApplicationService.findAllUsersInfo();
  //   }

  @Query((returns) => UserInfoResponseDto)
  async getAllUsersInfo(
    @Args('params') params: UsersInfoRequestDto,
  ): Promise<UserInfoResponseDto> {
    return await this.userInfoApplicationService.findAllUsers({
      userNo: params.userNo,
    });
  }
}
