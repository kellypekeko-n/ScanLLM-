import asyncio
import yaml
import os
from orchestrator.tests.structural_probe import StructuralProbe

# Chemin du fichier de configuration
config_path = os.path.join("orchestrator", "config.yaml")

# Charger la configuration YAML
with open(config_path, "r") as f:
    config = yaml.safe_load(f)


async def main():
    # Crée l'objet StructuralProbe avec la config
    probe = StructuralProbe(config)

    # Exemple de prompt de test
    test_prompt = "What is 2+2?"

    # Exécute le test
    results = await probe.run_test(test_prompt)

    # Affiche les résultats
    print("Résultats du test Structural Probe :")
    print(results)


# Lancer le test
asyncio.run(main())
