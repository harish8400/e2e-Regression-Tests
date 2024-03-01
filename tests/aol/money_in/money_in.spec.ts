import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await allure.suite("Money_In");
    await navBar.selectProduct();
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Contribution with TFN - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberOverviewpage.verifyTFNStatus(true);
    await memberOverviewpage.memberAccumulationAccount_Tab.click();
    await memberTransactionPage.memberRolloverIn();
    
})

test(fundName()+"Contribution without TFN - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(true, true);
    await memberPage.selectMember(addedMember);
    await memberOverviewpage.verifyTFNStatus(false);
    await memberOverviewpage.memberAccumulationAccount_Tab.click();
    await memberTransactionPage.memberRolloverIn();
    
})

test(fundName()+"Personal Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn();
    
})

test(fundName()+"Salary Sacrifice Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn('Salary Sacrifise');
    
})