import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  app.use(cookieParser());
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'very-important-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // TODO: HTTPS 적용 시 true로 변경
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
