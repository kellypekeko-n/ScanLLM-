/**
 * CVE Solutions Service
 * Génère des solutions spécifiques pour chaque CVE détecté
 */

// Base de solutions par type de vulnérabilité (CWE)
export const SOLUTIONS_DATABASE = {
  'CWE-20': {
    title: 'Improper Input Validation',
    solutions: [
      {
        step: 1,
        title: 'Implement Input Validation',
        description: 'Add strict validation for all user inputs before processing',
        code: `# Python Example
import re

def validate_input(user_input):
    # Whitelist approach
    pattern = r'^[a-zA-Z0-9\\s\\-_]{3,50}$'
    if not re.match(pattern, user_input):
        raise ValueError("Invalid input format")
    return user_input

# Usage
try:
    safe_input = validate_input(user_data)
except ValueError as e:
    return {"error": str(e)}`,
      },
      {
        step: 2,
        title: 'Sanitize Inputs',
        description: 'Remove or escape potentially dangerous characters',
        code: `# Python Example
import html

def sanitize_input(text):
    # HTML escape
    text = html.escape(text)
    # Remove special characters
    text = re.sub(r'[<>\"\\']', '', text)
    return text`,
      },
      {
        step: 3,
        title: 'Use Parameterized Queries',
        description: 'Prevent injection attacks with prepared statements',
        code: `# Python Example with SQLAlchemy
from sqlalchemy import text

# BAD - Vulnerable to SQL injection
query = f"SELECT * FROM users WHERE id = {user_id}"

# GOOD - Parameterized query
query = text("SELECT * FROM users WHERE id = :user_id")
result = session.execute(query, {"user_id": user_id})`,
      },
    ],
    prevention: [
      'Always validate input on the server side',
      'Use whitelist validation instead of blacklist',
      'Implement rate limiting to prevent abuse',
      'Log all validation failures for monitoring',
    ],
  },
  'CWE-79': {
    title: 'Cross-site Scripting (XSS)',
    solutions: [
      {
        step: 1,
        title: 'Output Encoding',
        description: 'Encode all user-generated content before displaying',
        code: `# Python Example with Jinja2
from jinja2 import escape

def render_user_content(content):
    # Auto-escape in template
    return f"<div>{escape(content)}</div>"

# JavaScript Example
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}`,
      },
      {
        step: 2,
        title: 'Content Security Policy (CSP)',
        description: 'Implement CSP headers to prevent XSS',
        code: `# Flask Example
from flask import Flask, make_response

@app.after_request
def set_csp(response):
    response.headers['Content-Security-Policy'] = \\
        "default-src 'self'; script-src 'self' 'unsafe-inline'"
    return response`,
      },
    ],
    prevention: [
      'Never insert untrusted data directly into HTML',
      'Use Content Security Policy headers',
      'Validate and sanitize all user inputs',
      'Use HTTPOnly and Secure flags for cookies',
    ],
  },
  'CWE-200': {
    title: 'Exposure of Sensitive Information',
    solutions: [
      {
        step: 1,
        title: 'Implement Data Masking',
        description: 'Mask sensitive information in logs and outputs',
        code: `# Python Example
import re

def mask_sensitive_data(text):
    # Mask email addresses
    text = re.sub(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', 
                  '***@***.***', text)
    # Mask credit cards
    text = re.sub(r'\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b', 
                  '****-****-****-****', text)
    # Mask API keys
    text = re.sub(r'\\b[A-Za-z0-9]{32,}\\b', '***API_KEY***', text)
    return text`,
      },
      {
        step: 2,
        title: 'Encrypt Sensitive Data',
        description: 'Encrypt data at rest and in transit',
        code: `# Python Example with cryptography
from cryptography.fernet import Fernet

# Generate key (store securely!)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt
encrypted_data = cipher.encrypt(b"sensitive data")

# Decrypt
decrypted_data = cipher.decrypt(encrypted_data)`,
      },
    ],
    prevention: [
      'Never log sensitive information',
      'Use encryption for sensitive data storage',
      'Implement proper access controls',
      'Regular security audits',
    ],
  },
  'CWE-312': {
    title: 'Cleartext Storage of Sensitive Information',
    solutions: [
      {
        step: 1,
        title: 'Use Environment Variables',
        description: 'Store sensitive config in environment variables',
        code: `# Python Example
import os
from dotenv import load_dotenv

load_dotenv()

# GOOD - From environment
API_KEY = os.getenv('API_KEY')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# BAD - Hardcoded
# API_KEY = "sk-1234567890abcdef"`,
      },
      {
        step: 2,
        title: 'Use Secret Management',
        description: 'Implement proper secret management solution',
        code: `# Python Example with HashiCorp Vault
import hvac

client = hvac.Client(url='http://localhost:8200')
client.token = os.getenv('VAULT_TOKEN')

# Read secret
secret = client.secrets.kv.v2.read_secret_version(
    path='myapp/config'
)
api_key = secret['data']['data']['api_key']`,
      },
    ],
    prevention: [
      'Never commit secrets to version control',
      'Use .gitignore for sensitive files',
      'Rotate secrets regularly',
      'Use secret management tools (Vault, AWS Secrets Manager)',
    ],
  },
  'CWE-400': {
    title: 'Uncontrolled Resource Consumption',
    solutions: [
      {
        step: 1,
        title: 'Implement Rate Limiting',
        description: 'Limit requests per user/IP',
        code: `# Python Example with Flask-Limiter
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route("/api/scan")
@limiter.limit("10 per minute")
def scan_endpoint():
    return perform_scan()`,
      },
      {
        step: 2,
        title: 'Set Resource Limits',
        description: 'Limit CPU, memory, and execution time',
        code: `# Python Example
import signal
import resource

# Set memory limit (100MB)
resource.setrlimit(resource.RLIMIT_AS, (100 * 1024 * 1024, -1))

# Set timeout
def timeout_handler(signum, frame):
    raise TimeoutError("Execution timeout")

signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(30)  # 30 seconds timeout`,
      },
    ],
    prevention: [
      'Implement rate limiting on all endpoints',
      'Set maximum request sizes',
      'Use timeouts for long-running operations',
      'Monitor resource usage',
    ],
  },
};

