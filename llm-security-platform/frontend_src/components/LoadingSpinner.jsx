/**
 * LoadingSpinner Component
 * Indicateur de chargement
 */

import React from 'react';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
