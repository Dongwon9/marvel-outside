import crypto from 'crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RequestContext } from './request-context';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const rawId = (req as any).id || req.headers['x-request-id'];
    const reqId = Array.isArray(rawId) ? rawId[0] : (rawId as string | undefined);
    const store = {
      reqId: reqId ?? crypto.randomUUID(),
      userId: (req as any).user?.id,
      path: req.path,
      method: req.method,
    };

    res.setHeader('X-Request-ID', store.reqId);

    RequestContext.run(store, () => {
      next();
    });
  }
}
