import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { FileLogger } from './log/logger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

config();

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: new FileLogger('NestApplication'),

  });
  const port = configService.get('PORT');

  app.enableCors({
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());



  await app
  .listen(port)
  .then(() => console.log(`App is listening on port ${port}.`));
}
bootstrap();
