#!/usr/bin/env bash

set -e

echo "== MedFlow Testing =="

cd backend

source .venv/bin/activate

TEST_DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/medflow_test"

DB_EXISTS=$(psql \
    -U postgres \
    -h localhost \
    -p 5432 \
    -tAc "SELECT 1 FROM pg_database WHERE datname='medflow_test';" \
    | tr -d '[:space:]')

if [ "$DB_EXISTS" != "1" ]; then
    echo "medflow_test database not found - creating it..."

    psql \
        -U postgres \
        -h localhost \
        -p 5432 \
        -c "CREATE DATABASE medflow_test;"
fi

echo "Running tests against medflow_test..."

DATABASE_URL="$TEST_DATABASE_URL" pytest -v

echo "Test run complete."