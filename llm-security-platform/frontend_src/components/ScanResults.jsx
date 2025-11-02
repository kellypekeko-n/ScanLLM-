/**
 * ScanResults Component
 * Affichage des resultats de scan
 */

import React from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const ScanResults = ({ results, systemName }) => {
  if (!results || !results.analysis) {
    return null;
  }

  const { analysis } = results;
  const score = analysis.overall_security_score;
  const riskLevel = analysis.risk_level;
  const vulnerabilities = analysis.vulnerabilities || [];

  // Couleur du score
  const getScoreColor = (score) => {
    if (score >= 9) return 'text-success-600';
    if (score >= 7) return 'text-warning-600';
    return 'text-danger-600';
  };

  // Couleur du badge de risque
  const getRiskBadgeColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-success-100 text-success-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'high':
      case 'critical':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Couleur de la severite
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return 'bg-success-500';
      case 'medium':
        return 'bg-warning-500';
      case 'high':
        return 'bg-danger-500';
      case 'critical':
        return 'bg-danger-700';
      default:
        return 'bg-gray-500';
    }
  };

  // Icone de severite
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🔴';
      case 'critical':
        return '⛔';
      default:
        return '⚪';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Resultats du Scan
        </h2>
        {systemName && (
          <p className="text-gray-600">Systeme: {systemName}</p>
        )}
        <p className="text-sm text-gray-500">
          Scan effectue le {new Date(analysis.timestamp).toLocaleString('fr-FR')}
        </p>
      </div>

      {/* Score global */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Score de Securite
            </h3>
            <div className="flex items-baseline">
              <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-2xl text-gray-500 ml-2">/10</span>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getRiskBadgeColor(riskLevel)}`}>
              Risque: {riskLevel?.toUpperCase()}
            </span>
            <p className="mt-2 text-sm text-gray-600">
              Priorite: {analysis.priority}
            </p>
          </div>
        </div>
      </div>

      {/* Metriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Tests Completes</p>
          <p className="text-2xl font-bold text-blue-600">
            {analysis.detailed_metrics?.completed_tests || 0}
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Vulnerabilites</p>
          <p className="text-2xl font-bold text-red-600">
            {vulnerabilities.length}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Taux de Reussite</p>
          <p className="text-2xl font-bold text-green-600">
            {((analysis.detailed_metrics?.success_rate || 1) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Vulnerabilites */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Vulnerabilites Detectees ({vulnerabilities.length})
        </h3>

        {vulnerabilities.length === 0 ? (
          <div className="p-6 bg-success-50 border border-success-200 rounded-lg text-center">
            <svg className="mx-auto h-12 w-12 text-success-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-success-700 font-medium">
              Aucune vulnerabilite detectee!
            </p>
            <p className="text-success-600 text-sm mt-1">
              Votre systeme semble bien securise.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getSeverityIcon(vuln.severity)}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vuln.type?.replace(/_/g, ' ').toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-600">{vuln.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity?.toUpperCase()}
                  </span>
                </div>

                {vuln.details && (
                  <p className="text-sm text-gray-500 mt-2 ml-11">
                    {vuln.details}
                  </p>
                )}

                <div className="mt-3 ml-11">
                  <Link
                    to={`/solutions/${vuln.type}`}
                    state={{ vulnerability: vuln }}
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Voir les solutions
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resultats par test */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Resultats par Test
        </h3>
        <div className="space-y-3">
          {Object.entries(analysis.test_summary || {}).map(([testName, testData]) => (
            <div key={testName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {testName.replace(/_/g, ' ').toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {testData.vulnerability_count || 0} vulnerabilite(s)
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className={`h-2 rounded-full ${getScoreColor(testData.score)}`}
                    style={{ width: `${(testData.score / 10) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(testData.score)}`}>
                  {testData.score?.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommandations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Recommandations
          </h3>
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-900">{rec.category}</p>
                    <p className="text-sm text-yellow-700 mt-1">{rec.description}</p>
                    {rec.details && (
                      <p className="text-sm text-yellow-600 mt-1">{rec.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Imprimer le Rapport
        </button>
        <button
          onClick={async () => {
            try {
              const resp = await apiService.exportCsv(
                results?.scan_results || results,
                systemName || 'Unknown System',
                results?.scan_results?.scan_id || null
              );
              const blob = new Blob([resp.data], { type: 'text/csv;charset=utf-8;' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              const ts = analysis?.timestamp ? new Date(analysis.timestamp).toISOString().replace(/[:.]/g, '-') : 'latest';
              a.download = `scan_report_${ts}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (e) {
              console.error('CSV download failed', e);
              alert("Echec du telechargement CSV. Verifiez la connexion a l'API.");
            }
          }}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Telecharger CSV
        </button>
        <Link
          to="/scan"
          className="px-6 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 text-center"
        >
          Nouveau Scan
        </Link>
      </div>
    </div>
  );
};

export default ScanResults;
