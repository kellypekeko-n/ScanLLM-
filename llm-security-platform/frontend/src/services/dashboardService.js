/**
 * Dashboard Service
 * Service pour analyser les statistiques des scans
 */

// Récupérer toutes les statistiques depuis localStorage
export const getDashboardStats = () => {
  const savedScans = localStorage.getItem('scanHistory');
  
  if (!savedScans) {
    return {
      totalScans: 0,
      promptScans: 0,
      systemScans: 0,
      totalVulnerabilities: 0,
      vulnerabilityFrequency: {},
      severityDistribution: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
      averageScore: 0,
      scansByDate: {},
      topVulnerabilities: [],
      recentScans: [],
    };
  }

  const scans = JSON.parse(savedScans);
  
  // Statistiques de base
  const promptScans = scans.filter(s => s.type !== 'system');
  const systemScans = scans.filter(s => s.type === 'system');
  
  // Analyse des vulnérabilités
  const vulnerabilityFrequency = {};
  const severityDistribution = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  let totalVulnerabilities = 0;
  let totalScore = 0;
  let scoreCount = 0;

  // Analyser les scans de prompts
  promptScans.forEach(scan => {
    if (scan.results && scan.results.analysis) {
      const analysis = scan.results.analysis;
      
      // Score
      if (analysis.overall_security_score) {
        totalScore += analysis.overall_security_score;
        scoreCount++;
      }
      
      // Vulnérabilités
      if (analysis.vulnerabilities && Array.isArray(analysis.vulnerabilities)) {
        analysis.vulnerabilities.forEach(vuln => {
          totalVulnerabilities++;
          
          // Compter la fréquence par type
          const vulnType = vuln.type || 'unknown';
          vulnerabilityFrequency[vulnType] = (vulnerabilityFrequency[vulnType] || 0) + 1;
          
          // Distribution par sévérité
          const severity = (vuln.severity || 'MEDIUM').toUpperCase();
          if (severityDistribution[severity] !== undefined) {
            severityDistribution[severity]++;
          }
        });
      }
    }
  });

  // Analyser les scans système (CVE)
  systemScans.forEach(scan => {
    if (scan.results && scan.results.vulnerabilities) {
      scan.results.vulnerabilities.forEach(vuln => {
        totalVulnerabilities++;
        
        // Pour les CVE, utiliser le CWE comme type
        const vulnType = vuln.cwe || vuln.cve_id || 'unknown';
        vulnerabilityFrequency[vulnType] = (vulnerabilityFrequency[vulnType] || 0) + 1;
        
        // Distribution par sévérité
        const severity = (vuln.severity || 'MEDIUM').toUpperCase();
        if (severityDistribution[severity] !== undefined) {
          severityDistribution[severity]++;
        }
      });
    }
  });

  // Top vulnérabilités (les plus fréquentes)
  const topVulnerabilities = Object.entries(vulnerabilityFrequency)
    .map(([type, count]) => ({
      type,
      count,
      percentage: ((count / totalVulnerabilities) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Scans par date (pour graphique)
  const scansByDate = {};
  scans.forEach(scan => {
    const date = new Date(scan.date).toLocaleDateString('fr-FR');
    scansByDate[date] = (scansByDate[date] || 0) + 1;
  });

  // Scans récents (5 derniers)
  const recentScans = scans.slice(0, 5).map(scan => ({
    id: scan.id,
    name: scan.name,
    date: scan.date,
    type: scan.type || 'prompt',
    vulnerabilities: scan.vulnerabilities || 0,
    score: scan.score || null,
  }));

  return {
    totalScans: scans.length,
    promptScans: promptScans.length,
    systemScans: systemScans.length,
    totalVulnerabilities,
    vulnerabilityFrequency,
    severityDistribution,
    averageScore: scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0,
    scansByDate,
    topVulnerabilities,
    recentScans,
  };
};

// Obtenir les recommandations basées sur les vulnérabilités fréquentes
export const getRecommendations = (topVulnerabilities) => {
  const recommendations = {
    prompt_injection: {
      title: 'Prompt Injection',
      priority: 'CRITICAL',
      recommendation: 'Implement input validation and sanitization. Use prompt templates with clear boundaries.',
      solution: 'Add a validation layer before processing user inputs. Consider using a whitelist approach.',
    },
    jailbreak: {
      title: 'Jailbreak',
      priority: 'CRITICAL',
      recommendation: 'Strengthen system prompts and add output filtering. Implement adversarial testing.',
      solution: 'Use robust system prompts that cannot be easily overridden. Add content moderation.',
    },
    toxicity: {
      title: 'Toxicity',
      priority: 'HIGH',
      recommendation: 'Implement content moderation and toxicity detection filters.',
      solution: 'Use pre-trained toxicity classifiers and set appropriate thresholds.',
    },
    pii_leakage: {
      title: 'PII Leakage',
      priority: 'CRITICAL',
      recommendation: 'Add PII detection and redaction. Implement data anonymization.',
      solution: 'Use regex patterns and NER models to detect and mask sensitive information.',
    },
    hallucination: {
      title: 'Hallucination',
      priority: 'HIGH',
      recommendation: 'Implement fact-checking mechanisms and source attribution.',
      solution: 'Add confidence scoring and require citations for factual claims.',
    },
    safety_bypass: {
      title: 'Safety Bypass',
      priority: 'HIGH',
      recommendation: 'Strengthen safety guardrails and add multi-layer defense.',
      solution: 'Implement cascading safety checks and anomaly detection.',
    },
    structural_probe: {
      title: 'Structural Probe',
      priority: 'MEDIUM',
      recommendation: 'Implement rate limiting and query monitoring.',
      solution: 'Add request throttling and detect suspicious query patterns.',
    },
  };

  return topVulnerabilities.map(vuln => {
    const vulnKey = vuln.type.toLowerCase().replace(/\s+/g, '_');
    const rec = recommendations[vulnKey] || {
      title: vuln.type,
      priority: 'MEDIUM',
      recommendation: 'Review and address this vulnerability type.',
      solution: 'Implement appropriate security measures.',
    };
    
    return {
      ...rec,
      frequency: vuln.count,
      percentage: vuln.percentage,
    };
  });
};

// Exporter les statistiques en CSV
export const exportDashboardCSV = (stats) => {
  const csvLines = [
    ['Dashboard Statistics Report'],
    ['Generated', new Date().toLocaleString()],
    [''],
    ['Overview'],
    ['Total Scans', stats.totalScans],
    ['Prompt Scans', stats.promptScans],
    ['System Scans', stats.systemScans],
    ['Total Vulnerabilities', stats.totalVulnerabilities],
    ['Average Security Score', stats.averageScore],
    [''],
    ['Severity Distribution'],
    ['Critical', stats.severityDistribution.CRITICAL],
    ['High', stats.severityDistribution.HIGH],
    ['Medium', stats.severityDistribution.MEDIUM],
    ['Low', stats.severityDistribution.LOW],
    [''],
    ['Top Vulnerabilities'],
    ['Type', 'Count', 'Percentage'],
    ...stats.topVulnerabilities.map(v => [v.type, v.count, v.percentage + '%']),
  ];

  const csvContent = csvLines.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard_stats_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default {
  getDashboardStats,
  getRecommendations,
  exportDashboardCSV,
};
