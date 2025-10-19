"""
LLM Security Platform - Secrets Manager
Gestion sécurisée des secrets avec support Azure Key Vault et HashiCorp Vault
"""

import os
import json
import logging
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod
from pathlib import Path
import base64


class SecretsBackend(ABC):
    """Interface abstraite pour les backends de secrets"""
    
    @abstractmethod
    def get_secret(self, key: str) -> Optional[str]:
        """Récupère un secret"""
        pass
    
    @abstractmethod
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret"""
        pass
    
    @abstractmethod
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret"""
        pass
    
    @abstractmethod
    def list_secrets(self) -> list:
        """Liste les clés de secrets disponibles"""
        pass


class EnvironmentSecretsBackend(SecretsBackend):
    """Backend utilisant les variables d'environnement"""
    
    def __init__(self):
        self.logger = logging.getLogger('env_secrets_backend')
        self.prefix = "LLM_SECURITY_"
    
    def get_secret(self, key: str) -> Optional[str]:
        """Récupère un secret depuis les variables d'environnement"""
        env_key = f"{self.prefix}{key.upper()}"
        value = os.getenv(env_key)
        
        if value:
            self.logger.debug(f"Secret retrieved: {key}")
        else:
            self.logger.warning(f"Secret not found: {key}")
        
        return value
    
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret dans les variables d'environnement"""
        env_key = f"{self.prefix}{key.upper()}"
        os.environ[env_key] = value
        self.logger.info(f"Secret set: {key}")
        return True
    
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret des variables d'environnement"""
        env_key = f"{self.prefix}{key.upper()}"
        if env_key in os.environ:
            del os.environ[env_key]
            self.logger.info(f"Secret deleted: {key}")
            return True
        return False
    
    def list_secrets(self) -> list:
        """Liste les secrets disponibles"""
        return [
            key.replace(self.prefix, '').lower()
            for key in os.environ.keys()
            if key.startswith(self.prefix)
        ]


class FileSecretsBackend(SecretsBackend):
    """Backend utilisant un fichier chiffré (pour développement uniquement)"""
    
    def __init__(self, secrets_file: str = ".secrets.json"):
        self.logger = logging.getLogger('file_secrets_backend')
        self.secrets_file = Path(secrets_file)
        self.secrets: Dict[str, str] = {}
        
        # Charger les secrets existants
        self._load_secrets()
    
    def _load_secrets(self):
        """Charge les secrets depuis le fichier"""
        if self.secrets_file.exists():
            try:
                with open(self.secrets_file, 'r', encoding='utf-8') as f:
                    self.secrets = json.load(f)
                self.logger.info(f"Secrets loaded from {self.secrets_file}")
            except Exception as e:
                self.logger.error(f"Failed to load secrets: {e}")
    
    def _save_secrets(self):
        """Sauvegarde les secrets dans le fichier"""
        try:
            with open(self.secrets_file, 'w', encoding='utf-8') as f:
                json.dump(self.secrets, f, indent=2)
            
            # Définir les permissions restrictives (Unix uniquement)
            if os.name != 'nt':
                os.chmod(self.secrets_file, 0o600)
            
            self.logger.info(f"Secrets saved to {self.secrets_file}")
        except Exception as e:
            self.logger.error(f"Failed to save secrets: {e}")
    
    def get_secret(self, key: str) -> Optional[str]:
        """Récupère un secret"""
        value = self.secrets.get(key)
        if value:
            # Décode si encodé en base64
            try:
                return base64.b64decode(value).decode('utf-8')
            except:
                return value
        return None
    
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret"""
        # Encode en base64 pour une obfuscation basique
        encoded_value = base64.b64encode(value.encode('utf-8')).decode('utf-8')
        self.secrets[key] = encoded_value
        self._save_secrets()
        self.logger.info(f"Secret set: {key}")
        return True
    
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret"""
        if key in self.secrets:
            del self.secrets[key]
            self._save_secrets()
            self.logger.info(f"Secret deleted: {key}")
            return True
        return False
    
    def list_secrets(self) -> list:
        """Liste les secrets disponibles"""
        return list(self.secrets.keys())


class AzureKeyVaultBackend(SecretsBackend):
    """Backend utilisant Azure Key Vault"""
    
    def __init__(self, vault_url: str, credential: Optional[Any] = None):
        self.logger = logging.getLogger('azure_keyvault_backend')
        self.vault_url = vault_url
        
        try:
            from azure.keyvault.secrets import SecretClient
            from azure.identity import DefaultAzureCredential
            
            if credential is None:
                credential = DefaultAzureCredential()
            
            self.client = SecretClient(vault_url=vault_url, credential=credential)
            self.logger.info(f"Azure Key Vault client initialized: {vault_url}")
        except ImportError:
            self.logger.error("Azure SDK not installed. Install with: pip install azure-keyvault-secrets azure-identity")
            raise
        except Exception as e:
            self.logger.error(f"Failed to initialize Azure Key Vault client: {e}")
            raise
    
    def get_secret(self, key: str) -> Optional[str]:
        """Récupère un secret depuis Azure Key Vault"""
        try:
            secret = self.client.get_secret(key)
            self.logger.debug(f"Secret retrieved from Azure Key Vault: {key}")
            return secret.value
        except Exception as e:
            self.logger.error(f"Failed to retrieve secret {key}: {e}")
            return None
    
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret dans Azure Key Vault"""
        try:
            self.client.set_secret(key, value)
            self.logger.info(f"Secret set in Azure Key Vault: {key}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to set secret {key}: {e}")
            return False
    
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret d'Azure Key Vault"""
        try:
            poller = self.client.begin_delete_secret(key)
            poller.wait()
            self.logger.info(f"Secret deleted from Azure Key Vault: {key}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to delete secret {key}: {e}")
            return False
    
    def list_secrets(self) -> list:
        """Liste les secrets disponibles dans Azure Key Vault"""
        try:
            secrets = self.client.list_properties_of_secrets()
            return [secret.name for secret in secrets]
        except Exception as e:
            self.logger.error(f"Failed to list secrets: {e}")
            return []


