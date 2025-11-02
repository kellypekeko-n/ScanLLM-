/**
 * API Service
 * Service pour communiquer avec le backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://llm-security-plateform.azurewebsites.net';

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gerer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur du serveur
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Pas de reponse du serveur
      console.error('Network Error:', error.request);
    } else {
      // Autre erreur
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API Methods
 */

export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Get platform status
  async getStatus() {
    const response = await api.get('/api/status');
    return response.data;
  },

  // List available tests
  async listTests() {
    const response = await api.get('/api/tests');
    return response.data;
  },

  // Run security scan
  async runScan(prompt, demo = false) {
    const response = await api.post('/api/scan', {
      prompt,
      demo,
    });
    return response.data;
  },

  // List all solutions
  async listSolutions() {
    const response = await api.get('/api/solutions');
    return response.data;
  },

  // Get solutions for a specific vulnerability type
  async getSolutions(vulnerabilityType) {
    const response = await api.get(`/api/solutions/${vulnerabilityType}`);
    return response.data;
  },

  // Get home page info
  async getHomeInfo() {
    const response = await api.get('/');
    return response.data;
  },

  // Export scan results to CSV
  async exportCsv(scanResults, systemName = 'Unknown System', scanId = null) {
    const response = await api.post(
      '/api/export/csv',
      {
        scan_results: scanResults,
        system_name: systemName,
        scan_id: scanId,
      },
      { responseType: 'blob' }
    );
    return response;
  },

  // Run software scan (async) - POST /api/scan/software
  async runSoftwareScan(payload) {
    const response = await api.post('/api/scan/software', payload);
    return response.data;
  },

  // Get scan status/results - GET /api/scan/<scan_id>
  async getScanStatus(scanId) {
    const response = await api.get(`/api/scan/${scanId}`);
    return response.data;
  },
};

export default apiService;
