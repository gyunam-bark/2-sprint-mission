#!/bin/sh
# Docker 컨테이너 시작 시 실행되는 스크립트
set -e

# 0. DB 초기화 (운영 이벤트성 환경: 매번 리셋)
echo "Resetting database $DB_NAME..."
psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# 1. 데이터베이스 스키마를 최신 상태로 동기화
echo "Syncing database schema..."
npm run drizzle:migrate

# 2. 초기 데이터를 시딩 (존재해도 다시 삽입하도록 설계)
echo "Running seed script..."
npm run seed

# 3. 애플리케이션 서버 시작
echo "Starting application server..."
npm start
