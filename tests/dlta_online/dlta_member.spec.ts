import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

test.describe("Add members in DLTA @dltaonline", () => {

    test("Add member successfully", async({loginPage, dashboardPage, memberPage}) => {
        test.setTimeout(120000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Navigate to add member", async () => {
            await dashboardPage.navigateToAccumulationAddMember();
            await memberPage.addNewMember();
        })
    })

    
})