import { expect } from "@playwright/test";
import { dltaOnlineTest as test } from "../../../src/aol/base_dlta_online_test"
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

    test("Ensure dashboard is correctly displayed @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");

        await dashboardPage.waitForTimeout(3000);
        await expect(dashboardPage.case_management).toHaveText("Case Management");
    });

    test("Ensure cases are correctly displayed under Closed Cases tab @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");

        await dashboardPage.closed_cases.click();
        await dashboardPage.verifyCaseManagementButtons();
    });

    test("Ensure the user can successfully filter on multiple parameters in Case Management Closed Cases @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Closed Cases");
        
        await dashboardPage.waitForTimeout(3000);
        await dashboardPage.closed_cases.click();
        await dashboardPage.clickOnFilter();
        let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Outcome", "Case Group ID", "Status", "Reference"];
        let actualItems = await dashboardPage.getListOfItems();
        expect(actualItems).toEqual(expectedItems);
        await dashboardPage.verifyMemberAccNumber();
        expect(dashboardPage.memberText.filter({ hasText: ('Member Account Number: 4F653-90-') }));
        await dashboardPage.go_option.click();
    });

});