/**
 * NewScan Page
 * Page pour lancer un nouveau scan
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScanForm from '../components/ScanForm';
import ScanResults from '../components/ScanResults';

const NewScan = () => {
  const [scanResults, setScanResults] = useState(null);
  const [systemName, setSystemName] = useState('');
  const navigate = useNavigate();

  const handleScanComplete = (results, name) => {
    setScanResults(results);
    setSystemName(name);
    
    // Scroll vers les resultats
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <li className="text-gray-900 font-medium">Nouveau Scan</li>
        </ol>
      </nav>

      {/* Resultats (si disponibles) */}
      {scanResults && (
        <div className="mb-8">
          <ScanResults results={scanResults} systemName={systemName} />
        </div>
      )}

      {/* Formulaire de scan */}
      {!scanResults && (
        <ScanForm onScanComplete={handleScanComplete} />
      )}

      {/* Bouton pour nouveau scan si resultats affiches */}
      {scanResults && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setScanResults(null)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Lancer un Nouveau Scan
          </button>
        </div>
      )}
    </div>
  );
};

export default NewScan;
