#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_DIR="$BACKEND_DIR/.venv"
ENV_FILE="$BACKEND_DIR/.env"
ENV_EXAMPLE="$BACKEND_DIR/.env.example"


echo "== MedFlow Setup =="
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating Python virtual environment..."
    python -m venv "$VENV_DIR"
else
    echo "Python virtual environment already exists."
fi

# venv paths depending on OS
if [ -f "$VENV_DIR/bin/activate" ]; then
    # mac
    source "$VENV_DIR/bin/activate"
elif [ -f "$VENV_DIR/Scripts/activate" ]; then
    # windows
    source "$VENV_DIR/Scripts/activate"
else
    echo "ERROR: Could not find the virtual environment activation script."
    exit 1
fi

echo "Installing backend dependencies..."

python -m pip install -r "$BACKEND_DIR/requirements.txt"

# setup env file
if [ ! -f "$ENV_FILE" ]; then
    if [ ! -f "$ENV_EXAMPLE" ]; then
        echo "ERROR: Neither '$ENV_FILE' nor '$ENV_EXAMPLE' exists."
        exit 1
    fi

    echo "No .env found. Creating it from .env.example."
    cp "$ENV_EXAMPLE" "$ENV_FILE"

    echo "Created $ENV_FILE."
    echo "Fill in the required environment values."
else
    echo ".env already exists."
fi


# frontend
echo "Installing frontend dependencies..."

cd "$FRONTEND_DIR"
npm install

echo "Setup complete."