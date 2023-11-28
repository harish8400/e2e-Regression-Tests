import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";

/**This test perform self triggered rollout full exit on a member */
test("HFM - Self triggered rollout out full exit @fullexit", async ({ loginPage, dashboardPage, memberPage, memberTransactionPage }) => {

    test.setTimeout(600000);

    let admin = Admins.getAdminByUsername("admin@tinasuper.com");

    await test.step("Login", async () => {
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
    })

    await test.step("Super Member creation", async () => {
        await dashboardPage.navigateToAccumulationAddMember();
        let addedMember = await memberPage.addNewMember();
        await memberPage.selectMember(addedMember);
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn();
    })

    await test.step("Rollout full exit", async () => {
        await memberTransactionPage.memberRolloverOut();
    })

})
