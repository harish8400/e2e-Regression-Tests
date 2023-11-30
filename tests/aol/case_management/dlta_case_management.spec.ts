import { dltaOnlineTest as test } from "../../../src/aol/base_dlta_online_test";
import { Admins } from "../../../src/aol/data/admins";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";

test.describe("Case management - Open cases", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ loginPage }) => {
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
        //await dashboardPage.maximizeWindow();
    });

    test("Add case @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");

        await test.step("add Case", async () => {
            await dashboardPage.addNewCase();
        })
    })

    //This step verifies if case list is displayed with open, close, on hold, Go tabs options to select
    test("Ensure cases are correctly displayed under Open Cases tab @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");

        await dashboardPage.verifyCaseManagementTabs();
        await dashboardPage.waitForTimeout(5000)
        await dashboardPage.takeScreenshot('Tabs.png');
    });

    test("Ensure the user can successfully filter on multiple parameters in Case Management Open Cases @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");
        
        await dashboardPage.clickFilter();
        await dashboardPage.waitForTimeout(5000);
        let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Case Group ID", "Reference", "Status", "Outcome"];
        let actualItems = await dashboardPage.getListItems();
        expect(actualItems).toEqual(expectedItems);
        await dashboardPage.takeScreenshot('Filter.png');
    });

    test("Ensure that an existing case can be assigned to a user @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");
        
        await dashboardPage.sleep(5000);
        const rowNumberToClick = 2;
        await dashboardPage.clickOnTableRow(rowNumberToClick);
        await dashboardPage.addCaseToAssignee();
        await dashboardPage.sleep(5000);
        await expect(dashboardPage.activity_text).toContainText("Case Assigned to");
        await dashboardPage.takeScreenshot('assignee.png');
    });

});
