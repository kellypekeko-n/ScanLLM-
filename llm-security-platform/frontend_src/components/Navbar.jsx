/**
 * Navbar Component
 * Barre de navigation principale
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass = "px-4 py-2 rounded-lg transition-colors duration-200";
    return isActive(path)
      ? `${baseClass} bg-primary-600 text-white`
      : `${baseClass} text-gray-700 hover:bg-primary-50`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">LLM Security Platform</h1>
                <p className="text-xs text-gray-500">Scan & Monitor LLM Systems</p>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            <Link to="/" className={navLinkClass('/')}>
              Accueil
            </Link>
            <Link to="/scan" className={navLinkClass('/scan')}>
              Nouveau Scan
            </Link>
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/solutions" className={navLinkClass('/solutions')}>
              Solutions
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
