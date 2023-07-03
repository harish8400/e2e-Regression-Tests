# E2E Regression Tests

End to end Playwright monorepo containing e2e tests for various online portals (AOL, MOL, Adviser Online)

## Installation
Install NPM packages
```
npm install 
```

Install Playwright browsers
```
npx playwright install
```

## Usage

Tests are execute in 'poc' environment by default if no environment is provided, to run tests using specific environment set your ENVIRONMENT environment variable, i.e.:

```
export ENVIRONMENT=dev
```

Run all tests
```
npx playwright test
```

Run specific tagged test/group
```
npx playwright test --grep @adviser_online
````

## Test results
Test results can be found in ./playwright-report folder after test run

## Docker
[ ] TODO: add another Dockefile for non-arm processors

Buld image
```
docker build -t e2e_tests .  
```

Execute tests
```
docker run --rm -v ./playwright-report:/e2e/playwright-report -e ENVIRONMENT=poc e2e_tests --grep @adviser_online
```

## Credentials

Following test credentials required to run tests:

### MOL

* DLTA_JWT environment variable - admin credentials with access to perform actions (i.e. create and approve cases) in DLTA
* MOL_USERNAME & MOL_PASSWORD envrionment variables - existing MOL user credentials (H4F only currently) with 2FA disabled 