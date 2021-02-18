import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger: ['verbose', 'log', 'debug', 'warn', 'error'],
  });
  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('Test API')
    .setVersion('1.0')
    .addTag('TEST')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.use(cookieParser());
  await app.listen(4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
