"""
LLM Security Platform - Alerting & Ticketing Module
Intégration avec JIRA, ServiceNow, Teams, et Slack pour alertes temps réel
"""

import json
import logging
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime
from abc import ABC, abstractmethod


class AlertChannel(ABC):
    """Interface abstraite pour les canaux d'alerte"""
    
    @abstractmethod
    def send_alert(self, alert: Dict[str, Any]) -> bool:
        """Envoie une alerte via le canal"""
        pass


class JiraTicketingChannel(AlertChannel):
    """Canal d'alerte via JIRA"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('jira_channel')
        
        self.jira_url = config.get('jira_url')
        self.project_key = config.get('project_key')
        self.username = config.get('username')
        self.api_token = config.get('api_token')
        
        # Mapping de sévérité vers priorité JIRA
        self.priority_map = {
            'critical': 'Highest',
            'high': 'High',
            'medium': 'Medium',
            'low': 'Low'
        }
    
    def send_alert(self, alert: Dict[str, Any]) -> bool:
        """Crée un ticket JIRA pour l'alerte"""
        try:
            issue_data = {
                "fields": {
                    "project": {"key": self.project_key},
                    "summary": alert.get('title', 'LLM Security Alert'),
                    "description": self._format_description(alert),
                    "issuetype": {"name": "Bug"},
                    "priority": {"name": self.priority_map.get(alert.get('severity', 'medium'), 'Medium')},
                    "labels": ["llm-security", "automated", alert.get('severity', 'medium')]
                }
            }
            
            response = requests.post(
                f"{self.jira_url}/rest/api/2/issue",
                auth=(self.username, self.api_token),
                headers={"Content-Type": "application/json"},
                json=issue_data,
                timeout=10
            )
            
            if response.status_code == 201:
                issue_key = response.json().get('key')
                self.logger.info(f"JIRA ticket created: {issue_key}")
                return True
            else:
                self.logger.error(f"Failed to create JIRA ticket: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error creating JIRA ticket: {e}")
            return False
    
    def _format_description(self, alert: Dict[str, Any]) -> str:
        """Formate la description du ticket JIRA"""
        description = f"""
*LLM Security Vulnerability Detected*

*Model:* {alert.get('model_name', 'Unknown')}
*Severity:* {alert.get('severity', 'Unknown').upper()}
*Vulnerability Type:* {alert.get('vulnerability_type', 'Unknown')}
*Detected At:* {alert.get('timestamp', datetime.now().isoformat())}

*Description:*
{alert.get('description', 'No description provided')}

*Details:*
{alert.get('details', 'No additional details')}

*Vulnerability Index:* {alert.get('vulnerability_index', 'N/A')}
*Priority:* {alert.get('priority', 'N/A')}

*Recommendations:*
{self._format_recommendations(alert.get('recommendations', []))}

*Source Test:* {alert.get('source_test', 'Unknown')}
"""
        return description
    
    def _format_recommendations(self, recommendations: List[Dict[str, Any]]) -> str:
        """Formate les recommandations"""
        if not recommendations:
            return "No recommendations available"
        
        formatted = []
        for i, rec in enumerate(recommendations, 1):
            formatted.append(f"{i}. [{rec.get('priority', 'medium').upper()}] {rec.get('description', 'N/A')}")
        
        return "\n".join(formatted)


class ServiceNowTicketingChannel(AlertChannel):
    """Canal d'alerte via ServiceNow"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('servicenow_channel')
        
        self.instance_url = config.get('instance_url')
        self.username = config.get('username')
        self.password = config.get('password')
        
        # Mapping de sévérité vers impact ServiceNow
        self.impact_map = {
            'critical': '1',
            'high': '2',
            'medium': '3',
            'low': '4'
        }
    
    def send_alert(self, alert: Dict[str, Any]) -> bool:
        """Crée un incident ServiceNow pour l'alerte"""
        try:
            incident_data = {
                "short_description": alert.get('title', 'LLM Security Alert'),
                "description": self._format_description(alert),
                "impact": self.impact_map.get(alert.get('severity', 'medium'), '3'),
                "urgency": self.impact_map.get(alert.get('severity', 'medium'), '3'),
                "category": "Security",
                "subcategory": "AI/ML Security",
                "assignment_group": config.get('assignment_group', 'Security Team')
            }
            
            response = requests.post(
                f"{self.instance_url}/api/now/table/incident",
                auth=(self.username, self.password),
                headers={"Content-Type": "application/json", "Accept": "application/json"},
                json=incident_data,
                timeout=10
            )
            
            if response.status_code == 201:
                incident_number = response.json().get('result', {}).get('number')
                self.logger.info(f"ServiceNow incident created: {incident_number}")
                return True
            else:
                self.logger.error(f"Failed to create ServiceNow incident: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error creating ServiceNow incident: {e}")
            return False
    
    def _format_description(self, alert: Dict[str, Any]) -> str:
        """Formate la description de l'incident"""
        return f"""LLM Security Vulnerability Detected

Model: {alert.get('model_name', 'Unknown')}
Severity: {alert.get('severity', 'Unknown').upper()}
Type: {alert.get('vulnerability_type', 'Unknown')}
Detected: {alert.get('timestamp', datetime.now().isoformat())}

{alert.get('description', 'No description')}

Details: {alert.get('details', 'N/A')}
Source: {alert.get('source_test', 'Unknown')}
"""


