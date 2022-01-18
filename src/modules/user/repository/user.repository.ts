import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../domain/entity/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
