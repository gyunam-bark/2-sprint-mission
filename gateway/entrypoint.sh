#!/bin/sh
set -e

echo "Waiting for Postgres..."
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Postgres is up"

echo "Running migrations..."
npm run drizzle:generate
npm run drizzle:migrate

echo "Running seed..."
npm run seed || echo "Seed failed or already applied"

echo "Starting Gateway..."
exec npm run start
