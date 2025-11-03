/**
 * App Component
 * Composant principal de l'application
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavbarNew';
import Home from './pages/HomeNew';
import NewScan from './pages/NewScan';
import Solutions from './pages/Solutions';
import ScanSystem from './pages/ScanSystem';
import About from './pages/About';
import Settings from './pages/Settings';
import History from './pages/History';
import ScanDetails from './pages/ScanDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<NewScan />} />
            <Route path="/scan-system" element={<ScanSystem />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:vulnerabilityType" element={<Solutions />} />
            <Route path="/history" element={<History />} />
            <Route path="/scan-results/:scanId" element={<ScanDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/dashboard" element={<div className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 min-h-screen"><h1 className="text-3xl font-bold text-white">Dashboard (Coming Soon)</h1></div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400">
                  © 2025 LLM Security Platform. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="https://github.com/kellypekeko-n/ScanLLM-" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  GitHub
                </a>
                <a href="/api/status" target="_blank" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  API Status
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
