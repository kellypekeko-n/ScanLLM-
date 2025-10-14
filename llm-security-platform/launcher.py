#!/usr/bin/env python3
"""
LLM Security Platform - Lanceur principal
"""

import sys
import os
from pathlib import Path

# Ajout des chemins
sys.path.append(str(Path(__file__).parent / "orchestrator"))
sys.path.append(str(Path(__file__).parent / "analyzer"))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python launcher.py <command>")
        print("Commands: demo, test, analyze")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "demo":
        import demo
        demo.main()
    elif command == "test":
        import test_platform
        test_platform.main()
    elif command == "analyze":
        print("Analyze command - À implémenter")
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
