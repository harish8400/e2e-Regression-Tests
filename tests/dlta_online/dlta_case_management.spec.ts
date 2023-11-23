import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins"
import { expect } from "@playwright/test";
test.describe("Test describe block @casemanagement", () => {
    
    test.setTimeout(60000);
    test("Casemanagement DetailsPage", async({loginPage,dashboardPage}) => {
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
            await dashboardPage.maximizeWindow();
        })

        await test.step("To validate casemanagement dashboard screen", async () => {
            
            await dashboardPage.waitForTimeout(3000)
            await expect(dashboardPage.casemanagement).toHaveText("Case Management"); 
            
        })
    
        await test.step("To verify whether member able to see the tabs on Case Management screen", async () => {
            await dashboardPage.verifyCaseManagementTabs();
        })
        await test.step("To verify filtering is available on Open Cases in Case Management", async () => {
            let expectedItems = ["Member Account Number", "Effective Date", "Assigned to","Case Type","Case Group ID","Reference","Status","Outcome"]
            await dashboardPage.clickFilter();
            let actualItems = await dashboardPage.getListItems();
            expect(actualItems).toEqual(expectedItems) 
         })
        
        await test.step("To verify that an existing case can be assigned to a user", async() => {
            // await dashboardPage.clickFilter();
            // await dashboardPage.verifyAssignedTo();
            const rowNumberToClick = 2;
            await dashboardPage.clickOnTableRow(rowNumberToClick);
            await dashboardPage.addCaseToAssignee();
            await expect(dashboardPage.activity_text).toContainText("Case Assigned to"); 
            
        })
		
		await test.step("Ensure that a member is able to find his case based on his account number", async () => {
            await dashboardPage.clickOnClosedIcon();
            await dashboardPage.clickFilter();
            await dashboardPage.verifyMemberAccountNumber();
            expect(dashboardPage.Member_text.filter({ hasText: 'Member Account Number: 123456close icon' })); 
            
        })
    })



})
  
