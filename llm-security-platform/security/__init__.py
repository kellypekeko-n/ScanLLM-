"""
LLM Security Platform - Security Module
"""

from .rbac import (
    Role,
    Permission,
    RBACManager,
    require_permission,
    AuditLogger
)
from .secrets_manager import (
    SecretsBackend,
    EnvironmentSecretsBackend,
    FileSecretsBackend,
    AzureKeyVaultBackend,
    HashiCorpVaultBackend,
    SecretsManager
)

__all__ = [
    'Role',
    'Permission',
    'RBACManager',
    'require_permission',
    'AuditLogger',
    'SecretsBackend',
    'EnvironmentSecretsBackend',
    'FileSecretsBackend',
    'AzureKeyVaultBackend',
    'HashiCorpVaultBackend',
    'SecretsManager'
]
