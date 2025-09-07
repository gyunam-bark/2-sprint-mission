#!/bin/bash

# 프로젝트 경로로 이동
cd /home/ubuntu/gyunas-app

# 의존성 설치 & 빌드
npm install
npm run build

# pm2로 앱 실행 (ecosystem.config.js 기반)
pm2 start ecosystem.config.js

# pm2 자동 재시작 활성화
pm2 save
pm2 startup systemd
