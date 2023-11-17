import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

test.describe("Add cases in DLTA @dltaonline", () => {

    test("Successful case submit", async({loginPage, dashboardPage}) => {

        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("add Case", async () => {

            await dashboardPage.addNewCase();
        })
    })

    
})