import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Process full exit on member with active insurance", async ({ memberPage, navBar, memberInsurancePage, memberTransactionPage, memberOverviewpage }) => {

    await test.step("Super Member creation", async () => {
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false, true);
        await memberPage.selectMember(addedMember);
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn('personal',true);
        await memberTransactionPage.sleep(3000);
    })

    await test.step("supertick call", async ()=> {
        await memberOverviewpage.superTickVerification();
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
    })

    await test.step("add insurance cover to member", async () => {
        await memberInsurancePage.addMemberInsurance();
    })

    await test.step("Rollout full exit and verify isnurance premium transaction", async () => {
        await memberTransactionPage.memberRolloverOut();
        await memberInsurancePage.verifyInsuranceTransaction();
    })
})

test(fundName()+"Ensure user can delete insurance polices", async ({ memberPage, navBar, memberInsurancePage, memberTransactionPage }) => {

    await test.step("Super Member creation", async () => {
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false, true);
        await memberPage.selectMember(addedMember);
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn('personal',true);
        await memberTransactionPage.sleep(3000);
    })

    await test.step("add insurance cover to member", async () => {
        await memberInsurancePage.addMemberInsurance();
        await memberInsurancePage.sleep(3000);
    })

    await test.step("Cancell Insurance Cover", async () => {
        await memberInsurancePage.deleteInsurance();
    })
})