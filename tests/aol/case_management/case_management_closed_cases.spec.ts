import { expect } from "@playwright/test";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 5); // Should be 15 minutes
    await navBar.selectProduct();
    await allure.suite("Case Management");
    await allure.parentSuite(process.env.PRODUCT!);
});

/** Ensure that comments can be added after a case is closed and user can find last updated date time on a case */
test(fundName() + "-Ensure that comments can be added after a case is closed and user can find last updated date time on a case @casemanagement", async ({ dashboardPage }) => {
    await dashboardPage.updateClosedCaseWithComment();
    await dashboardPage.verifyClosedCaseUpdateLog();
})

/** Ensure cases are correctly displayed under Closed Cases tab */
test(fundName() + "-Ensure cases are correctly displayed under Closed Cases tab @casemanagement", async ({ dashboardPage }) => {
    await dashboardPage.navigateToClosedCasesTab();
    await expect(dashboardPage.closedCaseManagementHeading).toContainText('Closed Cases');
    await dashboardPage.verifyCaseManagementTab();
});

/** Ensure filtering is available on Closed Cases in Case Management & user can filter on multiple parameters */
test(fundName() + "-Verify filter option on closed cases @casemanagement", async ({ dashboardPage }) => {
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
})
