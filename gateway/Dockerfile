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
