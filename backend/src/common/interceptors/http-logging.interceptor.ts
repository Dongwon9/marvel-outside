import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RequestContext } from '../request-context/request-context';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    const path = request.path;
    const method = request.method;

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startTime;
          const statusCode = response.statusCode;
          const ctx = RequestContext.get();

          this.logger.info({
            msg: 'http.request',
            reqId: ctx?.reqId,
            userId: ctx?.userId,
            method,
            path,
            statusCode,
            durationMs,
          });
        },
        error: error => {
          const durationMs = Date.now() - startTime;
          const statusCode = response.statusCode || 500;
          const ctx = RequestContext.get();

          this.logger.error({
            msg: 'http.error',
            reqId: ctx?.reqId,
            userId: ctx?.userId,
            method,
            path,
            statusCode,
            durationMs,
            error: error.message,
          });
        },
      }),
    );
  }
}
