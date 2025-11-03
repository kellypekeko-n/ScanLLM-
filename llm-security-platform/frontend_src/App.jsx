/**
 * App Component
 * Composant principal de l'application
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewScan from './pages/NewScan';
import Solutions from './pages/Solutions';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<NewScan />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:vulnerabilityType" element={<Solutions />} />
            <Route path="/dashboard" element={<div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold">Dashboard </h1></div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">
                  © 2025 LLM Security Platform. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <a href="https://github.com/kellypekeko-n/ScanLLM-" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600">
                  GitHub
                </a>
                <a href="/api/status" target="_blank" className="text-gray-600 hover:text-primary-600">
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