class TeamsWebhookChannel(AlertChannel):
    """Canal d'alerte via Microsoft Teams webhook"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('teams_channel')
        self.webhook_url = config.get('webhook_url')
        
        # Couleurs par sévérité
        self.color_map = {
            'critical': 'FF0000',  # Rouge
            'high': 'FF6600',      # Orange
            'medium': 'FFD700',    # Jaune
            'low': '00FF00'        # Vert
        }
    
    def send_alert(self, alert: Dict[str, Any]) -> bool:
        """Envoie une alerte via Teams webhook"""
        try:
            card = self._create_adaptive_card(alert)
            
            response = requests.post(
                self.webhook_url,
                headers={"Content-Type": "application/json"},
                json=card,
                timeout=10
            )
            
            if response.status_code == 200:
                self.logger.info("Teams alert sent successfully")
                return True
            else:
                self.logger.error(f"Failed to send Teams alert: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending Teams alert: {e}")
            return False
    
    def _create_adaptive_card(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Crée une carte adaptative Teams"""
        severity = alert.get('severity', 'medium')
        color = self.color_map.get(severity, 'FFD700')
        
        card = {
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": alert.get('title', 'LLM Security Alert'),
            "themeColor": color,
            "title": f"🚨 {alert.get('title', 'LLM Security Alert')}",
            "sections": [
                {
                    "activityTitle": f"**{severity.upper()}** Vulnerability Detected",
                    "activitySubtitle": alert.get('model_name', 'Unknown Model'),
                    "activityImage": "https://via.placeholder.com/64/FF0000/FFFFFF?text=!",
                    "facts": [
                        {"name": "Severity", "value": severity.upper()},
                        {"name": "Type", "value": alert.get('vulnerability_type', 'Unknown')},
                        {"name": "Model", "value": alert.get('model_name', 'Unknown')},
                        {"name": "Vulnerability Index", "value": str(alert.get('vulnerability_index', 'N/A'))},
                        {"name": "Priority", "value": alert.get('priority', 'N/A')},
                        {"name": "Detected", "value": alert.get('timestamp', datetime.now().isoformat())}
                    ],
                    "text": alert.get('description', 'No description provided')
                }
            ],
            "potentialAction": [
                {
                    "@type": "OpenUri",
                    "name": "View Details",
                    "targets": [
                        {"os": "default", "uri": alert.get('details_url', '#')}
                    ]
                }
            ]
        }
        
        return card


class SlackWebhookChannel(AlertChannel):
    """Canal d'alerte via Slack webhook"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('slack_channel')
        self.webhook_url = config.get('webhook_url')
        
        # Emojis par sévérité
        self.emoji_map = {
            'critical': ':rotating_light:',
            'high': ':warning:',
            'medium': ':large_orange_diamond:',
            'low': ':information_source:'
        }
    
    def send_alert(self, alert: Dict[str, Any]) -> bool:
        """Envoie une alerte via Slack webhook"""
        try:
            message = self._create_slack_message(alert)
            
            response = requests.post(
                self.webhook_url,
                headers={"Content-Type": "application/json"},
                json=message,
                timeout=10
            )
            
            if response.status_code == 200:
                self.logger.info("Slack alert sent successfully")
                return True
            else:
                self.logger.error(f"Failed to send Slack alert: {response.status_code}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error sending Slack alert: {e}")
            return False
    
    def _create_slack_message(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Crée un message Slack avec blocks"""
        severity = alert.get('severity', 'medium')
        emoji = self.emoji_map.get(severity, ':information_source:')
        
        message = {
            "text": f"{emoji} LLM Security Alert: {alert.get('title', 'Vulnerability Detected')}",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": f"{emoji} LLM Security Alert",
                        "emoji": True
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {"type": "mrkdwn", "text": f"*Severity:*\n{severity.upper()}"},
                        {"type": "mrkdwn", "text": f"*Model:*\n{alert.get('model_name', 'Unknown')}"},
                        {"type": "mrkdwn", "text": f"*Type:*\n{alert.get('vulnerability_type', 'Unknown')}"},
                        {"type": "mrkdwn", "text": f"*Priority:*\n{alert.get('priority', 'N/A')}"}
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*Description:*\n{alert.get('description', 'No description')}"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "mrkdwn",
                            "text": f"Detected at {alert.get('timestamp', datetime.now().isoformat())} | Source: {alert.get('source_test', 'Unknown')}"
                        }
                    ]
                }
            ]
        }
        
        return message


