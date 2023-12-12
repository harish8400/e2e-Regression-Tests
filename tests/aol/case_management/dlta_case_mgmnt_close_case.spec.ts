import { expect } from "@playwright/test";
import { dltaOnlineTest as test } from "../../../src/aol/base_aol_test"
import { Admins } from "../../../src/aol/data/admins";
import { allure } from "allure-playwright";

test.describe("Case management - Closed cases", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ loginPage }) => {
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
        //await dashboardPage.maximizeWindow();
    });

    /** This test verifies dashboard page, closed cases page, filtering options */
    test("Verify closed cases management @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");

        await test.step("Verify closed cases page", async () => {
            await dashboardPage.waitForTimeout(3000);
            await expect(dashboardPage.case_management).toHaveText("Case Management");

            await dashboardPage.closed_cases.click();
            await dashboardPage.verifyCaseManagementButtons();
        })

        await test.step("Verify closed cases page filters", async () => {
            await dashboardPage.waitForTimeout(3000);
            await dashboardPage.closed_cases.click();
            await dashboardPage.clickOnFilter();
            let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Outcome", "Case Group ID", "Status", "Reference"];
            let actualItems = await dashboardPage.getListOfItems();
            expect(actualItems).toEqual(expectedItems);
            await dashboardPage.verifyMemberAccountNumber(1000);
            expect(dashboardPage.memberText.filter({ hasText: ('Member Account Number: 4F653-90-') }));
            await dashboardPage.go_option.click();
        })
    })

    test("Ensure dashboard is correctly displayed", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");

        await dashboardPage.waitForTimeout(3000);
        await expect(dashboardPage.case_management).toHaveText("Case Management");
    });

    test("Ensure cases are correctly displayed under Closed Cases tab", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");

        await dashboardPage.closed_cases.click();
        await dashboardPage.verifyCaseManagementButtons();
    });

    test("Ensure the user can successfully filter on multiple parameters in Case Management Closed Cases", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");
        
        await dashboardPage.waitForTimeout(3000);
        await dashboardPage.closed_cases.click();
        await dashboardPage.clickOnFilter();
        let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Outcome", "Case Group ID", "Status", "Reference"];
        let actualItems = await dashboardPage.getListOfItems();
        expect(actualItems).toEqual(expectedItems);
        await dashboardPage.verifyMemberAccountNumber(1000);
        expect(dashboardPage.memberText.filter({ hasText: ('Member Account Number: 4F653-90-') }));
        await dashboardPage.go_option.click();
    });

});