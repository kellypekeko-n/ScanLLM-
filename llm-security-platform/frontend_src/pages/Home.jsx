/**
 * Home Page
 * Page d'accueil de la plateforme
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [platformInfo, setPlatformInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [softwareName, setSoftwareName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [scanId, setScanId] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  useEffect(() => {
    const fetchPlatformInfo = async () => {
      try {
        const info = await apiService.getHomeInfo();
        setPlatformInfo(info);
      } catch (error) {
        console.error('Error fetching platform info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformInfo();
  }, []);

  const startSoftwareScan = async (e) => {
    e.preventDefault();
    setScanError(null);
    setScanData(null);
    if (!softwareName) {
      setScanError("Le nom du système est requis");
      return;
    }
    setScanning(true);
    try {
      const resp = await apiService.runSoftwareScan({ name: softwareName, base_url: baseUrl });
      if (resp && resp.scan_id) {
        setScanId(resp.scan_id);
        // Polling
        let attempts = 0;
        const maxAttempts = 40; // ~2 minutes si 3s intervalle
        const wait = (ms) => new Promise((res) => setTimeout(res, ms));
        while (attempts < maxAttempts) {
          await wait(3000);
          const status = await apiService.getScanStatus(resp.scan_id);
          if (status.status === 'completed' || status.status === 'error') {
            setScanData(status);
            break;
          }
          attempts += 1;
        }
        if (attempts >= maxAttempts) {
          setScanError("Le scan prend plus de temps que prévu. Réessayez plus tard.");
        }
      } else {
        setScanError("Réponse invalide du serveur");
      }
    } catch (err) {
      setScanError(err?.response?.data?.error || err.message || 'Erreur lors du lancement du scan');
    } finally {
      setScanning(false);
    }
  };

  const downloadCsv = async () => {
    if (!scanData?.scan_results) return;
    try {
      const resp = await apiService.exportCsv(
        scanData.scan_results,
        scanData?.scan_results?.software_scan?.name || softwareName || 'Unknown System',
        scanId
      );
      const blob = new Blob([resp.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan_report_${scanId || 'latest'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erreur export CSV:', e);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement de la plateforme..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          LLM Security Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Scannez, surveillez et securisez vos systemes utilisant des LLM
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/scan"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Commencer un Scan
          </Link>
          <Link
            to="/solutions"
            className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 font-medium text-lg transition-all"
          >
            Voir les Solutions
          </Link>
        </div>

      {/* Modes de test */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Tester un prompt */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tester un Prompt</h3>
          <p className="text-gray-600 mb-4">Soumettez un system prompt et lancez les 7 tests de sécurité.</p>
          <Link
            to="/scan"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow"
          >
            Aller au test de prompt
          </Link>
        </div>

        {/* Scanner un système */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Scanner un Système </h3>
          <p className="text-gray-600 mb-4">Entrez le nom du système et (optionnel) l’endpoint. Le scan est asynchrone.</p>
          <form onSubmit={startSoftwareScan} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nom du Système</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                placeholder="Ex: Production Chatbot"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Endpoint</label>
              <input
                type="url"
                className="w-full border rounded-lg px-3 py-2"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>
            {scanError && <div className="text-red-600 text-sm">{scanError}</div>}
            <button
              type="submit"
              disabled={scanning}
              className={`px-6 py-3 rounded-lg text-white font-medium shadow ${scanning ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {scanning ? 'Scan en cours...' : 'Lancer le Scan'}
            </button>
          </form>

          {/* Résumé résultats */}
          {scanData && scanData.status === 'completed' && (
            <div className="mt-6 border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-2">Résultats</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Scan ID: <span className="font-mono">{scanId}</span></div>
                <div>Nom: {scanData?.scan_results?.software_scan?.name || softwareName}</div>
                <div>Tests: {scanData?.scan_results ? Object.keys(scanData.scan_results).length : 0}</div>
              </div>
              <div className="mt-3">
                <button onClick={downloadCsv} className="px-4 py-2 border rounded-lg text-primary-600 border-primary-600 hover:bg-primary-50">
                  Télécharger le CSV
                </button>
              </div>
            </div>
          )}

          {scanData && scanData.status === 'error' && (
            <div className="mt-6 text-red-600">Erreur: {scanData.error}</div>
          )}
        </div>
      </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            7 Tests de Securite
          </h3>
          <p className="text-gray-600">
            Prompt Injection, Safety Bypass, Data Leakage, Role Sensitivity, RAG Audit, Structural Probe, Fingerprinting
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Solutions avec Code
          </h3>
          <p className="text-gray-600">
            Code Python pret a l'emploi pour corriger chaque vulnerabilite detectee
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Mapping NIST/CVE/OWASP
          </h3>
          <p className="text-gray-600">
            References vers NIST AI RMF, CVE database et OWASP Top 10 for LLM
          </p>
        </div>
      </div>

      {/* Platform Info */}
      {platformInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Informations de la Plateforme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Version</p>
              <p className="text-lg font-medium text-gray-900">{platformInfo.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-medium text-success-600">{platformInfo.status}</p>
            </div>
          </div>

          {platformInfo.features && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Fonctionnalites:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {platformInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-success-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Comment ca Fonctionne?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Entrez votre Prompt</h3>
            <p className="text-gray-600 text-sm">
              Saisissez le system prompt de votre LLM
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Scan Automatique</h3>
            <p className="text-gray-600 text-sm">
              7 tests de securite executes en 30-60 secondes
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Resultats Detailles</h3>
            <p className="text-gray-600 text-sm">
              Score, vulnerabilites et recommandations
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Solutions Pretes</h3>
            <p className="text-gray-600 text-sm">
              Code Python pour corriger chaque probleme
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center bg-primary-600 rounded-lg p-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Pret a Securiser votre LLM?
        </h2>
        <p className="text-xl text-primary-100 mb-8">
          Lancez votre premier scan gratuitement
        </p>
        <Link
          to="/scan"
          className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 font-medium text-lg shadow-lg"
        >
          Commencer Maintenant
        </Link>
      </div>
    </div>
  );
};

export default Home;
