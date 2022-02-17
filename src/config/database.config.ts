import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { config } from 'dotenv';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/domain/entity/user.entity';

config();
console.log(path.join(__dirname, '../src/modules/**/*.entity{.ts,.js}'));

// export default () => ({
//   type: process.env.DB_TYPE as any,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   synchronize: false,
//   logging: process.env.DB_LOGGING === 'true' ? true : false,
//   entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
//   autoLoadEntities: true,
//   retryAttempts: 2,
//   verify() {
//     if (this.has('database.type') === false) {
//       throw new InternalServerErrorException(
//         'database config의 type이 설정되지 않았습니다.',
//       );
//     }
//     if (this.has('database.host') === false) {
//       throw new InternalServerErrorException(
//         'database config의 host가 설정되지 않았습니다.',
//       );
//     }
//     if (this.has('database.port') === false) {
//       throw new InternalServerErrorException(
//         'database config의 port가 설정되지 않았습니다.',
//       );
//     }
//     if (this.has('database.username') === false) {
//       throw new InternalServerErrorException(
//         'database config의 username이 설정되지 않았습니다.',
//       );
//     }
//     if (this.has('database.password') === false) {
//       throw new InternalServerErrorException(
//         'database config의 password가 설정되지 않았습니다.',
//       );
//     }
//     if (this.has('database.database') === false) {
//       throw new InternalServerErrorException(
//         'database config의 database가 설정되지 않았습니다.',
//       );
//     }
//   },
// });

// export default () => ({
//   type: process.env.DB_TYPE as any,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   synchronize: false,
//   logging: process.env.DB_LOGGING === 'true' ? true : false,
//   entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
//   autoLoadEntities: true,
//   retryAttempts: 2,
// });

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: configService.get('DB_HOST') || 'localhost',
      port: configService.get('DB_PORT') || 3306,
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [path.join(__dirname, '../src/modules/**/*.entity{.ts,.js}')],
      synchronize: false,
      logging: true,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
