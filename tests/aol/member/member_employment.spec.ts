import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import * as memberData from "../../../src/aol/data/member.json";
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs Employment Termination  tests */
test(fundName()+"-Verify an employment termination at current system date is processed successfully.", async ({  navBar, memberTransactionPage }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        await navBar.selectMember(member);
        await memberTransactionPage.employmentTerminationForCurrentDate();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify an employment termination with effective date earlier than current system date is processed successfully.", async ({ navBar, memberTransactionPage }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        await navBar.selectMember(member);
        await memberTransactionPage.employmentTerminationForEarlierDate();

    } catch (error) {
        throw error;
    }
})