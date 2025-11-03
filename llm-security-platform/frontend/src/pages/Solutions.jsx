/**
 * Solutions Page
 * Affiche le catalogue de toutes les solutions et les détails d'une solution spécifique
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SOLUTIONS_DATABASE } from '../services/cveSolutionsService';

const Solutions = () => {
  const { vulnerabilityType } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Vue catalogue - Toutes les solutions
  if (!vulnerabilityType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Solutions Catalog</h1>
            <p className="text-gray-400">Browse all available security solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SOLUTIONS_DATABASE).map(([cweId, solution]) => (
              <Link
                key={cweId}
                to={`/solutions/${cweId}`}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{cweId}</h3>
                    <p className="text-cyan-400 font-semibold">{solution.title}</p>
                  </div>
                  <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {solution.solutions.length} implementation steps
                </p>
                <div className="flex flex-wrap gap-2">
                  {solution.prevention.slice(0, 2).map((prev, idx) => (
                    <span key={idx} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {prev.substring(0, 30)}...
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vue détaillée d'une solution spécifique
  const solution = SOLUTIONS_DATABASE[vulnerabilityType];

  if (!solution) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Solution Not Found</h2>
            <p className="text-red-400 mb-6">The solution for {vulnerabilityType} was not found.</p>
            <Link
              to="/solutions"
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 inline-block"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li>
              <Link to="/" className="hover:text-cyan-400">Home</Link>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link to="/solutions" className="hover:text-cyan-400">Solutions</Link>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white font-medium">{vulnerabilityType}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {vulnerabilityType}: {solution.title}
          </h1>
        </div>

        {/* Implementation Steps */}
        <div className="space-y-6 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Implementation Steps</h2>
          {solution.solutions.map((step, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-3">
                Step {step.step}: {step.title}
              </h3>
              <p className="text-gray-300 mb-4">{step.description}</p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Prevention Measures */}
        <div className="bg-green-900/20 border border-green-500 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Prevention Measures</h2>
          <ul className="space-y-3">
            {solution.prevention.map((measure, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{measure}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
