import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { UserResolver } from './application/user-info/user-info.resolver';
import { UserInfoApplicationService } from './application/user-info/user-info.application.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserResolver, UserInfoApplicationService],
  exports: [],
})
export class UserModule {}
