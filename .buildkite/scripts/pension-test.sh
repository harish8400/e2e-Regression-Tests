#!/usr/bin/env bash
# set -e

#cd portal

BASEDIR=$(dirname "$0")


echo "NPM Install"
#npm ci

echo "Running Pension tests"
npm run test:pension