class HashiCorpVaultBackend(SecretsBackend):
    """Backend utilisant HashiCorp Vault"""
    
    def __init__(self, vault_url: str, token: str, mount_point: str = "secret"):
        self.logger = logging.getLogger('hashicorp_vault_backend')
        self.vault_url = vault_url
        self.token = token
        self.mount_point = mount_point
        
        try:
            import hvac
            
            self.client = hvac.Client(url=vault_url, token=token)
            
            if not self.client.is_authenticated():
                raise Exception("Failed to authenticate with HashiCorp Vault")
            
            self.logger.info(f"HashiCorp Vault client initialized: {vault_url}")
        except ImportError:
            self.logger.error("hvac library not installed. Install with: pip install hvac")
            raise
        except Exception as e:
            self.logger.error(f"Failed to initialize HashiCorp Vault client: {e}")
            raise
    
    def get_secret(self, key: str) -> Optional[str]:
        """Récupère un secret depuis HashiCorp Vault"""
        try:
            secret = self.client.secrets.kv.v2.read_secret_version(
                path=key,
                mount_point=self.mount_point
            )
            value = secret['data']['data'].get('value')
            self.logger.debug(f"Secret retrieved from HashiCorp Vault: {key}")
            return value
        except Exception as e:
            self.logger.error(f"Failed to retrieve secret {key}: {e}")
            return None
    
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret dans HashiCorp Vault"""
        try:
            self.client.secrets.kv.v2.create_or_update_secret(
                path=key,
                secret={'value': value},
                mount_point=self.mount_point
            )
            self.logger.info(f"Secret set in HashiCorp Vault: {key}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to set secret {key}: {e}")
            return False
    
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret de HashiCorp Vault"""
        try:
            self.client.secrets.kv.v2.delete_metadata_and_all_versions(
                path=key,
                mount_point=self.mount_point
            )
            self.logger.info(f"Secret deleted from HashiCorp Vault: {key}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to delete secret {key}: {e}")
            return False
    
    def list_secrets(self) -> list:
        """Liste les secrets disponibles dans HashiCorp Vault"""
        try:
            secrets = self.client.secrets.kv.v2.list_secrets(
                path='',
                mount_point=self.mount_point
            )
            return secrets['data']['keys']
        except Exception as e:
            self.logger.error(f"Failed to list secrets: {e}")
            return []


class SecretsManager:
    """Gestionnaire central des secrets"""
    
    def __init__(self, backend: Optional[SecretsBackend] = None):
        self.logger = logging.getLogger('secrets_manager')
        
        if backend is None:
            # Par défaut, utilise les variables d'environnement
            backend = EnvironmentSecretsBackend()
        
        self.backend = backend
        self.logger.info(f"Secrets manager initialized with backend: {backend.__class__.__name__}")
    
    def get_secret(self, key: str, default: Optional[str] = None) -> Optional[str]:
        """Récupère un secret"""
        value = self.backend.get_secret(key)
        return value if value is not None else default
    
    def set_secret(self, key: str, value: str) -> bool:
        """Définit un secret"""
        return self.backend.set_secret(key, value)
    
    def delete_secret(self, key: str) -> bool:
        """Supprime un secret"""
        return self.backend.delete_secret(key)
    
    def list_secrets(self) -> list:
        """Liste les secrets disponibles"""
        return self.backend.list_secrets()
    
    def get_llm_config(self) -> Dict[str, Any]:
        """Récupère la configuration LLM depuis les secrets"""
        return {
            'endpoint': self.get_secret('llm_endpoint', 'http://localhost:11434'),
            'model': self.get_secret('llm_model', 'llama2'),
            'api_key': self.get_secret('llm_api_key'),
            'timeout': int(self.get_secret('llm_timeout', '30'))
        }
    
    def get_alerting_config(self) -> Dict[str, Any]:
        """Récupère la configuration d'alerting depuis les secrets"""
        return {
            'jira': {
                'url': self.get_secret('jira_url'),
                'username': self.get_secret('jira_username'),
                'api_token': self.get_secret('jira_api_token'),
                'project_key': self.get_secret('jira_project_key')
            },
            'teams': {
                'webhook_url': self.get_secret('teams_webhook_url')
            },
            'slack': {
                'webhook_url': self.get_secret('slack_webhook_url')
            }
        }
    
    @staticmethod
    def create_from_config(config: Dict[str, Any]) -> 'SecretsManager':
        """Crée un SecretsManager depuis une configuration"""
        backend_type = config.get('backend', 'environment')
        
        if backend_type == 'environment':
            backend = EnvironmentSecretsBackend()
        elif backend_type == 'file':
            backend = FileSecretsBackend(config.get('secrets_file', '.secrets.json'))
        elif backend_type == 'azure_keyvault':
            backend = AzureKeyVaultBackend(
                vault_url=config['vault_url'],
                credential=config.get('credential')
            )
        elif backend_type == 'hashicorp_vault':
            backend = HashiCorpVaultBackend(
                vault_url=config['vault_url'],
                token=config['token'],
                mount_point=config.get('mount_point', 'secret')
            )
        else:
            raise ValueError(f"Unknown backend type: {backend_type}")
        
        return SecretsManager(backend)
