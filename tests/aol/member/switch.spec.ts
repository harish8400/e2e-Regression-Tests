import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import * as memberData from "../../../src/aol/data/member.json";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Switch");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "Verify Combined switch is processed successfully for a member with 1 single option to another single options using current date.", async ({ navBar, memberPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    let member = memberData.Employment.EmployementTerminationMember_Hesta;
    await navBar.selectMember(member);
    await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToAnotherOption();
})

test(fundName() + "Verify Combined switch is processed successfully for a member with 1 single option to multiple option using current date.", async ({ navBar, memberPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    let member = memberData.Employment.EmployementTerminationMember_Hesta;
    await navBar.selectMember(member);
    await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToMultipleOption();
})

test(fundName() + "Verify Combined switch is processed successfully for a more than one option to single option using current date.", async ({ navBar, memberPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    let member = memberData.Employment.EmployementTerminationMember_Hesta;
    await navBar.selectMember(member);
    await memberPage.verifyCombinedSwitchProcessedSuccessfullyForMoreThanOneOptionToSingleOption();
})