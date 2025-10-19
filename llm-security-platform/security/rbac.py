"""
LLM Security Platform - RBAC (Role-Based Access Control)
Système de contrôle d'accès basé sur les rôles pour la plateforme
"""

import json
import logging
from typing import Dict, List, Any, Optional, Set
from enum import Enum
from datetime import datetime
from pathlib import Path


class Role(Enum):
    """Rôles disponibles dans la plateforme"""
    ADMIN = "admin"
    SECURITY_ANALYST = "security_analyst"
    OPERATOR = "operator"
    AUDITOR = "auditor"
    VIEWER = "viewer"


class Permission(Enum):
    """Permissions disponibles"""
    # Scan permissions
    SCAN_CREATE = "scan:create"
    SCAN_READ = "scan:read"
    SCAN_DELETE = "scan:delete"
    
    # Results permissions
    RESULTS_READ = "results:read"
    RESULTS_EXPORT = "results:export"
    RESULTS_DELETE = "results:delete"
    
    # Configuration permissions
    CONFIG_READ = "config:read"
    CONFIG_WRITE = "config:write"
    
    # User management
    USER_CREATE = "user:create"
    USER_READ = "user:read"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"
    
    # Audit permissions
    AUDIT_READ = "audit:read"
    AUDIT_EXPORT = "audit:export"
    
    # Remediation permissions
    REMEDIATION_CREATE = "remediation:create"
    REMEDIATION_EXECUTE = "remediation:execute"
    
    # System permissions
    SYSTEM_ADMIN = "system:admin"


class RBACManager:
    """Gestionnaire RBAC pour la plateforme"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.logger = logging.getLogger('rbac_manager')
        
        # Définition des permissions par rôle
        self.role_permissions: Dict[Role, Set[Permission]] = {
            Role.ADMIN: {
                Permission.SCAN_CREATE, Permission.SCAN_READ, Permission.SCAN_DELETE,
                Permission.RESULTS_READ, Permission.RESULTS_EXPORT, Permission.RESULTS_DELETE,
                Permission.CONFIG_READ, Permission.CONFIG_WRITE,
                Permission.USER_CREATE, Permission.USER_READ, Permission.USER_UPDATE, Permission.USER_DELETE,
                Permission.AUDIT_READ, Permission.AUDIT_EXPORT,
                Permission.REMEDIATION_CREATE, Permission.REMEDIATION_EXECUTE,
                Permission.SYSTEM_ADMIN
            },
            Role.SECURITY_ANALYST: {
                Permission.SCAN_CREATE, Permission.SCAN_READ,
                Permission.RESULTS_READ, Permission.RESULTS_EXPORT,
                Permission.CONFIG_READ,
                Permission.AUDIT_READ, Permission.AUDIT_EXPORT,
                Permission.REMEDIATION_CREATE
            },
            Role.OPERATOR: {
                Permission.SCAN_CREATE, Permission.SCAN_READ,
                Permission.RESULTS_READ,
                Permission.CONFIG_READ
            },
            Role.AUDITOR: {
                Permission.SCAN_READ,
                Permission.RESULTS_READ, Permission.RESULTS_EXPORT,
                Permission.CONFIG_READ,
                Permission.AUDIT_READ, Permission.AUDIT_EXPORT
            },
            Role.VIEWER: {
                Permission.SCAN_READ,
                Permission.RESULTS_READ,
                Permission.CONFIG_READ
            }
        }
        
        # Base de données des utilisateurs (en production, utiliser une vraie DB)
        self.users: Dict[str, Dict[str, Any]] = {}
        
        # Charger la configuration si fournie
        if config_path:
            self._load_config(config_path)
    
    def _load_config(self, config_path: str):
        """Charge la configuration RBAC depuis un fichier"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                
            # Charger les utilisateurs
            for user_data in config.get('users', []):
                self.add_user(
                    username=user_data['username'],
                    role=Role(user_data['role']),
                    metadata=user_data.get('metadata', {})
                )
            
            self.logger.info(f"RBAC configuration loaded from {config_path}")
        except Exception as e:
            self.logger.error(f"Failed to load RBAC configuration: {e}")
    
    def add_user(self, username: str, role: Role, metadata: Optional[Dict[str, Any]] = None) -> bool:
        """Ajoute un utilisateur avec un rôle"""
        if username in self.users:
            self.logger.warning(f"User {username} already exists")
            return False
        
        self.users[username] = {
            'username': username,
            'role': role,
            'permissions': self.role_permissions.get(role, set()),
            'created_at': datetime.now().isoformat(),
            'metadata': metadata or {}
        }
        
        self.logger.info(f"User {username} added with role {role.value}")
        return True
    
    def remove_user(self, username: str) -> bool:
        """Supprime un utilisateur"""
        if username not in self.users:
            self.logger.warning(f"User {username} not found")
            return False
        
        del self.users[username]
        self.logger.info(f"User {username} removed")
        return True
    
    def update_user_role(self, username: str, new_role: Role) -> bool:
        """Met à jour le rôle d'un utilisateur"""
        if username not in self.users:
            self.logger.warning(f"User {username} not found")
            return False
        
        old_role = self.users[username]['role']
        self.users[username]['role'] = new_role
        self.users[username]['permissions'] = self.role_permissions.get(new_role, set())
        
        self.logger.info(f"User {username} role updated from {old_role.value} to {new_role.value}")
        return True
    
    def has_permission(self, username: str, permission: Permission) -> bool:
        """Vérifie si un utilisateur a une permission spécifique"""
        if username not in self.users:
            self.logger.warning(f"User {username} not found")
            return False
        
        user_permissions = self.users[username]['permissions']
        return permission in user_permissions
    
    def check_permission(self, username: str, permission: Permission) -> bool:
        """Vérifie une permission et lève une exception si refusée"""
        if not self.has_permission(username, permission):
            raise PermissionError(f"User {username} does not have permission {permission.value}")
        return True
    
    def get_user_permissions(self, username: str) -> Set[Permission]:
        """Récupère toutes les permissions d'un utilisateur"""
        if username not in self.users:
            return set()
        
        return self.users[username]['permissions']
    
    def get_user_role(self, username: str) -> Optional[Role]:
        """Récupère le rôle d'un utilisateur"""
        if username not in self.users:
            return None
        
        return self.users[username]['role']
    
    def list_users(self) -> List[Dict[str, Any]]:
        """Liste tous les utilisateurs"""
        return [
            {
                'username': user['username'],
                'role': user['role'].value,
                'created_at': user['created_at'],
                'metadata': user['metadata']
            }
            for user in self.users.values()
        ]
    
    def export_config(self, output_path: str) -> str:
        """Exporte la configuration RBAC"""
        config = {
            'users': [
                {
                    'username': user['username'],
                    'role': user['role'].value,
                    'metadata': user['metadata']
                }
                for user in self.users.values()
            ]
        }
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"RBAC configuration exported to {output_file}")
        return str(output_file)


