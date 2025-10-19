# LLM Security Platform - Isolated Runner Container
FROM python:3.11-slim

# Métadonnées
LABEL maintainer="LLM Security Platform"
LABEL description="Isolated runner for LLM security testing"

# Variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV RUNNER_OUTPUT_DIR=/app/results
ENV LOG_LEVEL=INFO

# Créer un utilisateur non-root pour la sécurité
RUN useradd -m -u 1000 -s /bin/bash runner

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de la plateforme
COPY orchestrator/ ./orchestrator/
COPY runners/ ./runners/
COPY logger/ ./logger/
COPY security/ ./security/
COPY alerting/ ./alerting/
COPY analyzer/ ./analyzer/

# Créer les répertoires nécessaires
RUN mkdir -p /app/results /app/logs /app/config && \
    chown -R runner:runner /app

# Passer à l'utilisateur non-root
USER runner

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)"

# Point d'entrée
ENTRYPOINT ["python", "runners/runner.py"]

# Commande par défaut
CMD ["--config", "/app/config/config.yaml", "--output", "/app/results"]
