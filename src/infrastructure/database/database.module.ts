import * as path from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Global } from '@nestjs/common';
import { typeOrmConfigAsync } from '../../config/database.config';
import { UserModule } from '../../modules/user/user.module';
import { TaxonomyModule } from '../../../libs/taxonomy/src/taxonomy.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: config.get<any>('DB_TYPE'),
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT'), 10),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: false,
        logging: config.get<string>('DB_LOGGING') === 'true' ? true : false,
        entities: [path.join(__dirname, '../src/modules/**/*.entity{.ts,.js}')],
        autoLoadEntities: true,
        retryAttempts: 2,
        // console.log(config.get('database'));
        // console.log(config.get<string>('DATABASE_HOST'));
        // config.get('database').verify();
        // return config.get('database');
      }),
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    // UserModule,
    // TaxonomyModule,
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
