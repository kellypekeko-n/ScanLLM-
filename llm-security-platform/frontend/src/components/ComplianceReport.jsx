/**
 * ComplianceReport Component
 * Affiche les rapports de conformité NIST, OWASP, et CVE
 */

import React, { useState } from 'react';
import {
  generateNISTComplianceReport,
  generateOWASPReport,
  generateCVEReport,
} from '../services/mappingService';

const ComplianceReport = ({ vulnerabilities }) => {
  const [activeTab, setActiveTab] = useState('nist');

  const nistReport = generateNISTComplianceReport(vulnerabilities);
  const owaspReport = generateOWASPReport(vulnerabilities);
  const cveReport = generateCVEReport(vulnerabilities);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Rapports de Conformité
      </h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('nist')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'nist'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          NIST AI RMF
        </button>
        <button
          onClick={() => setActiveTab('owasp')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'owasp'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          OWASP Top 10
        </button>
        <button
          onClick={() => setActiveTab('cve')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'cve'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CVE Database
        </button>
      </div>

      {/* NIST Tab */}
      {activeTab === 'nist' && (
        <div className="space-y-6">
          {/* Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Score de Conformité NIST AI RMF
                </h4>
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold ${getScoreColor(nistReport.compliance_score)}`}>
                    {nistReport.compliance_score}
                  </span>
                  <span className="text-2xl text-gray-500 ml-2">%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Contrôles Affectés</p>
                <p className="text-3xl font-bold text-red-600">
                  {nistReport.total_controls_affected}
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Catégories NIST Affectées
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(nistReport.categories).map(([category, vulns]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{category}</h5>
                  <p className="text-sm text-gray-600 mb-3">
                    {vulns.length} vulnérabilité(s) détectée(s)
                  </p>
                  <ul className="space-y-1">
                    {vulns.map((vuln, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {vuln.type?.replace(/_/g, ' ').toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Contrôles NIST à Renforcer
            </h4>
            <div className="flex flex-wrap gap-2">
              {nistReport.controls.map((control) => (
                <span
                  key={control}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                >
                  {control}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OWASP Tab */}
      {activeTab === 'owasp' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Catégories OWASP Top 10 for LLM Détectées
            </h4>
            <p className="text-4xl font-bold text-orange-600">
              {owaspReport.total_owasp_categories}
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(owaspReport.issues).map(([owaspId, issue]) => (
              <div key={owaspId} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="text-xl font-bold text-gray-900">
                      {issue.owasp_id}: {issue.name}
                    </h5>
                    <p className="text-gray-600 mt-1">{issue.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {issue.severity}
                  </span>
                </div>

                <div className="mb-4">
                  <h6 className="font-semibold text-gray-900 mb-2">
                    Vulnérabilités Associées:
                  </h6>
                  <ul className="space-y-1">
                    {issue.vulnerabilities.map((vuln, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {vuln.description || vuln.type}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h6 className="font-semibold text-gray-900 mb-2">
                    Mesures d'Atténuation:
                  </h6>
                  <ul className="space-y-1">
                    {issue.mitigation.map((measure, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {measure}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CVE Tab */}
      {activeTab === 'cve' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  CVE Associés
                </h4>
                <p className="text-4xl font-bold text-purple-600">
                  {cveReport.total_related_cves}
                </p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  CVSS Score Max
                </h4>
                <p className="text-4xl font-bold text-red-600">
                  {cveReport.highest_cvss.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {cveReport.total_related_cves === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">Aucun CVE associé trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cveReport.cves.map((cve, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="text-lg font-bold text-gray-900">{cve.cve_id}</h5>
                      <p className="text-sm text-gray-500">Publié le {new Date(cve.published).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cve.cvss_score >= 9 ? 'bg-red-100 text-red-800' :
                      cve.cvss_score >= 7 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      CVSS {cve.cvss_score}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{cve.description}</p>

                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Vulnérabilité Associée:
                    </p>
                    <p className="text-sm text-gray-700">
                      {cve.related_vulnerability.type?.replace(/_/g, ' ').toUpperCase()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {cve.references.map((ref, refIdx) => (
                      <a
                        key={refIdx}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Voir détails →
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplianceReport;
