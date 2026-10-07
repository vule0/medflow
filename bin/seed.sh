#!/usr/bin/env bash

set -euo pipefail

echo "== MedFlow Database Seed =="

# get directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKEND_DIR="$ROOT_DIR/backend"
ENV_FILE="$BACKEND_DIR/.env"
SEED_SQL="$ROOT_DIR/db/seed_data.sql"

RESET=false
YES=false

# parsing arguments
while [ "$#" -gt 0 ]; do
    case "$1" in
        --reset)
            RESET=true
            ;;
        --yes)
            YES=true
            ;;
        *)
            echo "Error: Unknown argument '$1'."
            echo "Usage: bin/seed.sh [--reset] [--yes]"
            exit 1
            ;;
    esac

    shift
done

if [ "$YES" = true ] && [ "$RESET" = false ]; then
    echo "Error: --yes can only be used with --reset."
    exit 1
fi

# configuring env variables
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE was not found."
    echo "Run bin/setup.sh first."
    exit 1
fi

echo "Loading database configuration from backend/.env..."

set -a
source "$ENV_FILE"
set +a

if [ -z "${DATABASE_URL:-}" ]; then
    echo "ERROR: DATABASE_URL is not set in backend/.env."
    exit 1
fi


VENV_DIR="$BACKEND_DIR/.venv"

if [ ! -d "$VENV_DIR" ]; then
    echo "ERROR: Python virtual environment does not exist."
    echo "Run bin/setup.sh first."
    exit 1
fi

# venv activation for windows/mac
if [ -f "$VENV_DIR/bin/activate" ]; then
    source "$VENV_DIR/bin/activate"
elif [ -f "$VENV_DIR/Scripts/activate" ]; then
    source "$VENV_DIR/Scripts/activate"
else
    echo "ERROR: Could not find the virtual environment activation script."
    exit 1
fi


# check db using python
echo "Checking database connection..."

if ! python - <<'PY'
import asyncio
import os
import sys

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


async def check_database():
    url = os.environ["DATABASE_URL"]
    engine = create_async_engine(url)

    try:
        async with engine.connect() as connection:
            await connection.execute(text("SELECT 1"))
    finally:
        await engine.dispose()

try:
    asyncio.run(check_database())
except Exception as exc:
    print(f"ERROR: Could not connect to the database")
    sys.exit(1)
PY
then
    echo "Cannot reach database."
    exit 1
fi

echo "Database connected."


# create tables
echo "Creating database tables..."

cd "$BACKEND_DIR"

python3 -m scripts.create_tables


if [ "$RESET" = true ]; then
    echo
    echo "WARNING: --reset will delete the existing MedFlow seed data."
    echo

    if [ "$YES" = false ]; then
        read -r -p "Continue? [y/N] " CONFIRM

        case "$CONFIRM" in
            y|Y|yes|YES)
                ;;
            *)
                echo "Reset cancelled."
                exit 0
                ;;
        esac
    fi

    echo "Clearing seed data..."

    psql "$DATABASE_URL" <<'SQL'
TRUNCATE TABLE
    service_reports,
    work_orders,
    equipments,
    technicians,
    hospitals,
    users
RESTART IDENTITY CASCADE;
SQL
fi

# seed data using python to parse the DB URL
echo "Loading seed data..."

python - "$SEED_SQL" <<'PY'
import asyncio
import os
import sys
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine


async def seed_database():
    seed_file = Path(sys.argv[1])
    sql = seed_file.read_text()

    engine = create_async_engine(os.environ["DATABASE_URL"])

    try:
        async with engine.begin() as connection:
            statements = [
                statement.strip()
                for statement in sql.split(";")
                if statement.strip()
            ]

            for statement in statements:
                await connection.execute(text(statement))
    finally:
        await engine.dispose()


asyncio.run(seed_database())
PY


echo "Loading demo users..."

python3 -m scripts.seed_users

echo "Seed complete."