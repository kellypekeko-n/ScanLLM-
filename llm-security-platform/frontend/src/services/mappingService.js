/**
 * Mapping Service
 * Service pour mapper les vulnérabilités aux standards NIST, CVE, OWASP
 */

// NIST AI RMF Mapping
export const NIST_AI_RMF_MAPPING = {
  prompt_injection: {
    category: 'GOVERN',
    controls: ['GOVERN-1.2', 'MAP-2.3', 'MEASURE-2.7'],
    description: 'Input validation and adversarial testing',
    risk_level: 'HIGH',
  },
  jailbreak: {
    category: 'GOVERN',
    controls: ['GOVERN-1.2', 'MANAGE-2.1', 'MEASURE-2.7'],
    description: 'System prompt protection and guardrails',
    risk_level: 'CRITICAL',
  },
  toxicity: {
    category: 'MANAGE',
    controls: ['MANAGE-1.1', 'MANAGE-4.1', 'MEASURE-2.3'],
    description: 'Content filtering and safety measures',
    risk_level: 'MEDIUM',
  },
  pii_leakage: {
    category: 'GOVERN',
    controls: ['GOVERN-3.1', 'MAP-5.1', 'MEASURE-1.1'],
    description: 'Data privacy and PII protection',
    risk_level: 'CRITICAL',
  },
  hallucination: {
    category: 'MEASURE',
    controls: ['MEASURE-2.2', 'MEASURE-2.11', 'MANAGE-2.3'],
    description: 'Output validation and factuality checks',
    risk_level: 'HIGH',
  },
  safety_bypass: {
    category: 'MANAGE',
    controls: ['MANAGE-2.1', 'MANAGE-4.2', 'MEASURE-2.7'],
    description: 'Safety guardrails and content moderation',
    risk_level: 'HIGH',
  },
  structural_probe: {
    category: 'MAP',
    controls: ['MAP-2.3', 'MEASURE-2.8', 'MANAGE-1.3'],
    description: 'System architecture security',
    risk_level: 'MEDIUM',
  },
};

// OWASP Top 10 for LLM Mapping
export const OWASP_LLM_MAPPING = {
  prompt_injection: {
    owasp_id: 'LLM01',
    name: 'Prompt Injection',
    description: 'Manipulating LLM via crafted inputs',
    severity: 'CRITICAL',
    mitigation: [
      'Input validation and sanitization',
      'Privilege control and separation',
      'Human-in-the-loop for sensitive actions',
    ],
  },
  jailbreak: {
    owasp_id: 'LLM01',
    name: 'Prompt Injection (Jailbreak)',
    description: 'Bypassing safety guardrails',
    severity: 'CRITICAL',
    mitigation: [
      'Robust system prompts',
      'Output filtering',
      'Regular adversarial testing',
    ],
  },
  pii_leakage: {
    owasp_id: 'LLM06',
    name: 'Sensitive Information Disclosure',
    description: 'Exposing confidential data',
    severity: 'HIGH',
    mitigation: [
      'Data sanitization',
      'Access controls',
      'Encryption at rest and in transit',
    ],
  },
  toxicity: {
    owasp_id: 'LLM09',
    name: 'Overreliance',
    description: 'Generating harmful content',
    severity: 'MEDIUM',
    mitigation: [
      'Content moderation',
      'User education',
      'Clear disclaimers',
    ],
  },
  hallucination: {
    owasp_id: 'LLM09',
    name: 'Overreliance',
    description: 'Generating false information',
    severity: 'HIGH',
    mitigation: [
      'Fact-checking mechanisms',
      'Source attribution',
      'Confidence scoring',
    ],
  },
  safety_bypass: {
    owasp_id: 'LLM01',
    name: 'Prompt Injection',
    description: 'Circumventing safety measures',
    severity: 'HIGH',
    mitigation: [
      'Multi-layer defense',
      'Regular security audits',
      'Anomaly detection',
    ],
  },
  structural_probe: {
    owasp_id: 'LLM10',
    name: 'Model Theft',
    description: 'Probing model architecture',
    severity: 'MEDIUM',
    mitigation: [
      'Rate limiting',
      'Query monitoring',
      'Watermarking',
    ],
  },
};

