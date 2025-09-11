#!/bin/bash
set -e

EMAIL="gyunam.bark@gmail.com"
DOMAINS=(-d messagoom.online -d www.messagoom.online -d api.messagoom.online)
WEBROOT="/usr/share/nginx/html"

CONF_DIR="./nginx/conf.d"
BACKUP_DIR="./nginx/conf.d/backup-$(date +%Y%m%d%H%M%S)"

echo "=== Step 0: conf 백업 ==="
mkdir -p "$BACKUP_DIR"
cp $CONF_DIR/*.conf "$BACKUP_DIR"/
echo "백업 위치: $BACKUP_DIR"

echo "=== Step 1: 발급 전 conf 작성 ==="
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

echo "=== Step 2: Nginx 재시작 (발급 전 conf 적용) ==="
docker compose restart nginx

echo "=== Step 3: 챌린지 파일 배치 및 확인 ==="
mkdir -p ./www/.well-known/acme-challenge
echo "test-ok" > ./www/.well-known/acme-challenge/test.txt
curl -s http://messagoom.online/.well-known/acme-challenge/test.txt || {
  echo "ERROR: messagoom.online 접근 실패"
  exit 1
}
curl -s http://api.messagoom.online/.well-known/acme-challenge/test.txt || {
  echo "ERROR: api.messagoom.online 접근 실패"
  exit 1
}

echo "=== Step 4: Certbot 최초 발급 실행 (http-01 강제) ==="
docker compose run --rm certbot certonly \
  --webroot -w $WEBROOT \
  "${DOMAINS[@]}" \
  --preferred-challenges http-01 \
  --http-01-port 80 \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  -v

echo "=== Step 5: 발급 후 conf 작성 ==="

# --- [추가] resolver 설정을 별도 파일로 분리 ---
cat > $CONF_DIR/_main.conf <<'EOF'
resolver 127.0.0.11 ipv6=off;
EOF

# --- [수정] www.conf에서 resolver 라인 제거 ---
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

server {
    listen 443 ssl;
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

# --- [수정] api.conf에서 resolver 라인 제거 ---
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

server {
    listen 443 ssl;
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

echo "=== Step 6: Nginx 재시작 (발급 후 conf 적용) ==="
docker compose restart nginx

echo "=== Step 7: HTTPS 정상 확인 ==="
curl -vk https://messagoom.online || true
curl -vk https://www.messagoom.online || true
curl -vk https://api.messagoom.online || true

echo "=== Step 8: Certbot 자동 갱신 서비스 실행 ==="
docker compose up -d certbot

echo "SSL 인증서 발급 + Nginx conf 교체 + 자동 갱신 완료"
