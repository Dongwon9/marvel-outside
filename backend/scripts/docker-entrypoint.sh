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

# Run Prisma migrations (use workspace filter to ensure backend's prisma is used)
echo "Running Prisma migrations..."
pnpx prisma migrate deploy || {
  echo "Migration failed, attempting reset for development..."
  pnpx prisma migrate reset --force || exit 1
}
echo "Migrations completed successfully!"
echo "Seeding database..."
pnpx prisma db seed || {
  echo "Database seeding failed! Dadabase will be empty."
}
# Start the NestJS development server (run within backend workspace)
echo "Starting NestJS development server..."
exec pnpm -F backend run start:dev
