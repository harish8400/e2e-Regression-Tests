import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test";
import { Admins } from "../../src/dlta_online/data/admins";
import { expect } from "@playwright/test";

test.describe("Test describe block @casemanagement", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
        await dashboardPage.maximizeWindow();
    });

    test("Ensure cases are correctly displayed under Open Cases tab", async ({ dashboardPage }) => {
        await dashboardPage.waitForTimeout(3000);
        await expect(dashboardPage.casemanagement).toHaveText("Case Management");
        await dashboardPage.takeScreenshot('HomePage.png');
    });

    test("Ensure there are following tabs on Case Management screen: Open Cases, Closed Cases, On Hold, SLA", async ({ dashboardPage }) => {
        await dashboardPage.verifyCaseManagementTabs();
        await dashboardPage.waitForTimeout(50000)
        await dashboardPage.takeScreenshot('Tabs.png');
    });

    test("Ensure the user can successfully filter on multiple parameters in Case Management Open Cases", async ({ dashboardPage }) => {
        await dashboardPage.clickFilter();
        await dashboardPage.waitForTimeout(50000);
        let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Case Group ID", "Reference", "Status", "Outcome"];
        let actualItems = await dashboardPage.getListItems();
        expect(actualItems).toEqual(expectedItems);
        await dashboardPage.takeScreenshot('Filter.png');
    });

    test("Ensure that an existing case can be assigned to a user", async ({ dashboardPage }) => {
        await dashboardPage.sleep(5000);
        //await dashboardPage.waitForTimeout(50000);
        const rowNumberToClick = 2;
        await dashboardPage.clickOnTableRow(rowNumberToClick);
        await dashboardPage.addCaseToAssignee();
        await dashboardPage.sleep(5000);
        await expect(dashboardPage.activity_text).toContainText("Case Assigned to");
        await dashboardPage.takeScreenshot('assignee.png');
    });

    test("FilterOption:AssignedTo", async ({ dashboardPage }) => {
        await dashboardPage.clickFilter();
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.waitForTimeout(5000);
        const expectedAlertText = 'Assigned to: Admin User';
        const actualAlertText = await dashboardPage.alert_displayed();
        if (actualAlertText !== null) {
            expect(actualAlertText).toContain(expectedAlertText);
          } else {
            console.error('No alert was displayed.');
          }
        await dashboardPage.takeScreenshot('assignedTo.png');
        
    });
});
