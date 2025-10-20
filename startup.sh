#!/bin/bash
# Startup script for Azure App Service - Root level

echo "Starting LLM Security Platform..."

# Navigate to the application directory
cd llm-security-platform

# Set Python path
export PYTHONPATH=/home/site/wwwroot/llm-security-platform:$PYTHONPATH

# Start Gunicorn
gunicorn --bind=0.0.0.0:8000 --timeout 600 --workers 2 app:app
