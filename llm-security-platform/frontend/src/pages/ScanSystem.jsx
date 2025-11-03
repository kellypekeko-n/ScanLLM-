/**
 * Scan System Page
 * Detailed form for system scanning
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { scanSystem } from '../services/systemScanService';
import SystemScanResults from '../components/SystemScanResults';

const ScanSystem = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    model: '',
    apiKey: '',
  });
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [scanResults, setScanResults] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name) {
      setError(t('error') + ': ' + t('systemName') + ' is required');
      return;
    }

    setScanning(true);
    try {
      // Lancer le scan système (Trivy-style)
      const result = await scanSystem({
        name: formData.name,
        base_url: formData.endpoint,
        model: formData.model,
        api_key: formData.apiKey,
      });
      
      // Afficher les résultats
      setScanResults(result);
      
      // Sauvegarder dans l'historique
      const scanEntry = {
        id: result.scan_id,
        name: result.system_name,
        endpoint: result.endpoint,
        model: result.model,
        date: result.scan_date,
        status: 'completed',
        type: 'system',
        vulnerabilities: result.summary.total_vulnerabilities,
        results: result,
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      existingHistory.unshift(scanEntry);
      
      if (existingHistory.length > 50) {
        existingHistory.pop();
      }
      
      localStorage.setItem('scanHistory', JSON.stringify(existingHistory));
      
      // Scroll vers les résultats
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Error launching scan');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Résultats du scan (si disponibles) */}
        {scanResults && (
          <div className="mb-8">
            <SystemScanResults results={scanResults} />
          </div>
        )}

        {/* Formulaire de scan (caché si résultats affichés) */}
        {!scanResults && (
        <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('scanSystemTitle')}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('scanSystemDesc')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* System Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('systemName')} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('systemNamePlaceholder')}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Endpoint */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('endpoint')}
              </label>
              <input
                type="url"
                name="endpoint"
                value={formData.endpoint}
                onChange={handleChange}
                placeholder={t('endpointPlaceholder')}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Model (optional)
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., gpt-3.5-turbo"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                API Key (optional)
              </label>
              <input
                type="password"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                placeholder="sk-..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={scanning}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                  scanning
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 shadow-lg hover:shadow-cyan-500/50'
                }`}
              >
                {scanning ? t('scanning') : t('launchScan')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ScanSystem;
