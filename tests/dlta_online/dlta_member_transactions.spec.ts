import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

test.describe("Member transactions in DLTA @dltaonline", () => {

    test("Add Member Rollover In", async({loginPage, dashboardPage, memberPage, memberTransactionPage}) => {
        test.setTimeout(600000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Add Member Personal Contribution", async () => {
            await dashboardPage.navigateToMembers();
            await memberPage.selectMember('Nancy');
            await memberTransactionPage.memberRolloverIn();
        })
    })

    test("Add Member Rollover Out", async({loginPage, dashboardPage, memberPage, memberTransactionPage}) => {
        test.setTimeout(600000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Perform Full Rollover exit", async () => {
            await dashboardPage.navigateToMembers();
            await memberPage.selectMember('Alexis');
            await memberTransactionPage.memberRolloverIn();
            await memberTransactionPage.memberRolloverOut();
        })
    })
    
})