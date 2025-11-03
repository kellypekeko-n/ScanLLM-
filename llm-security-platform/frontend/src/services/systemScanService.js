/**
 * System Scan Service (Trivy-style)
 * Service pour scanner des systèmes et générer des CVE
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://llm-security-plateform.azurewebsites.net';

// Simuler un scan système type Trivy
export const scanSystem = async (systemConfig) => {
  try {
    // Pour l'instant, on simule le scan car le backend n'a pas encore cet endpoint
    // TODO: Remplacer par un vrai appel API quand le backend sera prêt
    
    const response = await simulateSystemScan(systemConfig);
    return response;
  } catch (error) {
    console.error('System scan error:', error);
    throw error;
  }
};

// Simulation d'un scan système (à remplacer par vraie API)
const simulateSystemScan = async (systemConfig) => {
  // Simuler un délai de scan
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Générer des CVE fictifs basés sur le système
  const cves = generateMockCVEs(systemConfig.name);

  return {
    scan_id: `sys_${Date.now()}`,
    system_name: systemConfig.name,
    endpoint: systemConfig.base_url || 'N/A',
    model: systemConfig.model || 'N/A',
    scan_date: new Date().toISOString(),
    scan_type: 'system',
    summary: {
      total_vulnerabilities: cves.length,
      critical: cves.filter(c => c.severity === 'CRITICAL').length,
      high: cves.filter(c => c.severity === 'HIGH').length,
      medium: cves.filter(c => c.severity === 'MEDIUM').length,
      low: cves.filter(c => c.severity === 'LOW').length,
    },
    vulnerabilities: cves,
    metadata: {
      scanner: 'LLM Security Platform (Trivy-style)',
      version: '1.0.0',
      scan_duration: '3.2s',
    },
  };
};

// Générer des CVE mockés
const generateMockCVEs = (systemName) => {
  const mockCVEs = [
    {
      cve_id: 'CVE-2024-1234',
      title: 'LLM Prompt Injection Vulnerability',
      description: 'The system is vulnerable to prompt injection attacks that could allow attackers to manipulate model outputs.',
      severity: 'CRITICAL',
      cvss_score: 9.8,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      affected_component: 'LLM Input Handler',
      fixed_version: 'N/A',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-1234',
        'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      ],
      cwe: 'CWE-20: Improper Input Validation',
      published_date: '2024-01-15',
      last_modified: '2024-02-20',
    },
    {
      cve_id: 'CVE-2024-5678',
      title: 'Sensitive Data Exposure in Training Data',
      description: 'The model may inadvertently expose sensitive information from its training data through carefully crafted prompts.',
      severity: 'HIGH',
      cvss_score: 8.6,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:L',
      affected_component: 'Model Training Pipeline',
      fixed_version: 'v2.1.0',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-5678',
        'https://arxiv.org/abs/2012.07805',
      ],
      cwe: 'CWE-200: Exposure of Sensitive Information',
      published_date: '2024-03-10',
      last_modified: '2024-03-25',
    },
    {
      cve_id: 'CVE-2024-9012',
      title: 'Insufficient Output Sanitization',
      description: 'The system does not properly sanitize model outputs, potentially allowing injection of malicious content.',
      severity: 'HIGH',
      cvss_score: 7.5,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:H/A:L',
      affected_component: 'Output Handler',
      fixed_version: 'v1.5.2',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-9012',
      ],
      cwe: 'CWE-79: Cross-site Scripting (XSS)',
      published_date: '2024-02-05',
      last_modified: '2024-02-28',
    },
    {
      cve_id: 'CVE-2023-4567',
      title: 'Model Denial of Service via Resource Exhaustion',
      description: 'Attackers can craft inputs that cause excessive resource consumption, leading to denial of service.',
      severity: 'MEDIUM',
      cvss_score: 6.5,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:H',
      affected_component: 'Request Handler',
      fixed_version: 'v1.4.0',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2023-4567',
      ],
      cwe: 'CWE-400: Uncontrolled Resource Consumption',
      published_date: '2023-11-20',
      last_modified: '2023-12-15',
    },
    {
      cve_id: 'CVE-2023-8901',
      title: 'Insecure API Key Storage',
      description: 'API keys are stored in plaintext in configuration files, potentially exposing them to unauthorized access.',
      severity: 'MEDIUM',
      cvss_score: 5.9,
      cvss_vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N',
      affected_component: 'Configuration Manager',
      fixed_version: 'v1.6.0',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2023-8901',
      ],
      cwe: 'CWE-312: Cleartext Storage of Sensitive Information',
      published_date: '2023-10-12',
      last_modified: '2023-11-08',
    },
    {
      cve_id: 'CVE-2024-2345',
      title: 'Insufficient Rate Limiting',
      description: 'The API does not implement proper rate limiting, allowing potential abuse and resource exhaustion.',
      severity: 'LOW',
      cvss_score: 4.3,
      cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:L',
      affected_component: 'API Gateway',
      fixed_version: 'v1.7.0',
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-2345',
      ],
      cwe: 'CWE-770: Allocation of Resources Without Limits',
      published_date: '2024-01-08',
      last_modified: '2024-01-22',
    },
  ];

  // Retourner un nombre aléatoire de CVE (3-6)
  const count = Math.floor(Math.random() * 4) + 3;
  return mockCVEs.slice(0, count);
};

// Exporter les résultats en JSON
export const exportSystemScanJSON = (scanResults) => {
  const json = JSON.stringify(scanResults, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system_scan_${scanResults.scan_id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Exporter en format CSV
export const exportSystemScanCSV = (scanResults) => {
  // En-têtes CSV
  const headers = [
    'CVE ID',
    'Title',
    'Severity',
    'CVSS Score',
    'CVSS Vector',
    'Affected Component',
    'Fixed Version',
    'CWE',
    'Description',
    'Published Date',
    'Last Modified',
    'References'
  ];

  // Créer les lignes CSV
  const rows = scanResults.vulnerabilities.map(vuln => [
    vuln.cve_id,
    `"${vuln.title.replace(/"/g, '""')}"`, // Échapper les guillemets
    vuln.severity,
    vuln.cvss_score,
    vuln.cvss_vector,
    `"${vuln.affected_component}"`,
    vuln.fixed_version,
    vuln.cwe,
    `"${vuln.description.replace(/"/g, '""')}"`,
    vuln.published_date,
    vuln.last_modified,
    `"${vuln.references.join('; ')}"`,
  ]);

  // Ajouter les métadonnées en haut
  const metadata = [
    ['System Scan Report'],
    [''],
    ['System Name', scanResults.system_name],
    ['Scan ID', scanResults.scan_id],
    ['Scan Date', new Date(scanResults.scan_date).toLocaleString()],
    ['Endpoint', scanResults.endpoint],
    ['Model', scanResults.model],
    ['Scanner', scanResults.metadata.scanner],
    ['Scanner Version', scanResults.metadata.version],
    ['Scan Duration', scanResults.metadata.scan_duration],
    [''],
    ['Summary'],
    ['Total Vulnerabilities', scanResults.summary.total_vulnerabilities],
    ['Critical', scanResults.summary.critical],
    ['High', scanResults.summary.high],
    ['Medium', scanResults.summary.medium],
    ['Low', scanResults.summary.low],
    [''],
    ['Vulnerabilities'],
    headers,
  ];

  // Combiner métadonnées et données
  const allRows = [...metadata, ...rows];

  // Convertir en CSV
  const csvContent = allRows.map(row => row.join(',')).join('\n');

  // Télécharger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system_scan_${scanResults.scan_id}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default {
  scanSystem,
  exportSystemScanJSON,
  exportSystemScanCSV,
};
