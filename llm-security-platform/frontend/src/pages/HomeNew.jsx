/**
 * Home Page - Minimal Trivy-style design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  // Mock user reviews
  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Security Engineer',
      company: 'TechCorp',
      text: 'This platform helped us identify critical vulnerabilities in our LLM systems. The detailed reports and Python solutions saved us weeks of work.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'AI Product Manager',
      company: 'DataFlow Inc',
      text: 'Easy to use and comprehensive. The Trivy-style scanning approach makes it familiar for our DevSecOps team.',
      rating: 5,
    },
    {
      name: 'Emma Williams',
      role: 'ML Engineer',
      company: 'CloudAI',
      text: 'The prompt injection tests are incredibly thorough. We now run scans before every deployment.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section - Trivy style */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/scan"
              className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 font-semibold text-lg shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-105"
            >
              {t('getStarted')}
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500/10 font-semibold text-lg transition-all"
            >
              {t('readDocs')}
            </Link>
          </div>
        </div>

        {/* Two Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
          {/* Test a Prompt */}
          <Link
            to="/scan"
            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {t('testPrompt')}
              </h3>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {t('testPromptDesc')}
            </p>
            <div className="mt-4 flex items-center text-cyan-400 font-medium">
              <span className="mr-2">Start testing</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>

          {/* Scan a System */}
          <Link
            to="/scan-system"
            className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {t('scanSystem')}
              </h3>
            </div>
            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
              {t('scanSystemDesc')}
            </p>
            <div className="mt-4 flex items-center text-cyan-400 font-medium">
              <span className="mr-2">Start scanning</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* User Reviews Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          {t('userReviews')}
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Les feedbacks des utilisateurs apparaîtront ici après chaque scan
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-cyan-400 font-bold text-lg">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{review.name}</h4>
                  <p className="text-gray-400 text-sm">{review.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-sm italic">"{review.text}"</p>
              <p className="text-gray-500 text-xs mt-3">— {review.company}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
