import { expect } from "@playwright/test";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { AssertionError } from "assert";

test.beforeEach(async ({ navBar }) => {
        test.setTimeout(600000);
        await navBar.selectProduct();
});

/** Ensure that comments can be added after a case is closed and user can find last updated date time on a case */
test("Verify comments update on closed cases and date time log @casemanagement", async ({ dashboardPage }) => {

    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        await dashboardPage.updateClosedCaseWithComment();
        await dashboardPage.verifyClosedCaseUpdateLog();

        console.log('Test Execution Success : Verify comments update on closed cases and date time log');
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Verifying comments update on closed cases and date time log has failed " + error });
    }
})

/** Ensure cases are correctly displayed under Closed Cases tab */
test("Ensure cases are correctly displayed under Closed Cases tab @casemanagement", async ({ dashboardPage }) => {
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        await dashboardPage.navigateToClosedCasesTab();
        await expect(dashboardPage.closedCaseManagementHeading).toContainText('Closed Cases');
        await dashboardPage.verifyCaseManagementTab();

        console.log('Test Execution Success : Ensure cases are correctly displayed under Closed Cases tab')
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Verifying cases displayed under Closed Cases tab log has failed " + error });
    }
    
});

/** Ensure filtering is available on Closed Cases in Case Management & user can filter on multiple parameters */
test("Verify filter option on closed cases @casemanagement", async ({ dashboardPage }) => {
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();

        await test.step("Verify filters", async () => {
            await dashboardPage.verifyClosedCasesPageFilters();
        })

        // verify if each filter is working 
        await test.step("Verify filter results", async () => {
            await dashboardPage.validateMemberAccountNumberFilter({ dashboardPage });
            await dashboardPage.validateEffectiveDateFilter({ dashboardPage });
            await dashboardPage.validateMemberTobeAssignedFilter({ dashboardPage });
            await dashboardPage.validateCaseTypeFilter({ dashboardPage });
            await dashboardPage.validateCaseIdFilter({ dashboardPage });
            await dashboardPage.validateReferenceFilter({ dashboardPage });
        })

        console.log('Test Execution Success : Verify filter option on closed cases')
        
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Verifying filter option on closed cases has failed " + error });
    }
})