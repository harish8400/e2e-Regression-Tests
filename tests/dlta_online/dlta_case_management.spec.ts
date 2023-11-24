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
            await dashboardPage.takeScreenshot('HomePage.png');
            
        })
    
        await test.step("To verify whether member able to see the tabs on Case Management screen", async () => {
            await dashboardPage.verifyCaseManagementTabs();
            await dashboardPage.takeScreenshot('Tabs.png');
        })
        await test.step("To verify filtering is available on Open Cases in Case Management", async () => {
            let expectedItems = ["Member Account Number", "Effective Date", "Assigned to","Case Type","Case Group ID","Reference","Status","Outcome"]
            let actualItems = await dashboardPage.getListItems();
            expect(actualItems).toEqual(expectedItems) 
            await dashboardPage.takeScreenshot('Filter.png');
        })
		await test.step("To verify that an existing case can be assigned to a user", async() => {
            const rowNumberToClick = 2;
            await dashboardPage.clickOnTableRow(rowNumberToClick);
            await dashboardPage.addCaseToAssignee();
            await dashboardPage.sleep(5000);
            await expect(dashboardPage.activity_text).toContainText("Case Assigned to"); 
            await dashboardPage.takeScreenshot('assignee.png');
            
        })
        await test.step("To verify that an existing case can be assigned to a member FilterOption:AssignedTo", async () => {            
			await dashboardPage.clickOnClosedIcon();  
            await dashboardPage.clickFilter();
            await dashboardPage.verify_Member_TobeAssigned();
            await dashboardPage.apply_button();
            await dashboardPage.go_Button();
            await dashboardPage.waitForTimeout(5000);
            const rowNumberToClick = 1;
            await dashboardPage.clickOnTableRow(rowNumberToClick);
            await dashboardPage.addCaseToAssignee();
            await dashboardPage.sleep(5000);
            await dashboardPage.takeScreenshot('assignedTo.png');
            await expect(dashboardPage.activity_text).toContainText("Case Assigned to"); 
        })

        // await test.step("To verify that an existing case can be assigned to a member FilterOption:caseGroupId", async () => {            
        //     await dashboardPage.clickOnClosedIcon();
        //     await dashboardPage.clickFilter();
        //     await dashboardPage.basedOnCaseId();
        //     await dashboardPage.apply_button();
        //     await dashboardPage.go_Button();
        //     const rowNumberToClick = 1;
        //     await dashboardPage.clickOnTableRow(rowNumberToClick);
        //     await dashboardPage.addCaseToAssignee();
        //     await new Promise(() => {})
            
        // })
		
    })



})
  
