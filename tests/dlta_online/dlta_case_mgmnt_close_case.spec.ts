import { expect } from "@playwright/test";
import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

test.describe("Test describe block @casemanagement", () => {
    test.setTimeout(60000);

test.beforeEach(async ({ loginPage, dashboardPage }) => {
    let admin = Admins.getAdminByUsername("admin@tinasuper.com");
    await loginPage.navigateTo();
    await loginPage.doLogin(admin.username, admin.password);
    await dashboardPage.maximizeWindow();
});


        test("Ensure dashboard is correctly displayed", async ({ dashboardPage }) => {
            await dashboardPage.closed_cases.click();
            await dashboardPage.waitForTimeout(3000);
            await expect(dashboardPage.case_management).toHaveText("Case Management");      

        });

        test("Ensure cases are correctly displayed under Closed Cases tab", async ({ dashboardPage }) => {
            await dashboardPage.closed_cases.click(); 
            await dashboardPage.verifyCaseManagementButtons();
            
        });

        test("Ensure the user can successfully filter on multiple parameters in Case Management Closed Cases", async ({ dashboardPage }) => {
            await dashboardPage.waitForTimeout(3000);
            await dashboardPage.closed_cases.click();
            await dashboardPage.clickOnFilter();
           let expectedItems = ["Member Account Number", "Effective Date", "Assigned to","Case Type","Outcome","Case Group ID","Status","Reference"];  
            let actualItems = await dashboardPage.getListOfItems();
            expect(actualItems).toEqual(expectedItems); 
         });

         test("Ensure that a member is able to find his case based on his account number", async ({ dashboardPage }) => {
            //await dashboardPage.clickOnClosedIcon();
            await dashboardPage.clickOnFilter();
            await dashboardPage.verifyMemberAccNumber();
            expect(dashboardPage.memberText.filter({ hasText: ('Member Account Number: 4F653-90-') })); 
        });
        
    });