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

Tests are execute in 'dev' environment by default if no environment is provided, to run tests using specific environment set your ENVIRONMENT environment variable, i.e.:

```
export ENVIRONMENT=uat
```

Run all tests
```
npx playwright test
```

Run specific tagged test/group
```
npx playwright test --grep @adviser_online
```

or project
```
npx playwright test --project "MOL logged in - chromium"
```

## Test results
Test results can be found in ./playwright-report folder after test run

## Docker

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


### TODO
[ ] add another Dockefile for non-arm processors

[ ] investigate if POM classes should be split into 'view' and 'manage'

[ ] address various TODOs comments in code

[ ] investigate if types (i.e. ./types.ts) should be split and kepts closer to where used

[ ] split tests (incl. fixtures?) by funds?

[ ] add clear test details and steps to html report for testers

[ ] figure out if there is a better way of getting memberId from username

[ ] before test is run check/deal with cases in progress if using existing members

[ ] move environment config init to global setup?
