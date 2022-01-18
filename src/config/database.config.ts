import { InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';

export default {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true' ? true : false,
  entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  retryAttempts: 2,
  verify() {
    if (this.has('database.type') === false) {
      throw new InternalServerErrorException(
        'database config의 type이 설정되지 않았습니다.',
      );
    }
    if (this.has('database.host') === false) {
      throw new InternalServerErrorException(
        'database config의 host가 설정되지 않았습니다.',
      );
    }
    if (this.has('database.port') === false) {
      throw new InternalServerErrorException(
        'database config의 port가 설정되지 않았습니다.',
      );
    }
    if (this.has('database.username') === false) {
      throw new InternalServerErrorException(
        'database config의 username이 설정되지 않았습니다.',
      );
    }
    if (this.has('database.password') === false) {
      throw new InternalServerErrorException(
        'database config의 password가 설정되지 않았습니다.',
      );
    }
    if (this.has('database.database') === false) {
      throw new InternalServerErrorException(
        'database config의 database가 설정되지 않았습니다.',
      );
    }
  },
};
