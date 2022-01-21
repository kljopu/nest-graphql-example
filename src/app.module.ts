import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'nestjs-config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './modules/user/user.module';
import { join } from 'path';
import { TaxonomyModule } from '@taxonomy/taxonomy.module';

@Module({
  imports: [
    ConfigModule.resolveRootPath(__dirname).load(
      '../src/./config/*.config.{ts,js}',
      {
        modifyConfigName: (name) => name.replace('.config', ''),
        path: path.join(__dirname, '../../.env'),
        // eslint-disable-next-line no-nested-ternary
        // process.env.NODE_ENV === 'production'
        //   ? path.join(__dirname, '../.env.production')
        //   : process.env.NODE_ENV === 'staging'
        //   ? path.join(__dirname, '../.env.staging')
        //   : path.join(__dirname, '../.env'),
      },
    ),
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: true,
    }),
    TaxonomyModule,
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
