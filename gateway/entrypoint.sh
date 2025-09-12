#!/bin/sh
# Docker 컨테이너 시작 시 실행되는 스크립트
set -e

# 1. 데이터베이스 스키마를 최신 상태로 동기화합니다.
echo "Syncing database schema..."
npm run drizzle:migrate

# 2. 초기 데이터를 시딩합니다. (이미 존재하면 건너뜁니다)
echo "Running seed script..."
npm run seed

# 3. 모든 준비가 끝나면, 메인 애플리케이션 서버를 시작합니다.
echo "Starting application server..."
npm start
