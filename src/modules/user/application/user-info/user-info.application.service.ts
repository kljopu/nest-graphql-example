import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Not } from 'typeorm';
import { User } from '../../domain/entity/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { UserInfoResponseDto } from './dtos/user-info.response.dto';

@Injectable()
export class UserInfoApplicationService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findAllUsers(
    findConfitions: FindConditions<User>,
  ): Promise<UserInfoResponseDto> {
    // 임시 변수
    console.log(findConfitions);

    // const findCondition: any = {};
    // findCondition['userNo'] = `${Not(83355)} && `.concat(
    //   findConfitions.userNo.toString(),
    // );
    // console.log(findCondition);
    const users = await this.userRepository.find(
      // enum 값 nullable: true 적용 안되는 이슈 때문에 적용
      //   findCondition,
      {
        where: {
          userNo: Not(83355) && findConfitions.userNo,
        },
      },
    );
    // const users = await this.userRepository.find(findConfitions);
    if (users.length === 0 || undefined || null) {
      throw new NotFoundException('해당 유저 정보가 존재하지 않습니다.');
    }
    console.log(users[0]);

    // return users;
    return {
      users,
    };
  }

  //   public async findAllUsersInfo(): Promise<User[]> {
  //     return await this.userRepository.find();
  //   }
}
