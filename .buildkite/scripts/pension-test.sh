#!/bin/bash
set -e

#cd portal

BASEDIR=$(dirname "$0")

sudo dpkg -i allure_2.24.0-1_all.deb

npx playwright install && npm i -D @playwright/test allure-playwright

echo "NPM Install"
npm ci

echo "Running Pension tests"
npm run test:pension