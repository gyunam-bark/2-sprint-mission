# 1단계: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 빌드에 필요한 툴 (node-gyp 의존성)
RUN apk add --no-cache python3 make g++

# 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2단계: 런타임
FROM node:20-alpine
WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드 산출물 복사
COPY --from=builder /app/dist ./dist
COPY .env .env

EXPOSE 3001
CMD ["node", "dist/index.js"]
