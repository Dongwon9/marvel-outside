#!/bin/sh

# Docker entrypoint script for NestJS backend (Production)
# Runs migrations and starts the production server

set -e

echo "=== Marvel Outside Backend (Production) ==="
echo "Node.js version: $(node -v)"

echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "Migration failed!"
  exit 1
}
echo "Migrations completed successfully!"

echo "Starting NestJS production server..."
exec node dist/main
