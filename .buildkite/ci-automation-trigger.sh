#!/usr/bin/env bash
set -euo pipefail

ACCOUNT_GROUP=$(buildkite-agent meta-data get "account_group")
ENV=$(buildkite-agent meta-data get "env")
AGENTS_QUEUE="$ACCOUNT_GROUP-terraform"

[[ -z "$ACCOUNT_GROUP" ]] && { echo "agents-queue build metadata is empty" ; exit 1; }
[[ -z "$ENV" ]] && { echo "agents-queue build metadata is empty" ; exit 1; }

PIPELINE=""

# CI Environment variables pass in via docker compose
PIPELINE+=$(cat <<EOF
agents:
  queue: "$AGENTS_QUEUE"

steps:
    - label: ':test_tube: Playwright test'
      command: '.buildkite/scripts/test.sh'
      artifact_paths:
          - 'allure-report/**/*'
          - 'allure-results/**/*'
          - 'playwright-report/**/*'
          - 'test-results/**/*'
      plugins:
          - docker-compose#v4.14.0:
                run: e2e_tests
                config:
                    - ./buildkite.docker-compose.yml
                mount-checkout: true
                volumes:
                    - './allure-report:/workdir/allure-report'
                    - './allure-results:/workdir/allure-results'
                    - './playwright-report:/workdir/playwright-report'
                    - './test-results:/workdir/test-results'
                env:
                    - ENVIRONMENT=$ENV
          - test-collector#v1.0.0:
                files: 'test-results/junit.xml'
                format: 'junit'
EOF
)

echo -e "$PIPELINE" | buildkite-signed-pipeline upload
