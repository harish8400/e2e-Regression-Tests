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

Tests are executed in 'dev' environment by default if no environment is provided, to run tests using specific environment set your ENVIRONMENT environment variable, i.e.:

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
npx playwright test --project mol_hfm_chromium
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

Following test credentials required to run tests locally:

* DLTA_JWT environment variable - admin credentials with access to perform actions (i.e. create and approve cases) in DLTA

#### MOL HFM

* MOL_USERNAME & MOL_PASSWORD envrionment variables - existing MOL user credentials (H4F only currently) with 2FA disabled 

```
docker run --rm -v ./playwright-report:/e2e/playwright-report -e ENVIRONMENT=uat -e MOL_USERNAME=$MOL_USERNAME -e MOL_PASSWORD=$MOL_PASSWORD -e DLTA_JWT=$DLTA_JWT e2e_tests --project mol_hfm_chromium
```

#### MOL VG

* OKTA_USERNAME & OKTA_PASSWORD envrionment variables - existing okta dev account creds with registered member's profile IDs set up

### TODO
[ ] new member creation and registration

[ ] investigate if POM classes should be split into 'view' and 'manage'

[ ] address various TODOs comments in code

[ ] add clear test details and steps to html report for testers

[ ] figure out if there is a better way of getting memberId from username

[ ] before test is run check/deal with cases in progress if using existing members

[ ] move environment config init to global setup?

[ ] check if can upload document in dev MOL