#!/usr/bin/env bash
set -e

# WORNG PDF AI Resume Builder - GitHub Push Script
# Target Repository: https://github.com/jake2025omar/worng-pdf-ai-builder

REPO_OWNER="${2:-jake2025omar-pixel}"
REPO_NAME="${3:-worng-pdf}"

TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "========================================================"
  echo "WORNG PDF AI Resume Builder - GitHub Push"
  echo "========================================================"
  echo "Usage: bash scripts/push-to-github.sh <TOKEN> [REPO_OWNER] [REPO_NAME]"
  echo "Example:"
  echo "  bash scripts/push-to-github.sh ghp_YOUR_TOKEN jake2025omar-pixel worng-pdf"
  echo "========================================================"
  exit 1
fi

echo "Configuring remote for https://github.com/${REPO_OWNER}/${REPO_NAME}.git..."
git remote set-url origin "https://${TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo "Pushing branch 'main'..."
git push -u origin main

# Reset remote URL to remove token from config
git remote set-url origin "https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo ""
echo " Successfully pushed to https://github.com/${REPO_OWNER}/${REPO_NAME}!"
echo "GitHub Actions workflow will automatically build and deploy to GitHub Pages."
