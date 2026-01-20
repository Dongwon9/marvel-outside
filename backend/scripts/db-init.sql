-- Initialize development and test databases
-- This script is executed when PostgreSQL container starts

-- Create development database if it doesn't exist
CREATE DATABASE IF NOT EXISTS marvel_dev;

-- Create test database if it doesn't exist
CREATE DATABASE IF NOT EXISTS marvel_test;

-- Grant privileges to marvel user (created by postgres image)
-- If marvel user doesn't exist, it will be created by the postgres image with POSTGRES_USER env var
GRANT ALL PRIVILEGES ON DATABASE marvel_dev TO marvel;
GRANT ALL PRIVILEGES ON DATABASE marvel_test TO marvel;