def require_permission(permission: Permission):
    """Décorateur pour vérifier les permissions avant l'exécution d'une fonction"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Récupère le username depuis les kwargs ou args
            username = kwargs.get('username') or (args[0] if args else None)
            
            if not username:
                raise ValueError("Username not provided for permission check")
            
            # Récupère le gestionnaire RBAC (doit être passé en contexte)
            rbac_manager = kwargs.get('rbac_manager')
            if not rbac_manager:
                raise ValueError("RBAC manager not provided")
            
            # Vérifie la permission
            rbac_manager.check_permission(username, permission)
            
            # Exécute la fonction
            return func(*args, **kwargs)
        
        return wrapper
    return decorator


class AuditLogger:
    """Logger d'audit pour les actions RBAC"""
    
    def __init__(self, log_dir: str = "./logs/rbac_audit"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        self.logger = logging.getLogger('rbac_audit')
        self.audit_file = self.log_dir / f"rbac_audit_{datetime.now().strftime('%Y%m%d')}.jsonl"
    
    def log_access(self, username: str, action: str, resource: str, 
                   result: str, metadata: Optional[Dict[str, Any]] = None):
        """Enregistre un accès"""
        audit_entry = {
            'timestamp': datetime.now().isoformat(),
            'username': username,
            'action': action,
            'resource': resource,
            'result': result,  # 'granted' ou 'denied'
            'metadata': metadata or {}
        }
        
        with open(self.audit_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(audit_entry, ensure_ascii=False) + '\n')
        
        self.logger.info(f"Access logged: {username} - {action} - {resource} - {result}")
    
    def get_audit_trail(self, username: Optional[str] = None,
                       start_time: Optional[str] = None,
                       end_time: Optional[str] = None) -> List[Dict[str, Any]]:
        """Récupère la piste d'audit"""
        if not self.audit_file.exists():
            return []
        
        audit_trail = []
        
        with open(self.audit_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    entry = json.loads(line)
                    
                    # Filtrage
                    if username and entry.get('username') != username:
                        continue
                    if start_time and entry.get('timestamp', '') < start_time:
                        continue
                    if end_time and entry.get('timestamp', '') > end_time:
                        continue
                    
                    audit_trail.append(entry)
        
        return audit_trail
