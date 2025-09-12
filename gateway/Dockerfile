# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

# gateway의 package.json을 먼저 복사하여 종속성 캐싱 활용
COPY gateway/package*.json ./
RUN npm install

# 빌드에 필요한 모든 소스 코드 복사
COPY gateway/ ./
COPY chat/ ./chat
COPY game/ ./game

RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# gateway의 package.json을 복사하여 프로덕션 종속성 설치
COPY gateway/package*.json ./
RUN npm ci

# 빌드된 결과물 및 마이그레이션에 필요한 파일들 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle.config.js ./drizzle.config.js
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder /app/chat/src/db/schema.ts ./chat/src/db/schema.ts
COPY --from=builder /app/game/src/db/schema.ts ./game/src/db/schema.ts

# entrypoint 스크립트는 gateway 폴더 안에 있으므로 경로 명시
COPY gateway/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]