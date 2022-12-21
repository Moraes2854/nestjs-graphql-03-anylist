import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // nest no tira error al tener dos args
      // no es necesario porque al mandar una propiedad invalida graphql lo detecta
      // forbidNonWhitelisted: true,
    })
  );
  await app.listen(3000);
}
bootstrap();
