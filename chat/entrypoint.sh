#!/bin/sh
set -e

echo "Waiting for Postgres..."
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Postgres is up"

echo "Starting Chat service..."
exec npm run start
