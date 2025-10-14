
## Structure des plugins (tests)
- Chaque fichier dans `orchestrator/tests/` doit exposer :
- `TEST_TYPE` : string identifiant le test
- `run(model_id, lm_call)` : fonction qui exécute le test et retourne un dict :
 ```
 {
   "output": {...},           # meta response (non-sensitive)
   "metrics": {...},          # scores 0..1 : e.g. prompt_injection_score
   "notes": "optional"
 }
 ```
- **Règle de sécurité** : ne loggue pas d’outputs potentiellement dangereux en clair. Si tu veux analyser le texte, stocke un hash ou des meta (length, token_count). Préfère stocker uniquement metrics et résumés chiffrés.

## Développement de nouveaux tests
1. Copier `orchestrator/tests/structural_probe.py` comme template.
2. Implémenter la logique d’appel via `lm_call(model_id, input_text)` ; ne pas faire d’appels réseau non contrôlés.
3. Retourner uniquement `metrics` normalisés 0..1.

## Analyse et scoring
- Lancer `analyzer/analyzer.py --results-dir ./orchestrator/results --out-csv summary.csv`.
- `summary.csv` contiendra les modèles et leur `VulnerabilityIndex`.

## Déploiement CI/CD
- Modifier `infra/azure-pipelines.yml` :
- Ajouter variable `LM_ENDPOINT` (accessible depuis agent).
- Configurer agent pool (self-hosted si nécessaire, car LM Studio local peut ne pas être accessible depuis microsoft-hosted agents).

## Sécurité & éthique (obligatoire)
- **Toujours** exécuter ces tests dans un environnement isolé hors production.
- Ne jamais scanner des modèles que tu ne possèdes pas ou pour lesquels tu n'as pas d'autorisation écrite.
- Conserver logs dans un stockage chiffré et restreint.
- Ne pas utiliser ce framework pour générer ou automatiser des payloads malveillants.

## Extensions recommandées
- Stockage des résultats dans Elasticsearch + Kibana pour dashboarding.
- Intégration avec JIRA/ServiceNow pour tickets automatiques.
- Module de remédiation automatique (suggestions) selon seuils.

