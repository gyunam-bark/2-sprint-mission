# gateway/Dockerfile

# ===================================================================
#  Builder Stage: 애플리케이션 빌드 전용 스테이지
# ===================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# gateway의 package.json을 복사하여 의존성 설치
COPY gateway/package*.json ./
RUN npm install

# (수정) TypeScript 컴파일에 필요한 모든 소스 코드를 복사합니다.
COPY gateway/ ./
COPY chat/ ./chat/
COPY game/ ./game/

# TypeScript 코드를 JavaScript로 컴파일하여 'dist' 폴더 생성
# 이제 빌드 시 chat/와 game/의 파일을 참조할 수 있습니다.
RUN npm run build


# ===================================================================
#  Runner Stage: 실제 애플리케이션 실행 전용 스테이지
# ===================================================================
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache postgresql-client netcat-openbsd

# builder 스테이지로부터 package.json 파일을 복사
COPY --from=builder /app/package*.json ./

# 프로덕션용 의존성만 설치
RUN npm ci --omit=dev

# builder 스테이지로부터 컴파일된 'dist' 폴더 전체를 복사
COPY --from=builder /app/dist ./dist

# Drizzle 마이그레이션에 필요한 모든 schema 파일과 설정 파일을 복사합니다.
COPY --from=builder /app/drizzle.config.js ./
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
# (수정) chat과 game의 schema.ts 파일도 포함시킵니다.
COPY --from=builder /app/chat/src/db/schema.ts ./chat/src/db/schema.ts
COPY --from=builder /app/game/src/db/schema.ts ./game/src/db/schema.ts

# 스크립트 파일들도 builder 스테이지로부터 복사
COPY --from=builder /app/entrypoint.sh /entrypoint.sh
COPY --from=builder /app/seed.sh ./seed.sh
COPY --from=builder /app/seed.sql ./seed.sql
COPY --from=builder /app/wait-for-postgres.sh /wait-for-postgres.sh

RUN chmod +x /entrypoint.sh ./seed.sh /wait-for-postgres.sh

EXPOSE 3000

ENTRYPOINT ["/wait-for-postgres.sh", "db", "/entrypoint.sh"]