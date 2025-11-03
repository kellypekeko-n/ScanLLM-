/**
 * SystemScanResults Component
 * Affichage des résultats de scan système
 */

import React, { useState } from 'react';
import { exportSystemScanJSON, exportSystemScanCSV } from '../services/systemScanService';
import { generateAllSolutions, exportSolutionsMarkdown } from '../services/cveSolutionsService';

const SystemScanResults = ({ results }) => {
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  
  if (!results) return null;

  // Générer toutes les solutions
  const allSolutions = generateAllSolutions(results.vulnerabilities);

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
          onClick={() => setShowSolutions(!showSolutions)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {showSolutions ? 'Hide Solutions' : 'View Solutions'}
        </button>
        <button
          onClick={() => exportSolutionsMarkdown(allSolutions, results.system_name)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Solutions
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

      {/* Solutions Section */}
      {showSolutions && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-lg border-2 border-purple-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-900 flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Security Solutions ({allSolutions.length})
            </h2>
          </div>
          
          <div className="space-y-6">
            {allSolutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-purple-200 overflow-hidden">
                {/* Solution Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {solution.cve_id}: {solution.title}
                      </h3>
                      <p className="text-purple-100 text-sm">{solution.solution_type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      solution.severity === 'CRITICAL' ? 'bg-red-200 text-red-900' :
                      solution.severity === 'HIGH' ? 'bg-orange-200 text-orange-900' :
                      solution.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-900' :
                      'bg-blue-200 text-blue-900'
                    }`}>
                      {solution.severity}
                    </span>
                  </div>
                </div>

                {/* Solution Steps */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Implementation Steps:
                  </h4>
                  
                  <div className="space-y-4">
                    {solution.solutions.map((step, stepIndex) => (
                      <div key={stepIndex} className="border-l-4 border-purple-500 pl-4">
                        <h5 className="font-semibold text-purple-900 mb-2">
                          Step {step.step}: {step.title}
                        </h5>
                        <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>

                  {/* Prevention Measures */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prevention Measures:
                    </h4>
                    <ul className="space-y-2">
                      {solution.prevention.map((prev, prevIndex) => (
                        <li key={prevIndex} className="flex items-start gap-2 text-sm text-green-800">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
