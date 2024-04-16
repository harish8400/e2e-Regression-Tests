#!/bin/bash
set -e

#cd portal

BASEDIR=$(dirname "$0")

npx playwright install && npx playwright install-deps && apt-get install -y allure

echo "NPM Install"
npm ci

echo "Running Pension tests"
npm run test:pension