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
    // Récupérer les scans depuis le localStorage (scans réels uniquement)
    const loadScans = () => {
      const savedScans = localStorage.getItem('scanHistory');
      if (savedScans) {
        try {
          const parsedScans = JSON.parse(savedScans);
          // Filtrer pour ne garder que les scans avec des résultats valides
          const validScans = parsedScans.filter(scan => scan.results && scan.results.analysis);
          setScans(validScans);
        } catch (error) {
          console.error('Error parsing scan history:', error);
          setScans([]);
        }
      } else {
        // Aucun scan sauvegardé - afficher message vide
        setScans([]);
      }
    };
    
    loadScans();
    
    // Écouter les changements dans localStorage (si un scan est ajouté dans un autre onglet)
    const handleStorageChange = (e) => {
      if (e.key === 'scanHistory') {
        loadScans();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all scan history? This cannot be undone.')) {
      localStorage.removeItem('scanHistory');
      setScans([]);
    }
  };

  const handleRefresh = () => {
    const savedScans = localStorage.getItem('scanHistory');
    if (savedScans) {
      const parsedScans = JSON.parse(savedScans);
      const validScans = parsedScans.filter(scan => scan.results && scan.results.analysis);
      setScans(validScans);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('history')}
            </h1>
            <p className="text-gray-400">
              View all your previous security scans ({scans.length} total)
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            {scans.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Tableau des scans */}
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
                      <Link
                        to={`/scan-results/${scan.id}`}
                        className="text-white font-medium hover:text-cyan-400 transition-colors"
                      >
                        {scan.name}
                      </Link>
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
    </div>
  );
};

export default History;
