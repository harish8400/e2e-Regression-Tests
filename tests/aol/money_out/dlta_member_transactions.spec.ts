import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
});

/**This test performs self triggered rollout full exit on a member */
test("Money Out - Rollover out full exit @fullexit", async ({ dashboardPage, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await allure.subSuite("Rollover out full exit");

    await test.step("Super Member creation", async () => {
        await dashboardPage.navigateToAccumulationAddMember();
        let addedMember = await memberPage.addNewMember(false);
        await memberPage.selectMember(addedMember);
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn();
    })

    await test.step("Rollout full exit", async () => {
        await memberTransactionPage.memberRolloverOut();
    })

})

test("Rollover In Personal contribution", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await navBar.navigateToAccumulationMembersPage();
    await memberPage.selectMember('Nancy');
    await memberTransactionPage.memberRolloverIn();

})

test("Rollover out", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");

    await navBar.navigateToAccumulationMembersPage();
    await memberPage.selectMember('Alexis');
    await memberTransactionPage.memberRolloverIn();
    await memberTransactionPage.memberRolloverOut();
    
})