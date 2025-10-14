#!/usr/bin/env python3
"""
LLM Security Platform - Setup.py
Configuration du package Python pour l'installation
"""

from setuptools import setup, find_packages
from pathlib import Path

# Lecture du README
readme_path = Path(__file__).parent / "README.md"
long_description = readme_path.read_text(encoding="utf-8") if readme_path.exists() else ""

# Lecture des requirements
def read_requirements(file_path):
    """Lit les requirements depuis un fichier"""
    requirements = []
    if Path(file_path).exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    requirements.append(line)
    return requirements

# Requirements principaux
main_requirements = [
    "aiohttp>=3.8.0",
    "pyyaml>=6.0", 
    "requests>=2.28.0",
    "colorama>=0.4.6",
    "rich>=13.0.0"
]

# Requirements optionnels
optional_requirements = {
    "analysis": [
        "matplotlib>=3.6.0",
        "seaborn>=0.12.0", 
        "pandas>=1.5.0",
        "numpy>=1.24.0"
    ],
    "dev": [
        "pytest>=7.0.0",
        "pytest-asyncio>=0.21.0",
        "black>=22.0.0",
        "flake8>=5.0.0",
        "mypy>=1.0.0"
    ],
    "security": [
        "cryptography>=3.4.8",
        "keyring>=23.0.0",
        "python-dotenv>=0.19.0"
    ]
}

# Tous les requirements optionnels
all_optional = []
for reqs in optional_requirements.values():
    all_optional.extend(reqs)

setup(
    name="llm-security-platform",
    version="1.0.0",
    author="LLM Security Team",
    author_email="security@llm-platform.com",
    description="Plateforme de cybersécurité spécialisée pour les LLM",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/llm-security/platform",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Information Technology",
        "Topic :: Security",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.10",
    install_requires=main_requirements,
    extras_require={
        "all": all_optional,
        **optional_requirements
    },
    entry_points={
        "console_scripts": [
            "llm-security=orchestrator.orchestrator:main",
            "llm-analyzer=analyzer.analyzer:main",
            "llm-demo=demo:main",
            "llm-test=test_platform:main",
            "llm-install=install:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.yaml", "*.yml", "*.json", "*.md"],
    },
    project_urls={
        "Bug Reports": "https://github.com/llm-security/platform/issues",
        "Source": "https://github.com/llm-security/platform",
        "Documentation": "https://github.com/llm-security/platform/wiki",
    },
    keywords=[
        "llm", "security", "cybersecurity", "ai", "machine-learning",
        "vulnerability", "assessment", "penetration-testing", "safety"
    ],
    zip_safe=False,
)
