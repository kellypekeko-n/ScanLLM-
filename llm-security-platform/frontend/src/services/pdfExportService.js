/**
 * PDF Export Service
 * Service pour générer des rapports PDF
 */

import {
  generateNISTComplianceReport,
  generateOWASPReport,
  generateCVEReport,
} from './mappingService';

// Fonction pour générer le contenu HTML du PDF
export const generatePDFContent = (results, systemName, scanId) => {
  const { analysis } = results;
  const vulnerabilities = analysis.vulnerabilities || [];
  
  const nistReport = generateNISTComplianceReport(vulnerabilities);
  const owaspReport = generateOWASPReport(vulnerabilities);
  const cveReport = generateCVEReport(vulnerabilities);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LLM Security Scan Report - ${systemName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0891b2;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0891b2;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #0891b2;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    .score-box {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border: 2px solid #0891b2;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .score {
      font-size: 48px;
      font-weight: bold;
      color: ${analysis.overall_security_score >= 9 ? '#16a34a' : analysis.overall_security_score >= 7 ? '#ca8a04' : '#dc2626'};
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .metric-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .metric-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #0891b2;
    }
    .vulnerability {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    .vulnerability h3 {
      margin: 0 0 10px 0;
      color: #111827;
    }
    .severity {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .severity-critical { background: #fee2e2; color: #991b1b; }
    .severity-high { background: #fed7aa; color: #9a3412; }
    .severity-medium { background: #fef3c7; color: #92400e; }
    .severity-low { background: #d1fae5; color: #065f46; }
    .recommendation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 10px 0;
    }
    .compliance-score {
      font-size: 36px;
      font-weight: bold;
      color: ${nistReport.compliance_score >= 90 ? '#16a34a' : nistReport.compliance_score >= 70 ? '#ca8a04' : '#dc2626'};
    }
    .control-tag {
      display: inline-block;
      background: #fee2e2;
      color: #991b1b;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin: 2px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    @media print {
      body { margin: 0; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛡️ LLM Security Scan Report</h1>
    <p><strong>System:</strong> ${systemName || 'N/A'}</p>
    <p><strong>Scan ID:</strong> ${scanId || 'N/A'}</p>
    <p><strong>Date:</strong> ${new Date(analysis.timestamp).toLocaleString('fr-FR')}</p>
  </div>

  <div class="section">
    <h2>📊 Score de Sécurité Global</h2>
    <div class="score-box">
      <div class="score">${analysis.overall_security_score.toFixed(1)}/10</div>
      <p style="margin: 10px 0 0 0; color: #666;">Niveau de Risque: <strong>${analysis.risk_level?.toUpperCase()}</strong></p>
    </div>
  </div>

  <div class="section">
    <h2>📈 Métriques Clés</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-label">Tests Complétés</div>
        <div class="metric-value">${analysis.detailed_metrics?.completed_tests || 0}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Vulnérabilités</div>
        <div class="metric-value" style="color: #dc2626;">${vulnerabilities.length}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Taux de Réussite</div>
        <div class="metric-value" style="color: #16a34a;">${((analysis.detailed_metrics?.success_rate || 1) * 100).toFixed(0)}%</div>
      </div>
    </div>
  </div>

  ${vulnerabilities.length > 0 ? `
  <div class="section">
    <h2>🔍 Vulnérabilités Détectées (${vulnerabilities.length})</h2>
    ${vulnerabilities.map((vuln) => `
      <div class="vulnerability">
        <h3>${vuln.type?.replace(/_/g, ' ').toUpperCase()}</h3>
        <span class="severity severity-${vuln.severity?.toLowerCase()}">${vuln.severity?.toUpperCase()}</span>
        <p>${vuln.description || 'No description available'}</p>
        ${vuln.details ? `<p style="color: #666; font-size: 14px;">${vuln.details}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : '<div class="section"><p style="color: #16a34a; font-weight: bold;">✅ Aucune vulnérabilité détectée!</p></div>'}

  ${analysis.recommendations && analysis.recommendations.length > 0 ? `
  <div class="section">
    <h2>💡 Recommandations</h2>
    ${analysis.recommendations.map((rec) => `
      <div class="recommendation">
        <strong>${rec.category}</strong>
        <p style="margin: 5px 0 0 0;">${rec.description}</p>
        ${rec.details ? `<p style="margin: 5px 0 0 0; font-size: 14px;">${rec.details}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <h2>🏛️ Conformité NIST AI RMF</h2>
    <div class="score-box">
      <div class="compliance-score">${nistReport.compliance_score}%</div>
      <p style="margin: 10px 0 0 0; color: #666;">Score de Conformité</p>
    </div>
    <p><strong>Contrôles Affectés:</strong> ${nistReport.total_controls_affected}</p>
    <div style="margin-top: 10px;">
      ${nistReport.controls.map(control => `<span class="control-tag">${control}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h2>🔐 OWASP Top 10 for LLM</h2>
    <p><strong>Catégories Détectées:</strong> ${owaspReport.total_owasp_categories}</p>
    ${Object.entries(owaspReport.issues).map(([owaspId, issue]) => `
      <div class="vulnerability">
        <h3>${issue.owasp_id}: ${issue.name}</h3>
        <span class="severity severity-${issue.severity?.toLowerCase()}">${issue.severity}</span>
        <p>${issue.description}</p>
        <p style="margin-top: 10px;"><strong>Mesures d'Atténuation:</strong></p>
        <ul>
          ${issue.mitigation.map(m => `<li>${m}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>🔗 CVE Associés</h2>
    <p><strong>Total CVE:</strong> ${cveReport.total_related_cves}</p>
    ${cveReport.total_related_cves > 0 ? `
      <p><strong>CVSS Score Maximum:</strong> ${cveReport.highest_cvss.toFixed(1)}</p>
      ${cveReport.cves.map(cve => `
        <div class="vulnerability">
          <h3>${cve.cve_id}</h3>
          <span class="severity severity-${cve.cvss_score >= 9 ? 'critical' : cve.cvss_score >= 7 ? 'high' : 'medium'}">CVSS ${cve.cvss_score}</span>
          <p>${cve.description}</p>
          <p style="font-size: 12px; color: #666;">Publié le ${new Date(cve.published).toLocaleDateString()}</p>
        </div>
      `).join('')}
    ` : '<p style="color: #16a34a;">✅ Aucun CVE associé trouvé</p>'}
  </div>

  <div class="footer">
    <p>Rapport généré par LLM Security Platform</p>
    <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
  </div>
</body>
</html>
  `;

  return html;
};

// Fonction pour télécharger le PDF
export const downloadPDF = (results, systemName, scanId) => {
  const htmlContent = generatePDFContent(results, systemName, scanId);
  
  // Créer un blob et télécharger
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `llm_security_report_${scanId || Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Ouvrir dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export default {
  generatePDFContent,
  downloadPDF,
};
