/**
 * Solutions Page
 * Page pour afficher les solutions disponibles
 */

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SolutionCard from '../components/SolutionCard';

const Solutions = () => {
  const { vulnerabilityType } = useParams();
  const location = useLocation();
  const vulnerability = location.state?.vulnerability;

  const [solutionData, setSolutionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (vulnerabilityType) {
          // Charger les solutions pour un type specifique
          const data = await apiService.getSolutions(vulnerabilityType);
          setSolutionData(data);
        } else {
          // Charger toutes les solutions
          const data = await apiService.listSolutions();
          setSolutionData(data);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, [vulnerabilityType]);

  if (loading) {
    return <LoadingSpinner message="Chargement des solutions..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
          <p className="text-danger-700">{error}</p>
        </div>
      </div>
    );
  }

  // Vue detaillee d'une vulnerabilite specifique
  if (vulnerabilityType && solutionData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <a href="/" className="hover:text-primary-600">Accueil</a>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <a href="/solutions" className="hover:text-primary-600">Solutions</a>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{solutionData.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {solutionData.name}
              </h1>
              <p className="text-gray-600">{solutionData.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              solutionData.severity === 'Critical' ? 'bg-danger-100 text-danger-800' :
              solutionData.severity === 'High' ? 'bg-danger-100 text-danger-800' :
              solutionData.severity === 'Medium' ? 'bg-warning-100 text-warning-800' :
              'bg-success-100 text-success-800'
            }`}>
              {solutionData.severity}
            </span>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">CWE</p>
              <p className="font-medium text-gray-900">{solutionData.cwe}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">OWASP</p>
              <p className="font-medium text-gray-900">{solutionData.owasp}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">NIST AI RMF</p>
              <p className="font-medium text-gray-900">{solutionData.nist_ai_rmf}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">NIST CSF</p>
              <p className="font-medium text-gray-900">{solutionData.nist_csf}</p>
            </div>
          </div>

          {/* Impact */}
          {solutionData.impact && solutionData.impact.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Impact Potentiel</h3>
              <ul className="space-y-2">
                {solutionData.impact.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-danger-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prevention Checklist */}
          {solutionData.prevention_checklist && solutionData.prevention_checklist.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Checklist de Prevention</h3>
              <ul className="space-y-2">
                {solutionData.prevention_checklist.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-success-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Solutions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Solutions Recommandees ({solutionData.solutions?.length || 0})
          </h2>
          <div className="space-y-6">
            {solutionData.solutions?.map((solution, index) => (
              <SolutionCard key={solution.id} solution={solution} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vue liste de toutes les solutions
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Solutions Disponibles
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(solutionData || {}).map(([type, data]) => (
          <a
            key={type}
            href={`/solutions/${type}`}
            className="block bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {data.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                data.severity === 'Critical' ? 'bg-danger-100 text-danger-800' :
                data.severity === 'High' ? 'bg-danger-100 text-danger-800' :
                data.severity === 'Medium' ? 'bg-warning-100 text-warning-800' :
                'bg-success-100 text-success-800'
              }`}>
                {data.severity}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">CWE:</span>
                <span>{data.cwe}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">OWASP:</span>
                <span>{data.owasp}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Solutions:</span>
                <span>{data.solutions_count}</span>
              </div>
            </div>

            <div className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              Voir les solutions
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Solutions;
