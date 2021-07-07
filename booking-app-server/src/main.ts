import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import compression from 'fastify-compress';
import { fastifyHelmet } from 'fastify-helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidationException } from './shared/validation/validation.exception';

export function covertErrorToObject(errors: ValidationError[]) {
  const result = {};

  for (const error of errors) {
    result[error.property] = Object.values(error.constraints)[0];
    if (Object.keys(error.children).length > 0) {
      result[error.property] = covertErrorToObject(error.children);
    }
  }

  return result;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );

  app.enableCors();

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  await app.register(fastifyHelmet);

  app.register(compression);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new ValidationException(covertErrorToObject(errors));
      },
    }),
  );

  await app.listen(configService.get('PORT'), '0.0.0.0');
}
bootstrap();
