# ===================================================================
#  Builder Stage: 애플리케이션 빌드 전용 스테이지
# ===================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# 네이티브 모듈 빌드에 필요한 도구 설치
RUN apk add --no-cache python3 make g++

# gateway의 package.json을 복사하여 의존성 설치
COPY gateway/package*.json ./
RUN npm install

# TypeScript 컴파일에 필요한 모든 소스 코드를 복사
COPY gateway/ ./
COPY chat/ ./chat/
COPY game/ ./game/

# TypeScript 코드를 JavaScript로 컴파일하여 'dist' 폴더 생성
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

# Drizzle 설정 파일(js) 복사
COPY --from=builder /app/dist/drizzle.config.js ./

# 스크립트 파일들도 builder 스테이지로부터 복사
COPY --from=builder /app/entrypoint.sh /entrypoint.sh
COPY --from=builder /app/seed.sh ./seed.sh
COPY --from=builder /app/seed.sql ./seed.sql
COPY --from=builder /app/wait-for-postgres.sh /wait-for-postgres.sh

RUN chmod +x /entrypoint.sh ./seed.sh /wait-for-postgres.sh

EXPOSE 3000

ENTRYPOINT ["/wait-for-postgres.sh", "db", "/entrypoint.sh"]
