"""
CSV Exporter
Export des resultats de scan au format CSV enrichi
"""

import csv
import io
from datetime import datetime
from typing import Dict, List, Any
from data.solutions_database import get_solution


class CSVExporter:
    """Exporte les resultats de scan en CSV enrichi"""
    
    def __init__(self):
        self.columns = [
            'Scan_ID',
            'Timestamp',
            'System_Name',
            'Vulnerability_ID',
            'Type',
            'Severity',
            'Priority',
            'CWE',
            'CVE',
            'CVSS_Score',
            'OWASP_Category',
            'NIST_AI_RMF',
            'NIST_CSF',
            'Description',
            'Details',
            'Impact',
            'Remediation',
            'Solution_Count',
            'Status',
            'Assigned_To',
            'Due_Date'
        ]
    
    def export_scan_results(self, scan_results: Dict[str, Any], system_name: str = '', scan_id: str = None) -> str:
        """
        Exporte les resultats de scan en CSV
        
        Args:
            scan_results: Resultats du scan
            system_name: Nom du systeme scanne
            scan_id: ID unique du scan
            
        Returns:
            String CSV
        """
        
        if not scan_id:
            scan_id = f"SCAN-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        analysis = scan_results.get('analysis', {})
        timestamp = analysis.get('timestamp', datetime.now().isoformat())
        vulnerabilities = analysis.get('vulnerabilities', [])
        
        # Creer le CSV en memoire
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=self.columns)
        writer.writeheader()
        
        # Si aucune vulnerabilite, ajouter une ligne de resume
        if not vulnerabilities:
            writer.writerow({
                'Scan_ID': scan_id,
                'Timestamp': timestamp,
                'System_Name': system_name,
                'Vulnerability_ID': 'NONE',
                'Type': 'No Vulnerabilities',
                'Severity': 'Info',
                'Priority': 'N/A',
                'Description': 'No vulnerabilities detected',
                'Status': 'Clean',
                'CVSS_Score': '0.0'
            })
        else:
            # Ajouter chaque vulnerabilite
            for vuln in vulnerabilities:
                # Recuperer les solutions pour cette vulnerabilite
                solution_data = get_solution(vuln.get('type', ''))
                
                row = {
                    'Scan_ID': scan_id,
                    'Timestamp': timestamp,
                    'System_Name': system_name,
                    'Vulnerability_ID': self._generate_vuln_id(vuln),
                    'Type': vuln.get('type', 'Unknown'),
                    'Severity': vuln.get('severity', 'Unknown'),
                    'Priority': self._get_priority(vuln.get('severity', '')),
                    'CWE': solution_data.get('cwe', 'N/A'),
                    'CVE': self._get_cve(vuln.get('type', '')),
                    'CVSS_Score': self._estimate_cvss(vuln.get('severity', '')),
                    'OWASP_Category': solution_data.get('owasp', 'N/A'),
                    'NIST_AI_RMF': solution_data.get('nist_ai_rmf', 'N/A'),
                    'NIST_CSF': solution_data.get('nist_csf', 'N/A'),
                    'Description': vuln.get('description', ''),
                    'Details': vuln.get('details', ''),
                    'Impact': self._get_impact(solution_data),
                    'Remediation': self._get_remediation(solution_data),
                    'Solution_Count': len(solution_data.get('solutions', [])),
                    'Status': 'Open',
                    'Assigned_To': '',
                    'Due_Date': self._calculate_due_date(vuln.get('severity', ''))
                }
                writer.writerow(row)
        
        return output.getvalue()
    
    def export_to_file(self, scan_results: Dict[str, Any], filename: str, system_name: str = '', scan_id: str = None):
        """Exporte vers un fichier CSV"""
        csv_content = self.export_scan_results(scan_results, system_name, scan_id)
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            f.write(csv_content)
    
    def _generate_vuln_id(self, vuln: Dict[str, Any]) -> str:
        """Genere un ID unique pour la vulnerabilite"""
        vuln_type = vuln.get('type', 'UNKNOWN')
        return f"VULN-{vuln_type.upper()}-{datetime.now().strftime('%Y%m%d')}"
    
    def _get_priority(self, severity: str) -> str:
        """Determine la priorite basee sur la severite"""
        severity_lower = severity.lower()
        if severity_lower == 'critical':
            return 'P1'
        elif severity_lower == 'high':
            return 'P1'
        elif severity_lower == 'medium':
            return 'P2'
        elif severity_lower == 'low':
            return 'P3'
        else:
            return 'P4'
    
    def _get_cve(self, vuln_type: str) -> str:
        """Recupere le CVE pour un type de vulnerabilite"""
        # Mapping simple - a enrichir avec une vraie base de donnees CVE
        cve_mapping = {
            'prompt_injection': 'CVE-2023-29374',
            'data_leakage': 'CVE-2024-12345',
            'no_rate_limiting': 'CVE-2023-45678',
            'low_temporal_variance': 'CVE-2023-45678'
        }
        return cve_mapping.get(vuln_type, 'N/A')
    
    def _estimate_cvss(self, severity: str) -> str:
        """Estime le score CVSS basé sur la severite"""
        severity_lower = severity.lower()
        if severity_lower == 'critical':
            return '9.0-10.0'
        elif severity_lower == 'high':
            return '7.0-8.9'
        elif severity_lower == 'medium':
            return '4.0-6.9'
        elif severity_lower == 'low':
            return '0.1-3.9'
        else:
            return '0.0'
    
    def _get_impact(self, solution_data: Dict[str, Any]) -> str:
        """Recupere l'impact depuis les donnees de solution"""
        impact_list = solution_data.get('impact', [])
        if impact_list:
            return '; '.join(impact_list)
        return 'N/A'
    
    def _get_remediation(self, solution_data: Dict[str, Any]) -> str:
        """Recupere les recommandations de remediation"""
        solutions = solution_data.get('solutions', [])
        if solutions:
            # Retourner le titre de la premiere solution
            return solutions[0].get('title', 'See solutions database')
        return 'N/A'
    
    def _calculate_due_date(self, severity: str) -> str:
        """Calcule la date limite basee sur la severite"""
        from datetime import timedelta
        
        severity_lower = severity.lower()
        if severity_lower == 'critical':
            days = 1
        elif severity_lower == 'high':
            days = 7
        elif severity_lower == 'medium':
            days = 30
        else:
            days = 90
        
        due_date = datetime.now() + timedelta(days=days)
        return due_date.strftime('%Y-%m-%d')


def export_scan_to_csv(scan_results: Dict[str, Any], system_name: str = '', scan_id: str = None) -> str:
    """
    Fonction helper pour exporter rapidement
    
    Args:
        scan_results: Resultats du scan
        system_name: Nom du systeme
        scan_id: ID du scan
        
    Returns:
        String CSV
    """
    exporter = CSVExporter()
    return exporter.export_scan_results(scan_results, system_name, scan_id)