// CVE Database (exemples - à compléter avec vraie API)
export const CVE_DATABASE = {
  prompt_injection: [
    {
      cve_id: 'CVE-2023-29374',
      description: 'ChatGPT Prompt Injection Vulnerability',
      cvss_score: 7.5,
      published: '2023-04-15',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-29374'],
    },
    {
      cve_id: 'CVE-2023-36188',
      description: 'LLM Indirect Prompt Injection',
      cvss_score: 8.1,
      published: '2023-06-20',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-36188'],
    },
  ],
  jailbreak: [
    {
      cve_id: 'CVE-2023-28442',
      description: 'AI Model Jailbreak via DAN Technique',
      cvss_score: 8.8,
      published: '2023-03-25',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-28442'],
    },
  ],
  pii_leakage: [
    {
      cve_id: 'CVE-2023-32784',
      description: 'LLM Training Data Extraction',
      cvss_score: 9.1,
      published: '2023-05-10',
      references: ['https://nvd.nist.gov/vuln/detail/CVE-2023-32784'],
    },
  ],
};

// Fonction pour obtenir le mapping NIST complet
export const getNISTMapping = (vulnerabilityType) => {
  return NIST_AI_RMF_MAPPING[vulnerabilityType] || null;
};

// Fonction pour obtenir le mapping OWASP
export const getOWASPMapping = (vulnerabilityType) => {
  return OWASP_LLM_MAPPING[vulnerabilityType] || null;
};

// Fonction pour obtenir les CVE associés
export const getCVEList = (vulnerabilityType) => {
  return CVE_DATABASE[vulnerabilityType] || [];
};

// Fonction pour générer un rapport de conformité NIST
export const generateNISTComplianceReport = (vulnerabilities) => {
  const affectedControls = new Set();
  const categories = {};

  vulnerabilities.forEach((vuln) => {
    const mapping = getNISTMapping(vuln.type);
    if (mapping) {
      mapping.controls.forEach((control) => affectedControls.add(control));
      
      if (!categories[mapping.category]) {
        categories[mapping.category] = [];
      }
      categories[mapping.category].push(vuln);
    }
  });

  return {
    total_controls_affected: affectedControls.size,
    controls: Array.from(affectedControls),
    categories,
    compliance_score: calculateComplianceScore(vulnerabilities),
  };
};

// Calculer le score de conformité NIST
const calculateComplianceScore = (vulnerabilities) => {
  if (vulnerabilities.length === 0) return 100;

  const totalControls = 23; // Total NIST AI RMF controls
  const affectedControls = new Set();

  vulnerabilities.forEach((vuln) => {
    const mapping = getNISTMapping(vuln.type);
    if (mapping) {
      mapping.controls.forEach((control) => affectedControls.add(control));
    }
  });

  const score = ((totalControls - affectedControls.size) / totalControls) * 100;
  return Math.round(score * 10) / 10;
};

// Fonction pour générer un rapport OWASP
export const generateOWASPReport = (vulnerabilities) => {
  const owaspIssues = {};

  vulnerabilities.forEach((vuln) => {
    const mapping = getOWASPMapping(vuln.type);
    if (mapping) {
      if (!owaspIssues[mapping.owasp_id]) {
        owaspIssues[mapping.owasp_id] = {
          ...mapping,
          vulnerabilities: [],
        };
      }
      owaspIssues[mapping.owasp_id].vulnerabilities.push(vuln);
    }
  });

  return {
    total_owasp_categories: Object.keys(owaspIssues).length,
    issues: owaspIssues,
  };
};

// Fonction pour générer un rapport CVE
export const generateCVEReport = (vulnerabilities) => {
  const allCVEs = [];

  vulnerabilities.forEach((vuln) => {
    const cves = getCVEList(vuln.type);
    cves.forEach((cve) => {
      allCVEs.push({
        ...cve,
        related_vulnerability: vuln,
      });
    });
  });

  return {
    total_related_cves: allCVEs.length,
    cves: allCVEs,
    highest_cvss: allCVEs.length > 0 ? Math.max(...allCVEs.map((c) => c.cvss_score)) : 0,
  };
};

export default {
  getNISTMapping,
  getOWASPMapping,
  getCVEList,
  generateNISTComplianceReport,
  generateOWASPReport,
  generateCVEReport,
};
