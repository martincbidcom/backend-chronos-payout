import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { useContainer } from 'class-validator';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const globalPrefix = 'v1';

  app.setGlobalPrefix(globalPrefix);
  app.use(
    morgan('-> :method :url :status :res[content-length] - :response-time ms'),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Document Api')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.enableCors();
  await app.listen(port, () => {
    //Logger.log('  Listening at http://localhost:' + port + '/' + globalPrefix);
    Logger.log(`🚀🚀Application is running on: http://localhost:${port}/${globalPrefix}`);
  });
}
bootstrap();
