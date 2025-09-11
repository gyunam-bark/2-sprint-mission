#!/bin/bash
set -e

# --- 설정 변수 ---
EMAIL="gyunam.bark@gmail.com"
DOMAINS=(-d messagoom.online -d www.messagoom.online -d api.messagoom.online)
WEBROOT="/usr/share/nginx/html"
CONF_DIR="./nginx/conf.d"
NGINX_CONTAINER="nginx-proxy"

# --- 스크립트 시작 ---

echo "=== Step 0: 기존 설정 파일 백업 ==="
BACKUP_DIR="./nginx/conf.d/backup-$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

cp $CONF_DIR/*.conf "$BACKUP_DIR"/ 2>/dev/null || true
echo "백업 위치: $BACKUP_DIR"

echo "=== Step 1: HTTP-01 챌린지용 Nginx 설정 작성 ==="
cat > $CONF_DIR/_main.conf <<'EOF'
# 이 파일은 Step 5에서 resolver 설정으로 덮어씌워집니다.
EOF

cat > $CONF_DIR/www.conf <<'EOF'
server {
    listen 80;
    server_name messagoom.online www.messagoom.online;
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}
EOF

cat > $CONF_DIR/api.conf <<'EOF'
server {
    listen 80;
    server_name api.messagoom.online;
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}
EOF

echo "=== Step 2: Nginx 컨테이너 실행 ==="
docker compose up -d nginx

echo "=== Step 3: 챌린지 테스트 파일 배치 및 확인 ==="
CHALLENGE_DIR="$WEBROOT/.well-known/acme-challenge"
TEST_FILE_URL="http://messagoom.online/.well-known/acme-challenge/test.txt"
EXPECTED_CONTENT="test-ok-$(date +%s)" 

echo "Nginx 컨테이너 내부에 테스트 파일 생성 중..."
docker compose exec $NGINX_CONTAINER mkdir -p $CHALLENGE_DIR
docker compose exec $NGINX_CONTAINER sh -c "echo '$EXPECTED_CONTENT' > $CHALLENGE_DIR/test.txt"

echo "HTTP를 통해 테스트 파일 접근 및 내용 확인 중..."

sleep 3
CONTENT=$(curl -s $TEST_FILE_URL)

if [ "$CONTENT" = "$EXPECTED_CONTENT" ]; then
    echo "✅ 챌린지 테스트 성공!"
else
    echo "❌ ERROR: 챌린지 테스트 실패. Nginx 설정을 확인하세요."
    echo "기대했던 내용: $EXPECTED_CONTENT"
    echo "실제 수신된 내용: $CONTENT"
    exit 1
fi

echo "=== Step 4: Certbot으로 SSL 인증서 발급/갱신 실행 ==="
docker compose run --rm certbot certonly \
  --webroot -w $WEBROOT \
  "${DOMAINS[@]}" \
  --preferred-challenges http-01 \
  --http-01-port 80 \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --force-renewal \
  -v

echo "=== Step 5: HTTPS 적용을 위한 Nginx 설정 작성 ==="
cat > $CONF_DIR/_main.conf <<'EOF'
resolver 127.0.0.11 ipv6=off;
EOF

cat > $CONF_DIR/www.conf <<'EOF'
server {
    listen 80;
    server_name messagoom.online www.messagoom.online;
    location /.well-known/acme-challenge/ { root /usr/share/nginx/html; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    server_name messagoom.online www.messagoom.online;
    ssl_certificate /etc/letsencrypt/live/messagoom.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/messagoom.online/privkey.pem;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

cat > $CONF_DIR/api.conf <<'EOF'
server {
    listen 80;
    server_name api.messagoom.online;
    location /.well-known/acme-challenge/ { root /usr/share/nginx/html; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl http2;
    server_name api.messagoom.online;
    ssl_certificate /etc/letsencrypt/live/messagoom.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/messagoom.online/privkey.pem;
    location / {
        proxy_pass http://gateway-service:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

echo "=== Step 6: Nginx 설정 다시 불러오기 (Graceful Reload) ==="
docker compose exec $NGINX_CONTAINER nginx -s reload

echo "=== Step 7: HTTPS 연결 및 인증서 유효성 확인 ==="

sleep 3

curl -v --fail https://messagoom.online || { echo "ERROR: HTTPS check failed for messagoom.online"; exit 1; }
curl -v --fail https://www.messagoom.online || { echo "ERROR: HTTPS check failed for www.messagoom.online"; exit 1; }
curl -v --fail https://api.messagoom.online || { echo "ERROR: HTTPS check failed for api.messagoom.online"; exit 1; }
echo "모든 도메인 HTTPS 연결 확인 완료."

echo "=== Step 8: Certbot 자동 갱신 서비스 활성화 ==="
docker compose up -d certbot

echo "🎉 SSL 인증서 발급 및 HTTPS 설정, 자동 갱신까지 모두 완료되었습니다."