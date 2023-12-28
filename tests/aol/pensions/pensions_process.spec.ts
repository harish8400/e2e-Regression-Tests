import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { Admins } from "../../../src/aol/data/admins";

/**This test performs self triggered rollout full exit on a member */
test("Member Full Exit- Minimum Pension @minimum", async ({ loginPage, pensionShellAccount, dashboardPage,commutationPayment }) => {

    await allure.suite("Member Full Exit Process");
    await allure.subSuite("Member Full Exit-Minimum Pension");

    test.setTimeout(600000);
    let admin = Admins.getAdminByUsername("admin@tinasuper.com");
    await test.step("Login", async () => {
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
    })

    await test.step("Member creation", async () => {
        await dashboardPage.h4m_url();
        await dashboardPage.sleep(5000);
        await dashboardPage.navigateToRetirementIncomeStreamAddMember(50000);
        await pensionShellAccount.addNewMember();
        await pensionShellAccount.consolidation();
        await pensionShellAccount.investments();
        await pensionShellAccount.beneficiaries();

    })

    await test.step("Pension Shell Account Creation", async () => {
        /* The code is calling various methods on the `accountBasedPensionPage` object. */
        await pensionShellAccount.pensionDetails();
        await pensionShellAccount.case_process();
        await pensionShellAccount.check_box();
        await pensionShellAccount.create_account();
        await pensionShellAccount.clickOnClosedIcon();


    })

    await test.step("Member Identification", async () => {
        const randomMemberName = pensionShellAccount.randomName();
        await pensionShellAccount.select_member(randomMemberName);
    })

    await test.step("Pension Commencement to the Member", async () => {
        await commutationPayment.pension_commence();
    })

    // await test.step("RollIn", async () => {
    //     await commutationPayment.memberRolloverIn();
    //     await commutationPayment.rollIn_process();
    //     await commutationPayment.clickOnClosedIcon();
    // })

    await test.step("Commutation-rollout Full-Exit", async () => {
        await commutationPayment.pension_commutation_rollOut();
        await commutationPayment.clickOnClosedIcon();
    })


})