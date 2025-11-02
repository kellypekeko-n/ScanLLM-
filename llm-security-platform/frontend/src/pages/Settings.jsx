/**
 * Settings Page
 */

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [saved, setSaved] = useState(false);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            {t('settingsTitle')}
          </h1>

          <div className="space-y-6">
            {/* Language Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('language')}
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* Theme Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('theme')}
              </label>
              <select
                value={theme}
                onChange={handleThemeChange}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              >
                <option value="dark">Dark</option>
                <option value="light">Light (Coming Soon)</option>
              </select>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('colorScheme')}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 bg-cyan-500/20 border-2 border-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-colors">
                  <div className="w-full h-8 bg-cyan-500 rounded mb-2"></div>
                  <span className="text-white text-sm">Cyan (Active)</span>
                </button>
                <button className="p-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="w-full h-8 bg-blue-500 rounded mb-2"></div>
                  <span className="text-gray-400 text-sm">Blue</span>
                </button>
                <button className="p-4 bg-gray-700/50 border-2 border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                  <div className="w-full h-8 bg-purple-500 rounded mb-2"></div>
                  <span className="text-gray-400 text-sm">Purple</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                {saved ? '✓ Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t('contact')}
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="font-semibold text-white">Email:</span>{' '}
              <a href="mailto:support@llmsecurity.com" className="text-cyan-400 hover:text-cyan-300">
                support@llmsecurity.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-white">GitHub:</span>{' '}
              <a href="https://github.com/kellypekeko-n/ScanLLM-" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                kellypekeko-n/ScanLLM-
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
