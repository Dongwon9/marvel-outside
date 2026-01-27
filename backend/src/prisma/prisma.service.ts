import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { RequestContext } from '../common/request-context/request-context';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    private configService: ConfigService,
    @InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger,
  ) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({
      adapter,
      log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ],
    });

    (this as any).$on('query', (e: any) => {
      const ctx = RequestContext.get();
      this.logger.debug({
        msg: 'prisma.query',
        reqId: ctx?.reqId,
        userId: ctx?.userId,
        durationMs: e?.duration,
        query: e?.query,
        params: e?.params,
      });
    });

    (this as any).$on('warn', (e: any) => {
      const ctx = RequestContext.get();
      this.logger.warn({ msg: 'prisma.warn', reqId: ctx?.reqId, message: e?.message });
    });

    (this as any).$on('error', (e: any) => {
      const ctx = RequestContext.get();
      this.logger.error({ msg: 'prisma.error', reqId: ctx?.reqId, message: e?.message });
    });
  }
}
