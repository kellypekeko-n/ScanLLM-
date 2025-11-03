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
                  <li>Fill in all required fields (marked with *)</li>
                  <li>Click "Launch Scan"</li>
                  <li>Wait for CVE analysis (3-5 seconds)</li>
                  <li>Download results as JSON or CSV</li>
                </ol>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">📋 Field Validation Requirements</h3>
                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">System Name *</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Length:</strong> 3-50 characters</li>
                      <li><strong>Allowed:</strong> Letters, Numbers, Spaces, Hyphens, Underscores</li>
                      <li><strong>Valid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>✅ My LLM System</li>
                        <li>✅ ChatBot-v2</li>
                        <li>✅ AI_Assistant_2024</li>
                      </ul>
                      <li><strong>Invalid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>❌ AB (too short)</li>
                        <li>❌ System@123 (special character)</li>
                      </ul>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">Endpoint *</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Format:</strong> Valid URL</li>
                      <li><strong>Required:</strong> Must start with http:// or https://</li>
                      <li><strong>Valid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>✅ https://api.openai.com</li>
                        <li>✅ http://localhost:8000</li>
                        <li>✅ https://api.example.com/v1</li>
                      </ul>
                      <li><strong>Invalid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>❌ api.openai.com (missing protocol)</li>
                        <li>❌ ftp://api.com (wrong protocol)</li>
                      </ul>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">Model *</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Length:</strong> 3-50 characters</li>
                      <li><strong>Allowed:</strong> Letters, Numbers, Hyphens, Dots</li>
                      <li><strong>Valid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>✅ gpt-3.5-turbo</li>
                        <li>✅ gpt-4</li>
                        <li>✅ claude-2.1</li>
                        <li>✅ llama-2-70b</li>
                      </ul>
                      <li><strong>Invalid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>❌ gp (too short)</li>
                        <li>❌ model_name (underscore not allowed)</li>
                      </ul>
                    </ul>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-cyan-400 mb-2">API Key *</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Format:</strong> OpenAI API Key format</li>
                      <li><strong>Required:</strong> Must start with "sk-"</li>
                      <li><strong>Length:</strong> At least 20 characters after "sk-"</li>
                      <li><strong>Allowed:</strong> Letters and Numbers only</li>
                      <li><strong>Valid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>✅ sk-abcdefghijklmnopqrstuvwxyz123456</li>
                        <li>✅ sk-1234567890abcdefghijklmnopqrst</li>
                      </ul>
                      <li><strong>Invalid Examples:</strong></li>
                      <ul className="ml-6 mt-1 space-y-1">
                        <li>❌ abcdefghijk (missing "sk-")</li>
                        <li>❌ sk-abc123 (too short)</li>
                      </ul>
                      <li><strong>⚠️ Security:</strong> Never share your API key publicly</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">🔍 Understanding Scan Types</h3>
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-400 mb-2">💬 Test a Prompt</h4>
                    <p className="text-sm mb-2">Tests a single prompt against 7 security checks:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                      <li>Prompt Injection Detection</li>
                      <li>Jailbreak Attempts</li>
                      <li>Toxicity Analysis</li>
                      <li>PII Leakage Detection</li>
                      <li>Hallucination Detection</li>
                      <li>Safety Bypass Attempts</li>
                      <li>Structural Probing</li>
                    </ul>
                    <p className="text-sm mt-2"><strong>Output:</strong> Security score /10, vulnerabilities, recommendations, NIST/OWASP compliance</p>
                    <p className="text-sm"><strong>Export:</strong> CSV, PDF</p>
                  </div>

                  <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-400 mb-2">🖥️ Scan a System</h4>
                    <p className="text-sm mb-2">Scans an entire system and generates CVE report:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                      <li>CVE Detection (Critical, High, Medium, Low)</li>
                      <li>CVSS Scoring</li>
                      <li>Affected Components</li>
                      <li>Fixed Versions</li>
                      <li>CWE Mapping</li>
                      <li>NVD References</li>
                    </ul>
                    <p className="text-sm mt-2"><strong>Output:</strong> List of CVE with detailed information</p>
                    <p className="text-sm"><strong>Export:</strong> JSON, CSV</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">📊 History & Results</h3>
                <p className="mb-2">All scans are saved locally in your browser:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Prompts Testés:</strong> View all prompt security scans</li>
                  <li><strong>Scans Système:</strong> View all system CVE scans</li>
                  <li><strong>Click on system name:</strong> View full scan details</li>
                  <li><strong>Refresh:</strong> Reload history from localStorage</li>
                  <li><strong>Clear All:</strong> Delete all scan history (cannot be undone)</li>
                  <li><strong>Limit:</strong> Maximum 50 scans stored</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">🔒 Security Best Practices</h3>
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li><strong>API Keys:</strong> Never commit API keys to version control</li>
                    <li><strong>Environment Variables:</strong> Store sensitive data in .env files</li>
                    <li><strong>HTTPS Only:</strong> Always use HTTPS endpoints in production</li>
                    <li><strong>Rate Limiting:</strong> Implement rate limiting on your APIs</li>
                    <li><strong>Input Validation:</strong> Always validate and sanitize user inputs</li>
                    <li><strong>Regular Scans:</strong> Run security scans regularly (weekly/monthly)</li>
                    <li><strong>Update Dependencies:</strong> Keep all dependencies up to date</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">❓ Common Validation Errors</h3>
                <div className="space-y-3">
                  <div className="bg-gray-900/50 border-l-4 border-red-500 p-3">
                    <p className="font-semibold text-red-400 text-sm">"System Name: 3-50 characters..."</p>
                    <p className="text-xs mt-1">Your system name contains invalid characters or is too short/long. Use only letters, numbers, spaces, hyphens, and underscores.</p>
                  </div>
                  <div className="bg-gray-900/50 border-l-4 border-red-500 p-3">
                    <p className="font-semibold text-red-400 text-sm">"Endpoint: Must be a valid URL..."</p>
                    <p className="text-xs mt-1">Your endpoint URL is invalid. Make sure it starts with http:// or https:// and is properly formatted.</p>
                  </div>
                  <div className="bg-gray-900/50 border-l-4 border-red-500 p-3">
                    <p className="font-semibold text-red-400 text-sm">"API Key: Must start with 'sk-'..."</p>
                    <p className="text-xs mt-1">Your API key doesn't match the OpenAI format. It should start with "sk-" followed by at least 20 alphanumeric characters.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-white mb-3">📞 Support & Resources</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>GitHub:</strong> <a href="https://github.com/kellypekeko-n/ScanLLM-" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">kellypekeko-n/ScanLLM-</a></li>
                  <li><strong>OWASP Top 10 for LLM:</strong> <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">owasp.org</a></li>
                  <li><strong>NIST AI RMF:</strong> <a href="https://www.nist.gov/itl/ai-risk-management-framework" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">nist.gov</a></li>
                  <li><strong>NVD (CVE Database):</strong> <a href="https://nvd.nist.gov/" className="text-cyan-400 hover:text-cyan-300 underline" target="_blank" rel="noopener noreferrer">nvd.nist.gov</a></li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
