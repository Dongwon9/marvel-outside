import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

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
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  app.use(cookieParser());
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET') || 'very-important-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: 'lax',
        secure: (configService.get<string>('NODE_ENV') || 'development') === 'production',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
void bootstrap();
