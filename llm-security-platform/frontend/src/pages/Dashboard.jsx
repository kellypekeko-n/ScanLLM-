/**
 * Dashboard Page
 * Affiche les statistiques et analyses des scans
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecommendations, exportDashboardCSV } from '../services/dashboardService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    const dashboardStats = getDashboardStats();
    setStats(dashboardStats);
    
    if (dashboardStats.topVulnerabilities.length > 0) {
      const recs = getRecommendations(dashboardStats.topVulnerabilities);
      setRecommendations(recs);
    }
    
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-300',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      LOW: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[priority] || colors.MEDIUM;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats || stats.totalScans === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
            <p className="text-gray-400 mb-6">Run some scans to see statistics and insights</p>
            <div className="flex gap-4 justify-center">
              <Link to="/scan" className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 font-semibold">
                Test a Prompt
              </Link>
              <Link to="/scan-system" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-400 font-semibold">
                Scan a System
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Security Analytics & Insights</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => exportDashboardCSV(stats)}
              className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total Scans</h3>
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalScans}</p>
            <p className="text-sm text-gray-400 mt-2">
              {stats.promptScans} prompts • {stats.systemScans} systems
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Vulnerabilities</h3>
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalVulnerabilities}</p>
            <p className="text-sm text-gray-400 mt-2">
              {stats.severityDistribution.CRITICAL} critical • {stats.severityDistribution.HIGH} high
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Avg Security Score</h3>
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{stats.averageScore}/10</p>
            <p className="text-sm text-gray-400 mt-2">
              Based on {stats.promptScans} prompt scans
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Most Common</h3>
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-white truncate">
              {stats.topVulnerabilities[0]?.type.replace(/_/g, ' ') || 'N/A'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {stats.topVulnerabilities[0]?.count || 0} occurrences ({stats.topVulnerabilities[0]?.percentage || 0}%)
            </p>
          </div>
        </div>

        {/* Top Vulnerabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Top 10 Vulnerabilities
            </h2>
            <div className="space-y-4">
              {stats.topVulnerabilities.map((vuln, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">
                        {vuln.type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {vuln.count} ({vuln.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${vuln.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Severity Distribution
            </h2>
            <div className="space-y-4">
              {Object.entries(stats.severityDistribution).map(([severity, count]) => {
                const total = stats.totalVulnerabilities;
                const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                return (
                  <div key={severity} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-24">
                      <span className={`font-semibold ${getSeverityColor(severity)}`}>
                        {severity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              severity === 'CRITICAL' ? 'bg-red-500' :
                              severity === 'HIGH' ? 'bg-orange-500' :
                              severity === 'MEDIUM' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-white font-bold">{count}</span>
                      <span className="text-gray-400 text-sm ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Priority Recommendations
            </h2>
            <p className="text-gray-400 mb-6">
              Based on the most frequent vulnerabilities found in your scans
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.slice(0, 6).map((rec, index) => (
                <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="text-sm text-gray-400">
                      Found in <span className="text-red-400 font-bold">{rec.frequency}</span> scans ({rec.percentage}%)
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    <strong className="text-cyan-400">Issue:</strong> {rec.recommendation}
                  </p>
                  <p className="text-sm text-green-400">
                    <strong>Solution:</strong> {rec.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Scans */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Scans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Vulnerabilities</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{scan.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        scan.type === 'system' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {scan.type === 'system' ? 'System' : 'Prompt'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(scan.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-red-400 font-bold">{scan.vulnerabilities}</td>
                    <td className="px-4 py-3">
                      {scan.score !== null ? (
                        <span className={`font-bold ${
                          scan.score >= 9 ? 'text-green-400' :
                          scan.score >= 7 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {scan.score}/10
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={scan.type === 'system' ? `/system-scan/${scan.id}` : `/scan-results/${scan.id}`}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
