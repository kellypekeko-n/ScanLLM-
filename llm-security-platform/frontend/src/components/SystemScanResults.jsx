/**
 * SystemScanResults Component
 * Affichage des résultats de scan système (Trivy-style)
 */

import React from 'react';
import { exportSystemScanJSON, exportSystemScanCSV } from '../services/systemScanService';

const SystemScanResults = ({ results }) => {
  if (!results) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '🔴';
      case 'HIGH':
        return '🟠';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              System Scan Results
            </h2>
            <p className="text-gray-300">
              System: <span className="font-semibold text-cyan-400">{results.system_name}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Scan ID: {results.scan_id} | {new Date(results.scan_date).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Scanner</p>
            <p className="text-lg font-semibold text-cyan-400">{results.metadata.scanner}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900">{results.summary.total_vulnerabilities}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <p className="text-sm text-red-600 mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-700">{results.summary.critical}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
          <p className="text-sm text-orange-600 mb-1">High</p>
          <p className="text-3xl font-bold text-orange-700">{results.summary.high}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <p className="text-sm text-yellow-600 mb-1">Medium</p>
          <p className="text-3xl font-bold text-yellow-700">{results.summary.medium}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Low</p>
          <p className="text-3xl font-bold text-blue-700">{results.summary.low}</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => exportSystemScanJSON(results)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download JSON
        </button>
        <button
          onClick={() => exportSystemScanCSV(results)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download CSV
        </button>
        <button
          onClick={() => window.location.href = '/scan-system'}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Scan
        </button>
      </div>

      {/* Vulnerabilities List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            Detected Vulnerabilities ({results.vulnerabilities.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {results.vulnerabilities.map((vuln, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              {/* CVE Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSeverityIcon(vuln.severity)}</span>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {vuln.cve_id}
                    </h4>
                    <p className="text-lg text-gray-700 font-medium">{vuln.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    CVSS: {vuln.cvss_score}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{vuln.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Affected Component</p>
                  <p className="font-semibold text-gray-900">{vuln.affected_component}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Fixed Version</p>
                  <p className="font-semibold text-gray-900">{vuln.fixed_version}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">CWE</p>
                  <p className="font-semibold text-gray-900">{vuln.cwe}</p>
                </div>
              </div>

              {/* CVSS Vector */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-1">CVSS Vector</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                  {vuln.cvss_vector}
                </code>
              </div>

              {/* Dates */}
              <div className="flex gap-6 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-semibold">Published:</span> {new Date(vuln.published_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Last Modified:</span> {new Date(vuln.last_modified).toLocaleDateString()}
                </div>
              </div>

              {/* References */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">References:</p>
                <div className="flex flex-wrap gap-2">
                  {vuln.references.map((ref, refIdx) => (
                    <a
                      key={refIdx}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {ref.includes('nvd.nist.gov') ? '🔗 NVD' : 
                       ref.includes('owasp.org') ? '🔗 OWASP' : 
                       '🔗 Reference'}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Scan Metadata</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Scanner Version</p>
            <p className="font-semibold text-gray-900">{results.metadata.version}</p>
          </div>
          <div>
            <p className="text-gray-600">Scan Duration</p>
            <p className="font-semibold text-gray-900">{results.metadata.scan_duration}</p>
          </div>
          <div>
            <p className="text-gray-600">Endpoint</p>
            <p className="font-semibold text-gray-900">{results.endpoint}</p>
          </div>
          <div>
            <p className="text-gray-600">Model</p>
            <p className="font-semibold text-gray-900">{results.model}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemScanResults;
