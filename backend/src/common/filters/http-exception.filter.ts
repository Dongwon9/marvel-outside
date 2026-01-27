import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

import { RequestContext } from '../request-context/request-context';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const reqCtx = RequestContext.get();
    const path = request.path;
    const method = request.method;
    const nodeEnv = process.env.NODE_ENV || 'development';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Http Exception';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const logData = {
      msg: 'http.exception',
      reqId: reqCtx?.reqId,
      userId: reqCtx?.userId,
      method,
      path,
      status,
      message,
      ...(nodeEnv === 'development' && {
        stack: exception.stack,
      }),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(logData);
    } else {
      this.logger.warn(logData);
    }

    response.status(status).json({
      statusCode: status,
      message,
      path,
      timestamp: new Date().toISOString(),
      reqId: reqCtx?.reqId,
    });
  }
}
