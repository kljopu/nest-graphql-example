import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from 'nestjs-config';
import { join } from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'graphql';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new JsonResponseInterceptor());
  // app.useGlobalFilters(new AllExceptionFilter(app.get(MyLoggerService)));
  app.enableCors();
  app.use(
    helmet.hsts({
      maxAge: 15552000,
      includeSubDomains: true,
    }),
  );
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Access-Control-Allow-Origin',
    );
    next();
  });
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');

  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  appConfig.verify();

  const { PORT } = appConfig;
  await app.listen(PORT || 3000, () => {
    console.log(`server listen on ${PORT}`);
    // const loggerService = app.get(MyLoggerService);
    // loggerService.log(`server listen on ${PORT}`, 'bootstrap');
  });
}
bootstrap();
