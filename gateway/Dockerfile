# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# g++ 등 빌드에 필요한 의존성 설치
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

# 모든 소스 코드를 복사
COPY . .
# 애플리케이션과 drizzle.config.ts를 함께 빌드
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# devDependencies 포함하여 npm ci 실행 (drizzle-kit 설치)
COPY package*.json ./
RUN npm ci

# --- [수정된 부분 시작] ---
# 1. 빌드된 애플리케이션 코드 복사
COPY --from=builder /app/dist ./dist

# 2. 빌드된 drizzle 설정 파일 복사
COPY --from=builder /app/drizzle.config.js ./drizzle.config.js

# 3. drizzle-kit이 참조할 원본 스키마 파일들 복사
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder /app/../chat/src/db/schema.ts ../chat/src/db/schema.ts
COPY --from=builder /app/../game/src/db/schema.ts ../game/src/db/schema.ts

# --- [수정된 부분 끝] ---

# 진입점 스크립트 복사 및 실행 권한 부여
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]