import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import * as member from "../../../src/aol/data/member.json"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await allure.suite("Money_In");
    await navBar.selectProduct();
});

test(fundName()+"Contribution with TFN - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberOverviewpage.verifyTFNStatus(true);
    await memberOverviewpage.memberAccumulationAccount_Tab.click();
    await memberTransactionPage.memberRolloverIn('Personal',true);
    
})

test(fundName()+"Contribution without TFN - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(true, true);
    await memberPage.selectMember(addedMember);
    await memberOverviewpage.verifyTFNStatus(false);
    await memberOverviewpage.memberAccumulationAccount_Tab.click();
    await memberTransactionPage.memberRolloverIn();
    
})

test(fundName()+"Personal Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn();
    
})

test(fundName()+"Salary Sacrifice Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn('Salary Sacrifise');
    
})

test(fundName()+"Super Guaranty Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    await memberPage.selectMember(member.memberID);
    await memberTransactionPage.memberRolloverIn('Super Guaranty');
    
})

test(fundName()+"Spouse Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    await memberPage.selectMember(member.memberID);
    await memberTransactionPage.memberRolloverIn('Spouse');
    
})

test(fundName()+"Retirement Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    await memberPage.selectMember(member.memberID);
    await memberTransactionPage.memberRolloverIn('Retirement');
    
})