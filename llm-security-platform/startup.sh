#!/bin/bash
# Startup script for Azure App Service

echo "Starting LLM Security Platform..."

# Set Python path
export PYTHONPATH=/home/site/wwwroot:$PYTHONPATH

# Start Gunicorn
gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 2 app:app
