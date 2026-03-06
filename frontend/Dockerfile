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
COPY frontend/package.json ./frontend/

# 의존성 설치 (frontend만)
RUN pnpm install --frozen-lockfile --filter frontend

# 프론트엔드 소스 복사
COPY frontend/ ./frontend/

WORKDIR /workspace/frontend

# Vite 빌드 (tsc -b && vite build)
RUN pnpm run build

# ============================================
# Stage 2: Nginx
# ============================================
FROM nginx:alpine AS production

# nginx.conf 템플릿 복사
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template

# 빌드된 정적 파일 복사
COPY --from=builder /workspace/frontend/dist /usr/share/nginx/html

# BACKEND_URL 기본값 설정 (런타임에 envsubst로 치환됨)
ENV BACKEND_URL=http://backend:3000

EXPOSE 80

# nginx:alpine 이미지는 /etc/nginx/templates/*.template 파일을
# envsubst로 자동 치환하여 /etc/nginx/conf.d/에 생성함
CMD ["nginx", "-g", "daemon off;"]
