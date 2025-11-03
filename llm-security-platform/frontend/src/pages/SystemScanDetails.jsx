/**
 * System Scan Details Page
 * Page pour afficher les détails d'un scan système depuis l'historique
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SystemScanResults from '../components/SystemScanResults';
import LoadingSpinner from '../components/LoadingSpinner';

const SystemScanDetails = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScanDetails = () => {
      try {
        setLoading(true);
        
        console.log('Looking for scan ID:', scanId);
        
        // Charger depuis localStorage
        const savedScans = localStorage.getItem('scanHistory');
        if (savedScans) {
          const scans = JSON.parse(savedScans);
          console.log('All scans:', scans);
          
          // Chercher le scan (comparer en string pour éviter les problèmes de type)
          const scan = scans.find(s => String(s.id) === String(scanId));
          
          console.log('Found scan:', scan);
          
          if (scan && scan.type === 'system' && scan.results) {
            console.log('Scan results:', scan.results);
            setScanData(scan.results);
            setLoading(false);
            return;
          } else if (scan && scan.type !== 'system') {
            setError('This is not a system scan. Please use the correct scan details page.');
            setLoading(false);
            return;
          }
        }
        
        setError('System scan not found in history');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching system scan details:', err);
        setError(err.message || 'Error loading scan');
        setLoading(false);
      }
    };

    if (scanId) {
      fetchScanDetails();
    }
  }, [scanId]);

  if (loading) {
    return <LoadingSpinner message="Loading system scan details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Scan</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/history')}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to History
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scanData) {
    console.log('No scan data available');
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-400">No scan data available</p>
            <button
              onClick={() => navigate('/history')}
              className="mt-4 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400"
            >
              Back to History
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering SystemScanResults with data:', scanData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-cyan-400">
                Home
              </button>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <button onClick={() => navigate('/history')} className="hover:text-cyan-400">
                History
              </button>
            </li>
            <li>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white font-medium">System Scan Details</li>
          </ol>
        </nav>

        {/* Résultats */}
        <SystemScanResults results={scanData} />
      </div>
    </div>
  );
};

export default SystemScanDetails;
