# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY gateway/package*.json ./
RUN npm install

COPY gateway/ ./
COPY chat/ ./chat
COPY game/ ./game

RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runner
WORKDIR /app

COPY gateway/package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/drizzle.config.js ./drizzle.config.js
COPY --from=builder /app/src/db/schema.ts ./src/db/schema.ts
COPY --from=builder /app/chat/src/db/schema.ts ./chat/src/db/schema.ts
COPY --from=builder /app/game/src/db/schema.ts ./game/src/db/schema.ts
COPY gateway/entrypoint.sh /entrypoint.sh
COPY gateway/seed.sh ./seed.sh
COPY gateway/seed.sql ./seed.sql
RUN chmod +x /entrypoint.sh ./seed.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]