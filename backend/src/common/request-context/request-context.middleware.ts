import crypto from 'crypto';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RequestContext } from './request-context';

interface RequestWithContext extends Request {
  user?: {
    id: string;
  };
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestWithContext, res: Response, next: NextFunction): void {
    const id = (req as unknown as Record<string, unknown>).id;
    const headerXRequestId = req.headers['x-request-id'];
    const rawId = typeof id === 'string' ? id : headerXRequestId;
    const reqId = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : undefined;
    const finalReqId = typeof reqId === 'string' ? reqId : crypto.randomUUID();
    const store = {
      reqId: finalReqId,
      userId: req.user?.id,
      path: req.path,
      method: req.method,
    };

    res.setHeader('X-Request-ID', finalReqId);

    RequestContext.run(store, () => {
      next();
    });
  }
}
