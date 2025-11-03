/**
 * ScanForm Component
 * Formulaire pour lancer un nouveau scan
 */

import React, { useState } from 'react';
import apiService from '../services/api';

const ScanForm = ({ onScanComplete }) => {
  const [formData, setFormData] = useState({
    systemName: '',
    prompt: '',
    endpoint: '',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    demo: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setError(null);
    
    try {
      const status = await apiService.getStatus();
      alert('Connexion reussie! Plateforme operationnelle.');
    } catch (err) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.prompt.trim()) {
        throw new Error('Le prompt est requis');
      }

      // Lancer le scan
      const result = await apiService.runScan(formData.prompt, formData.demo);
      
      // Callback avec les resultats
      if (onScanComplete) {
        onScanComplete(result, formData.systemName);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Nouveau Scan de Securite
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom du systeme */}
        <div>
          <label htmlFor="systemName" className="block text-sm font-medium text-gray-700 mb-2">
            Nom du Systeme
          </label>
          <input
            type="text"
            id="systemName"
            name="systemName"
            value={formData.systemName}
            onChange={handleChange}
            placeholder="Ex: Production Chatbot"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Prompt a tester */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt a Tester <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Ex: You are a helpful customer service assistant..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            Le prompt systeme utilise par votre LLM
          </p>
        </div>

        {/* Endpoint (optionnel) */}
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-2">
            Endpoint LLM (optionnel)
          </label>
          <input
            type="url"
            id="endpoint"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            placeholder="https://api.example.com/llm"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* API Key (optionnel) */}
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            API Key (optionnel)
          </label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            placeholder="sk-..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Modele */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            Modele LLM
          </label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-2">Claude 2</option>
            <option value="claude-3">Claude 3</option>
            <option value="llama-2">Llama 2</option>
            <option value="mistral">Mistral</option>
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Mode demo */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="demo"
            name="demo"
            checked={formData.demo}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="demo" className="ml-2 block text-sm text-gray-700">
            Mode Demo 
          </label>
        </div>

        {/* Boutons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingConnection ? 'Test en cours...' : 'Tester la Connexion'}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scan en cours...
              </span>
            ) : (
              'Lancer le Scan'
            )}
          </button>
        </div>
      </form>

      {/* Informations */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Informations
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Le scan execute 7 tests de securite</li>
          <li>• Duree estimee: 30-60 secondes (mode reel)</li>
          <li>• Duree estimee: 8-10 secondes (mode demo)</li>
          <li>• Vos donnees ne sont pas stockees</li>
        </ul>
      </div>
    </div>
  );
};

export default ScanForm;