class AlertingManager:
    """Gestionnaire central des alertes"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger('alerting_manager')
        self.channels: List[AlertChannel] = []
        
        # Initialisation des canaux configurés
        self._initialize_channels()
        
        # Seuils d'alerte
        self.alert_thresholds = config.get('alert_thresholds', {
            'vulnerability_index': 0.6,  # Alerter si VI > 0.6
            'critical_vulnerabilities': 1,  # Alerter si >= 1 vulnérabilité critique
            'high_vulnerabilities': 3      # Alerter si >= 3 vulnérabilités high
        })
    
    def _initialize_channels(self):
        """Initialise les canaux d'alerte configurés"""
        channels_config = self.config.get('channels', {})
        
        # JIRA
        if channels_config.get('jira', {}).get('enabled', False):
            try:
                jira_channel = JiraTicketingChannel(channels_config['jira'])
                self.channels.append(jira_channel)
                self.logger.info("JIRA channel initialized")
            except Exception as e:
                self.logger.error(f"Failed to initialize JIRA channel: {e}")
        
        # ServiceNow
        if channels_config.get('servicenow', {}).get('enabled', False):
            try:
                snow_channel = ServiceNowTicketingChannel(channels_config['servicenow'])
                self.channels.append(snow_channel)
                self.logger.info("ServiceNow channel initialized")
            except Exception as e:
                self.logger.error(f"Failed to initialize ServiceNow channel: {e}")
        
        # Teams
        if channels_config.get('teams', {}).get('enabled', False):
            try:
                teams_channel = TeamsWebhookChannel(channels_config['teams'])
                self.channels.append(teams_channel)
                self.logger.info("Teams channel initialized")
            except Exception as e:
                self.logger.error(f"Failed to initialize Teams channel: {e}")
        
        # Slack
        if channels_config.get('slack', {}).get('enabled', False):
            try:
                slack_channel = SlackWebhookChannel(channels_config['slack'])
                self.channels.append(slack_channel)
                self.logger.info("Slack channel initialized")
            except Exception as e:
                self.logger.error(f"Failed to initialize Slack channel: {e}")
    
    def should_alert(self, analysis: Dict[str, Any]) -> bool:
        """Détermine si une alerte doit être envoyée"""
        vulnerability_index = analysis.get('vulnerability_index', 0.0)
        vulnerabilities = analysis.get('vulnerabilities', [])
        
        # Compte les vulnérabilités par sévérité
        critical_count = sum(1 for v in vulnerabilities if v.get('severity') == 'critical')
        high_count = sum(1 for v in vulnerabilities if v.get('severity') == 'high')
        
        # Vérifie les seuils
        if vulnerability_index >= self.alert_thresholds['vulnerability_index']:
            return True
        if critical_count >= self.alert_thresholds['critical_vulnerabilities']:
            return True
        if high_count >= self.alert_thresholds['high_vulnerabilities']:
            return True
        
        return False
    
    def send_vulnerability_alert(self, vulnerability: Dict[str, Any], 
                                model_name: str, analysis: Dict[str, Any]) -> Dict[str, bool]:
        """Envoie une alerte pour une vulnérabilité détectée"""
        alert = {
            'title': f"Vulnerability Detected in {model_name}",
            'model_name': model_name,
            'severity': vulnerability.get('severity', 'medium'),
            'vulnerability_type': vulnerability.get('type', 'Unknown'),
            'description': vulnerability.get('description', 'No description'),
            'details': vulnerability.get('details', 'No details'),
            'source_test': vulnerability.get('source_test', 'Unknown'),
            'vulnerability_index': analysis.get('vulnerability_index', 0.0),
            'priority': analysis.get('priority', 'N/A'),
            'timestamp': datetime.now().isoformat(),
            'recommendations': analysis.get('recommendations', [])
        }
        
        results = {}
        for channel in self.channels:
            channel_name = channel.__class__.__name__
            try:
                success = channel.send_alert(alert)
                results[channel_name] = success
            except Exception as e:
                self.logger.error(f"Error sending alert via {channel_name}: {e}")
                results[channel_name] = False
        
        return results
    
    def send_scan_summary_alert(self, model_name: str, analysis: Dict[str, Any]) -> Dict[str, bool]:
        """Envoie une alerte de résumé de scan"""
        vulnerabilities = analysis.get('vulnerabilities', [])
        critical_count = sum(1 for v in vulnerabilities if v.get('severity') == 'critical')
        high_count = sum(1 for v in vulnerabilities if v.get('severity') == 'high')
        
        alert = {
            'title': f"Security Scan Complete: {model_name}",
            'model_name': model_name,
            'severity': analysis.get('risk_level', 'medium'),
            'vulnerability_type': 'Scan Summary',
            'description': f"Security scan completed. Found {len(vulnerabilities)} vulnerabilities ({critical_count} critical, {high_count} high)",
            'details': f"Vulnerability Index: {analysis.get('vulnerability_index', 0.0):.4f}",
            'source_test': 'Security Scan',
            'vulnerability_index': analysis.get('vulnerability_index', 0.0),
            'priority': analysis.get('priority', 'N/A'),
            'timestamp': datetime.now().isoformat(),
            'recommendations': analysis.get('recommendations', [])
        }
        
        results = {}
        for channel in self.channels:
            channel_name = channel.__class__.__name__
            try:
                success = channel.send_alert(alert)
                results[channel_name] = success
            except Exception as e:
                self.logger.error(f"Error sending alert via {channel_name}: {e}")
                results[channel_name] = False
        
        return results
