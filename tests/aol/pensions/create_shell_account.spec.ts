import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ navBar, pensionAccountPage, memberPage }) => {
    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await memberPage.selectMember(uniqueSurname);
})

test(fundName()+"-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar, pensionAccountPage, memberPage }) => {
    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname, true);
    await memberPage.selectMember(uniqueSurname);
})