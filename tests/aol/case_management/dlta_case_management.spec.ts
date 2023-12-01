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
        expect(await dashboardPage.casemanagement.innerText()).toBe("Case Management");
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");
        await dashboardPage.verifyCaseManagementTabs();
        await dashboardPage.waitForTimeout(5000)

    });

    test("Ensure the user can successfully filter on multiple parameters in Case Management Open Cases @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");
        
        await dashboardPage.clickFilter();
        await dashboardPage.waitForTimeout(5000);
        let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Case Group ID", "Reference", "Status", "Outcome"];
        let actualItems = await dashboardPage.getListItems();
        expect(actualItems).toEqual(expectedItems);

    });

    test("Ensure that an existing case can be assigned to a user @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");
        
        await dashboardPage.sleep(5000);
        const rowNumberToClick = 2;
        await dashboardPage.clickOnTableRow(rowNumberToClick);
        await dashboardPage.addCaseToAssignee();
        await dashboardPage.sleep(5000);
        // Regex pattern for the dynamic assignment text
        const expected_activity = /Case Assigned from '.+' to '.+'/; 
        const activityNotes = await dashboardPage.activity_notes();
        expect(activityNotes).toMatch(expected_activity);

    });

});
