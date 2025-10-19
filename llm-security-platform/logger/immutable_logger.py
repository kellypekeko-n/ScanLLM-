"""
LLM Security Platform - Immutable Logger
Système de logging immuable avec hash chaining pour traçabilité et audit
"""

import json
import hashlib
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import threading


class ImmutableLogger:
    """Logger immuable avec hash chaining pour garantir l'intégrité des logs"""
    
    def __init__(self, log_dir: str = "./logs/immutable"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        self.logger = logging.getLogger('immutable_logger')
        self.logger.setLevel(logging.INFO)
        
        # Fichier de log principal
        self.log_file = self.log_dir / f"security_audit_{datetime.now().strftime('%Y%m%d')}.jsonl"
        
        # Fichier de hash chain
        self.hash_chain_file = self.log_dir / "hash_chain.json"
        
        # Dernier hash pour le chaînage
        self.last_hash = self._load_last_hash()
        
        # Lock pour thread safety
        self.lock = threading.Lock()
        
        # Compteur de séquence
        self.sequence = self._load_sequence()
    
    def _load_last_hash(self) -> str:
        """Charge le dernier hash de la chaîne"""
        if self.hash_chain_file.exists():
            try:
                with open(self.hash_chain_file, 'r', encoding='utf-8') as f:
                    chain_data = json.load(f)
                    return chain_data.get('last_hash', self._genesis_hash())
            except Exception as e:
                self.logger.warning(f"Could not load hash chain: {e}")
        
        return self._genesis_hash()
    
    def _genesis_hash(self) -> str:
        """Génère le hash genesis (premier hash de la chaîne)"""
        genesis_data = {
            'type': 'genesis',
            'timestamp': datetime.now().isoformat(),
            'platform': 'LLM Security Platform',
            'version': '1.0.0'
        }
        return self._calculate_hash(json.dumps(genesis_data, sort_keys=True))
    
    def _load_sequence(self) -> int:
        """Charge le numéro de séquence actuel"""
        if self.hash_chain_file.exists():
            try:
                with open(self.hash_chain_file, 'r', encoding='utf-8') as f:
                    chain_data = json.load(f)
                    return chain_data.get('sequence', 0)
            except Exception:
                pass
        return 0
    
    def _calculate_hash(self, data: str) -> str:
        """Calcule le hash SHA-256 des données"""
        return hashlib.sha256(data.encode('utf-8')).hexdigest()
    
    def log_event(self, event_type: str, data: Dict[str, Any], 
                  severity: str = 'info', metadata: Optional[Dict[str, Any]] = None) -> str:
        """
        Enregistre un événement immuable avec hash chaining
        
        Args:
            event_type: Type d'événement (scan_start, test_complete, vulnerability_detected, etc.)
            data: Données de l'événement
            severity: Niveau de sévérité (info, warning, error, critical)
            metadata: Métadonnées additionnelles
            
        Returns:
            Hash de l'événement enregistré
        """
        with self.lock:
            self.sequence += 1
            
            # Construction de l'entrée de log
            log_entry = {
                'sequence': self.sequence,
                'timestamp': datetime.now().isoformat(),
                'event_type': event_type,
                'severity': severity,
                'data': data,
                'metadata': metadata or {},
                'previous_hash': self.last_hash
            }
            
            # Calcul du hash de cette entrée
            entry_json = json.dumps(log_entry, sort_keys=True, ensure_ascii=False)
            current_hash = self._calculate_hash(entry_json)
            log_entry['hash'] = current_hash
            
            # Écriture dans le fichier de log
            self._write_log_entry(log_entry)
            
            # Mise à jour de la chaîne de hash
            self._update_hash_chain(current_hash)
            
            # Mise à jour du dernier hash
            self.last_hash = current_hash
            
            return current_hash
    
    def _write_log_entry(self, log_entry: Dict[str, Any]):
        """Écrit une entrée de log dans le fichier JSONL"""
        try:
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')
        except Exception as e:
            self.logger.error(f"Failed to write log entry: {e}")
    
    def _update_hash_chain(self, current_hash: str):
        """Met à jour le fichier de chaîne de hash"""
        try:
            chain_data = {
                'last_hash': current_hash,
                'sequence': self.sequence,
                'updated_at': datetime.now().isoformat()
            }
            
            with open(self.hash_chain_file, 'w', encoding='utf-8') as f:
                json.dump(chain_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            self.logger.error(f"Failed to update hash chain: {e}")
    
    def verify_integrity(self, start_sequence: Optional[int] = None, 
                        end_sequence: Optional[int] = None) -> Dict[str, Any]:
        """
        Vérifie l'intégrité de la chaîne de logs
        
        Args:
            start_sequence: Séquence de début (None = depuis le début)
            end_sequence: Séquence de fin (None = jusqu'à la fin)
            
        Returns:
            Résultat de la vérification avec détails
        """
        verification_result = {
            'valid': True,
            'total_entries': 0,
            'verified_entries': 0,
            'corrupted_entries': [],
            'missing_sequences': [],
            'timestamp': datetime.now().isoformat()
        }
        
        if not self.log_file.exists():
            verification_result['valid'] = False
            verification_result['error'] = 'Log file not found'
            return verification_result
        
        try:
            entries = []
            with open(self.log_file, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        entries.append(json.loads(line))
            
            verification_result['total_entries'] = len(entries)
            
            # Filtrage par séquence si spécifié
            if start_sequence is not None:
                entries = [e for e in entries if e['sequence'] >= start_sequence]
            if end_sequence is not None:
                entries = [e for e in entries if e['sequence'] <= end_sequence]
            
            # Vérification de la chaîne
            expected_hash = self._genesis_hash()
            expected_sequence = 0
            
            for entry in entries:
                expected_sequence += 1
                
                # Vérification de la séquence
                if entry['sequence'] != expected_sequence:
                    verification_result['missing_sequences'].append(expected_sequence)
                    verification_result['valid'] = False
                
                # Vérification du hash précédent
                if entry.get('previous_hash') != expected_hash:
                    verification_result['corrupted_entries'].append({
                        'sequence': entry['sequence'],
                        'reason': 'Invalid previous hash',
                        'expected': expected_hash,
                        'found': entry.get('previous_hash')
                    })
                    verification_result['valid'] = False
                
                # Vérification du hash de l'entrée
                entry_copy = entry.copy()
                entry_hash = entry_copy.pop('hash')
                entry_json = json.dumps(entry_copy, sort_keys=True, ensure_ascii=False)
                calculated_hash = self._calculate_hash(entry_json)
                
                if calculated_hash != entry_hash:
                    verification_result['corrupted_entries'].append({
                        'sequence': entry['sequence'],
                        'reason': 'Invalid entry hash',
                        'expected': calculated_hash,
                        'found': entry_hash
                    })
                    verification_result['valid'] = False
                else:
                    verification_result['verified_entries'] += 1
                
                expected_hash = entry_hash
            
        except Exception as e:
            verification_result['valid'] = False
            verification_result['error'] = str(e)
        
        return verification_result
    
    def get_audit_trail(self, event_type: Optional[str] = None,
                       start_time: Optional[str] = None,
                       end_time: Optional[str] = None,
                       severity: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Récupère une piste d'audit filtrée
        
        Args:
            event_type: Filtrer par type d'événement
            start_time: Timestamp de début (ISO format)
            end_time: Timestamp de fin (ISO format)
            severity: Filtrer par sévérité
            
        Returns:
            Liste des entrées de log correspondantes
        """
        if not self.log_file.exists():
            return []
        
        audit_trail = []
        
        try:
            with open(self.log_file, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        entry = json.loads(line)
                        
                        # Filtrage
                        if event_type and entry.get('event_type') != event_type:
                            continue
                        if severity and entry.get('severity') != severity:
                            continue
                        if start_time and entry.get('timestamp', '') < start_time:
                            continue
                        if end_time and entry.get('timestamp', '') > end_time:
                            continue
                        
                        audit_trail.append(entry)
        
        except Exception as e:
            self.logger.error(f"Failed to retrieve audit trail: {e}")
        
        return audit_trail
    
    def export_audit_report(self, output_path: str, 
                           start_time: Optional[str] = None,
                           end_time: Optional[str] = None) -> str:
        """
        Exporte un rapport d'audit complet
        
        Args:
            output_path: Chemin du fichier de sortie
            start_time: Timestamp de début
            end_time: Timestamp de fin
            
        Returns:
            Chemin du fichier généré
        """
        audit_trail = self.get_audit_trail(start_time=start_time, end_time=end_time)
        verification = self.verify_integrity()
        
        report = {
            'report_type': 'audit_trail',
            'generated_at': datetime.now().isoformat(),
            'period': {
                'start': start_time or 'beginning',
                'end': end_time or 'now'
            },
            'integrity_verification': verification,
            'total_events': len(audit_trail),
            'events': audit_trail
        }
        
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        self.logger.info(f"Audit report exported to {output_file}")
        return str(output_file)


class SecurityAuditLogger:
    """Logger spécialisé pour les audits de sécurité LLM"""
    
    def __init__(self, log_dir: str = "./logs/immutable"):
        self.immutable_logger = ImmutableLogger(log_dir)
    
    def log_scan_start(self, model_name: str, config: Dict[str, Any]) -> str:
        """Enregistre le début d'un scan"""
        return self.immutable_logger.log_event(
            event_type='scan_start',
            data={
                'model_name': model_name,
                'config': config
            },
            severity='info'
        )
    
    def log_scan_complete(self, model_name: str, results: Dict[str, Any]) -> str:
        """Enregistre la fin d'un scan"""
        return self.immutable_logger.log_event(
            event_type='scan_complete',
            data={
                'model_name': model_name,
                'vulnerability_index': results.get('vulnerability_index', 0.0),
                'total_vulnerabilities': len(results.get('vulnerabilities', [])),
                'overall_score': results.get('overall_score', 0.0)
            },
            severity='info'
        )
    
    def log_test_execution(self, test_name: str, result: Dict[str, Any]) -> str:
        """Enregistre l'exécution d'un test"""
        severity = 'error' if 'error' in result else 'info'
        return self.immutable_logger.log_event(
            event_type='test_execution',
            data={
                'test_name': test_name,
                'score': result.get('score', 0.0),
                'status': 'failed' if 'error' in result else 'completed',
                'vulnerabilities_found': len(result.get('vulnerabilities', []))
            },
            severity=severity
        )
    
    def log_vulnerability_detected(self, vulnerability: Dict[str, Any], 
                                  source_test: str, model_name: str) -> str:
        """Enregistre la détection d'une vulnérabilité"""
        severity_map = {
            'critical': 'critical',
            'high': 'error',
            'medium': 'warning',
            'low': 'info'
        }
        
        severity = severity_map.get(vulnerability.get('severity', 'low'), 'info')
        
        return self.immutable_logger.log_event(
            event_type='vulnerability_detected',
            data={
                'model_name': model_name,
                'source_test': source_test,
                'vulnerability_type': vulnerability.get('type'),
                'severity': vulnerability.get('severity'),
                'description': vulnerability.get('description'),
                'details': vulnerability.get('details')
            },
            severity=severity
        )
    
    def log_remediation_action(self, action: str, vulnerability_id: str, 
                              status: str, details: Dict[str, Any]) -> str:
        """Enregistre une action de remédiation"""
        return self.immutable_logger.log_event(
            event_type='remediation_action',
            data={
                'action': action,
                'vulnerability_id': vulnerability_id,
                'status': status,
                'details': details
            },
            severity='info'
        )
    
    def verify_integrity(self) -> Dict[str, Any]:
        """Vérifie l'intégrité des logs"""
        return self.immutable_logger.verify_integrity()
    
    def export_audit_report(self, output_path: str) -> str:
        """Exporte un rapport d'audit"""
        return self.immutable_logger.export_audit_report(output_path)
