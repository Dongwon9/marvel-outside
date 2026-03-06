# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Builder
# ============================================
FROM node:24-alpine AS builder

WORKDIR /workspace

RUN corepack enable

# 워크스페이스 설정 파일 복사 (캐시 레이어 최적화)
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY backend/package.json ./backend/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 백엔드 소스 복사
COPY backend/ ./backend/

WORKDIR /workspace/backend

# Prisma 클라이언트 생성
RUN pnpx prisma generate

# NestJS 빌드
RUN pnpm run build

# 프로덕션 의존성만 재설치 (devDependencies 제거)
RUN pnpm install --frozen-lockfile --prod

# ============================================
# Stage 2: Production
# ============================================
FROM node:24-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app

# 빌드된 결과물 복사
COPY --from=builder /workspace/backend/dist ./dist

# node_modules 복사 (Prisma 네이티브 바이너리 포함)
COPY --from=builder /workspace/backend/node_modules ./node_modules

# Prisma 스키마 & 마이그레이션 (migrate deploy에 필요)
COPY --from=builder /workspace/backend/prisma ./prisma
COPY --from=builder /workspace/backend/prisma.config.ts ./prisma.config.ts

# Generated Prisma 클라이언트 복사
COPY --from=builder /workspace/backend/src/generated ./src/generated

# 프로덕션 엔트리포인트 복사
COPY backend/scripts/docker-entrypoint.prod.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/docker-entrypoint.sh"]
