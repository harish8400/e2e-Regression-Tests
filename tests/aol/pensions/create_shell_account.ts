import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
});

test(fundName()+"-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ navBar, pensionAccountPage, memberPage }) => {

    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);

    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await memberPage.selectMember(uniqueSurname);

})
