/**
 * About Page - User Guide
 */

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            {t('aboutTitle')}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {t('userGuide')}
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
                <p className="mb-2">
                  The LLM Security Platform helps you identify vulnerabilities in your LLM systems through comprehensive security testing.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Test individual prompts for security issues</li>
                  <li>Scan entire systems for vulnerabilities</li>
                  <li>Get detailed reports with remediation steps</li>
                  <li>Export results to CSV for compliance</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">How to Test a Prompt</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Click "Test a Prompt" from the home page</li>
                  <li>Enter your system prompt</li>
                  <li>Click "Run Scan"</li>
                  <li>Wait for results (30-60 seconds)</li>
                  <li>Review vulnerabilities and solutions</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">How to Scan a System</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Click "Scan a System" from the home page</li>
                  <li>Fill in system details (name, endpoint, model)</li>
                  <li>Click "Launch Scan"</li>
                  <li>Monitor scan progress</li>
                  <li>Download CSV report when complete</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Security Tests</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-cyan-400">Prompt Injection</h4>
                    <p>Tests if malicious prompts can override system instructions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Safety Bypass</h4>
                    <p>Checks if safety guardrails can be circumvented</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Data Leakage</h4>
                    <p>Identifies potential sensitive information disclosure</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Role Sensitivity</h4>
                    <p>Tests role-based access control vulnerabilities</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">RAG Audit</h4>
                    <p>Evaluates retrieval-augmented generation security</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Structural Probe</h4>
                    <p>Analyzes system architecture for weaknesses</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-400">Fingerprinting</h4>
                    <p>Detects model identification vulnerabilities</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">Support</h3>
                <p>
                  For questions or issues, please visit our{' '}
                  <a href="https://github.com/kellypekeko-n/ScanLLM-" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    GitHub repository
                  </a>{' '}
                  or contact us through the Contact page.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
