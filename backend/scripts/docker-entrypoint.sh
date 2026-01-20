#!/bin/sh

# Docker entrypoint script for NestJS backend
# Runs migrations and starts the development server

set -e

echo "Waiting for database to be ready..."

# Wait for PostgreSQL to accept connections
max_retries=30
retry_count=0
while ! pg_isready -h postgres -U marvel > /dev/null 2>&1; do
  retry_count=$((retry_count + 1))
  if [ $retry_count -ge $max_retries ]; then
    echo "Failed to connect to PostgreSQL after $max_retries attempts"
    exit 1
  fi
  echo "Waiting for PostgreSQL... (attempt $retry_count/$max_retries)"
  sleep 1
done

echo "Database is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
pnpm prisma migrate deploy || {
  echo "Migration failed, attempting reset for development..."
  pnpm prisma migrate reset --force || exit 1
}

echo "Migrations completed successfully!"

# Start the NestJS development server
echo "Starting NestJS development server..."
exec pnpm run start:dev
