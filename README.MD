# 🛡️ LLM Security Platform

[![Azure Deployment](https://img.shields.io/badge/Azure-Deployed-blue?logo=microsoft-azure)](https://llm-security-plateform.azurewebsites.net)
[![Build Status](https://img.shields.io/github/actions/workflow/status/kellypekeko-n/ScanLLM-/build.yml?branch=main)](https://github.com/kellypekeko-n/ScanLLM-/actions)
[![Python Version](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)](https://llm-security-plateform.azurewebsites.net/health)

> Plateforme d'analyse défensive des vulnérabilités LLM : scan, logging, scoring, priorisation.

## 🚀 Déploiement Azure

**Application en production** : [https://llm-security-plateform.azurewebsites.net](https://llm-security-plateform.azurewebsites.net)

### Endpoints Disponibles

- **Health Check** : `/health`
- **Status** : `/api/status`
- **Tests** : `/api/tests`
- **Scan** : `/api/scan` (POST)

## 📋 Objectif

Plateforme d'analyse défensive des vulnérabilités LLM : scan, logging, scoring, priorisation.

## Pré-requis
- Python 3.10+ (3.11 recommandé)
- LM Studio (ou endpoint LLM privé) accessible depuis le runner
  - LM Studio par défaut écoute `http://localhost:11434`
- Azure DevOps agent si tu veux lancer le pipeline dans Azure

## Installation rapide (local)
1. Cloner le repo.
2. Installer dépendances :
