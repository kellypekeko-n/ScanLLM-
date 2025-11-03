/**
 * Scan Details Page
 * Page pour afficher les détails d'un scan depuis l'historique
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import ScanResults from '../components/ScanResults';
import LoadingSpinner from '../components/LoadingSpinner';

const ScanDetails = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [scanData, setScanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScanDetails = async () => {
      try {
        setLoading(true);
        
        // D'abord essayer de charger depuis localStorage
        const savedScans = localStorage.getItem('scanHistory');
        if (savedScans) {
          const scans = JSON.parse(savedScans);
          const scan = scans.find(s => s.id === scanId);
          
          if (scan && scan.results) {
            setScanData({ 
              status: 'completed',
              scan_results: scan.results 
            });
            setLoading(false);
            return;
          }
        }
        
        // Sinon essayer l'API
        const data = await apiService.getScanStatus(scanId);
        
        if (data.status === 'completed' && data.scan_results) {
          setScanData(data);
        } else if (data.status === 'error') {
          setError(data.error || 'Scan failed');
        } else {
          setError('Scan not completed yet');
        }
      } catch (err) {
        console.error('Error fetching scan details:', err);
        setError(err?.response?.data?.error || err.message || 'scan_id not found');
      } finally {
        setLoading(false);
      }
    };

    if (scanId) {
      fetchScanDetails();
    }
  }, [scanId]);

  if (loading) {
    return <LoadingSpinner message="Loading scan details..." />;
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

  if (!scanData || !scanData.scan_results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-400">No scan data available</p>
            <Link to="/history" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300">
              ← Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const systemName = scanData.scan_results?.software_scan?.name || 'Unknown System';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link to="/history" className="text-gray-400 hover:text-white transition-colors">
                History
              </Link>
            </li>
            <li className="text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-white font-medium">Scan {scanId}</li>
          </ol>
        </nav>

        {/* Scan Results */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ScanResults 
            results={scanData.scan_results} 
            systemName={systemName}
            scanId={scanId}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanDetails;
