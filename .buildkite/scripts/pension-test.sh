# #!/bin/bash
# set -e

# #cd portal

# BASEDIR=$(dirname "$0")

# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# brew install allure

# allure --version

# npx playwright install && npm i -D @playwright/test allure-playwright

# echo "NPM Install"
# npm ci

# echo "Running Pension tests"
# npm run test:pension

#!/usr/bin/env bash
set -e

BASEDIR=$(dirname "$0")

echo "NPM Install"
npm ci

echo "Running CI tests"
npm run ci:e2e-test:pension
