import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

test.describe("Add case management @closedcases", () => {

    test("Case management page", async({loginPage, dashboardPage}) => {

        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
            await dashboardPage.maximizeWindow();
        })

        //await test.step("To validate casemanagement dashboard screen", async () => {
        //    await dashboardPage.waitForTimeout(3000)
            //await expect(dashboardPage.case_management).toHaveText("Case Management");      

        //})
        await test.step("To validate closed cases dashboard screen",async () => {
              await dashboardPage.verifyCaseManagementButtons();
            
        })

        await test.step("To validate closed cases filter option",async () => {
            await dashboardPage.clickOnFilter();
          
      })
    })
})