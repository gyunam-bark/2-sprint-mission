#!/bin/sh
set -e

echo "Running migrations..."
npm run drizzle:generate
npm run drizzle:migrate

echo "Running seed..."
npm run seed || echo "Seed failed or already applied"

echo "Starting Gateway..."
exec npm run start
