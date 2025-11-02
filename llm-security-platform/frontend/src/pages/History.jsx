/**
 * History Page - Scan History
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const History = () => {
  const { t } = useLanguage();
  const [scans, setScans] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockScans = [
      {
        id: '1a2b3c4d',
        name: 'Production Chatbot',
        date: '2025-11-02T10:30:00',
        status: 'completed',
        score: 8.5,
        vulnerabilities: 2,
      },
      {
        id: '5e6f7g8h',
        name: 'Customer Service Bot',
        date: '2025-11-01T14:15:00',
        status: 'completed',
        score: 9.2,
        vulnerabilities: 1,
      },
      {
        id: '9i0j1k2l',
        name: 'Internal Assistant',
        date: '2025-10-31T09:45:00',
        status: 'error',
        score: null,
        vulnerabilities: null,
      },
    ];
    setScans(mockScans);
  }, []);

  const getStatusBadge = (status) => {
    const classes = {
      completed: 'bg-green-500/20 text-green-400 border-green-500',
      error: 'bg-red-500/20 text-red-400 border-red-500',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${classes[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    if (score === null) return '-';
    const color = score >= 9 ? 'text-green-400' : score >= 7 ? 'text-yellow-400' : 'text-red-400';
    return <span className={`font-bold text-lg ${color}`}>{score.toFixed(1)}/10</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('history')}
          </h1>
          <p className="text-gray-400">
            View all your previous security scans
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t('scanId')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    System Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vulnerabilities
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-cyan-400 text-sm">{scan.id}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{scan.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {new Date(scan.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(scan.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getScoreBadge(scan.score)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {scan.vulnerabilities !== null ? (
                        <span className={`font-semibold ${scan.vulnerabilities > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {scan.vulnerabilities}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/scan-results/${scan.id}`}
                        className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {scans.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No scans yet</p>
            <Link to="/scan" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
              Run your first scan →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