// Générer des solutions pour une vulnérabilité spécifique
export const getSolutionsForCVE = (cve) => {
  // Extraire le CWE du CVE
  const cweMatch = cve.cwe?.match(/CWE-(\d+)/);
  const cweId = cweMatch ? `CWE-${cweMatch[1]}` : null;

  // Chercher dans la base de solutions
  const solutionTemplate = cweId ? SOLUTIONS_DATABASE[cweId] : null;

  if (solutionTemplate) {
    return {
      cve_id: cve.cve_id,
      title: cve.title,
      severity: cve.severity,
      cwe: cve.cwe,
      solution_type: solutionTemplate.title,
      solutions: solutionTemplate.solutions,
      prevention: solutionTemplate.prevention,
      affected_component: cve.affected_component,
      fixed_version: cve.fixed_version,
    };
  }

  // Solution générique si pas de template spécifique
  return {
    cve_id: cve.cve_id,
    title: cve.title,
    severity: cve.severity,
    cwe: cve.cwe,
    solution_type: 'General Security Best Practices',
    solutions: [
      {
        step: 1,
        title: 'Update to Fixed Version',
        description: `Update ${cve.affected_component} to version ${cve.fixed_version || 'latest'}`,
        code: `# Update command
pip install --upgrade ${cve.affected_component}

# Or specify version
pip install ${cve.affected_component}==${cve.fixed_version || 'latest'}`,
      },
      {
        step: 2,
        title: 'Apply Security Patches',
        description: 'Check for and apply available security patches',
        code: `# Check for updates
pip list --outdated

# Update all packages
pip install --upgrade -r requirements.txt`,
      },
      {
        step: 3,
        title: 'Review Security Advisories',
        description: 'Check official security advisories for detailed mitigation steps',
        code: `# Resources:
# - ${cve.references?.[0] || 'https://nvd.nist.gov'}
# - OWASP Guidelines
# - Vendor Security Bulletins`,
      },
    ],
    prevention: [
      'Keep all dependencies up to date',
      'Subscribe to security mailing lists',
      'Implement automated vulnerability scanning',
      'Regular security audits',
    ],
  };
};

// Générer toutes les solutions pour un scan système
export const generateAllSolutions = (vulnerabilities) => {
  return vulnerabilities.map(vuln => getSolutionsForCVE(vuln));
};

// Exporter les solutions en format Markdown
export const exportSolutionsMarkdown = (solutions, systemName) => {
  let markdown = `# Security Solutions for ${systemName}\n\n`;
  markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
  markdown += `---\n\n`;

  solutions.forEach((solution, index) => {
    markdown += `## ${index + 1}. ${solution.cve_id}: ${solution.title}\n\n`;
    markdown += `**Severity:** ${solution.severity}  \n`;
    markdown += `**CWE:** ${solution.cwe}  \n`;
    markdown += `**Type:** ${solution.solution_type}  \n\n`;

    markdown += `### Solutions\n\n`;
    solution.solutions.forEach(sol => {
      markdown += `#### Step ${sol.step}: ${sol.title}\n\n`;
      markdown += `${sol.description}\n\n`;
      markdown += `\`\`\`python\n${sol.code}\n\`\`\`\n\n`;
    });

    markdown += `### Prevention Measures\n\n`;
    solution.prevention.forEach(prev => {
      markdown += `- ${prev}\n`;
    });
    markdown += `\n---\n\n`;
  });

  // Télécharger
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solutions_${systemName.replace(/\s+/g, '_')}_${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export default {
  getSolutionsForCVE,
  generateAllSolutions,
  exportSolutionsMarkdown,
};
