/**
 * SolutionCard Component
 * Carte pour afficher une solution
 */

import React, { useState } from 'react';

const SolutionCard = ({ solution, index }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(solution.code_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-success-100 text-success-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'hard':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-primary-600 font-bold">{index + 1}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {solution.title}
            </h3>
            <p className="text-sm text-gray-500">ID: {solution.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(solution.difficulty)}`}>
          {solution.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">
        {solution.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{solution.implementation_time}</span>
        </div>
      </div>

      {/* Code snippet */}
      {solution.code_snippet && (
        <div className="mb-4">
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm mb-2"
          >
            {showCode ? (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Masquer le code
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Voir le code
              </>
            )}
          </button>

          {showCode && (
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{solution.code_snippet}</code>
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
              >
                {copied ? 'Copie!' : 'Copier'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {solution.references && solution.references.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">References:</p>
          <ul className="space-y-1">
            {solution.references.map((ref, idx) => (
              <li key={idx}>
                <a
                  href={ref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SolutionCard;
