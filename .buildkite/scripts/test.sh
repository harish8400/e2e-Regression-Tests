#!/usr/bin/env bash
set -euo pipefail

echo "NPM Install"
npm ci

echo "Playwright Install"
npx playwright install --with-deps

echo "Running tests"
npx playwright test --grep @e2e_ci_test
