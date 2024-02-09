import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import * as memberData from "../../../src/aol/data/member.json";
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
});

/**This test performs Employment Termination  tests */
test(fundName()+"-Verify an employment termination at current system date is processed successfully.", async ({  navBar, memberTransactionPage }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
            case FUND.AE:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
        }
        
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
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
            case FUND.AE:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
        }

        await navBar.selectMember(member);
        await memberTransactionPage.employmentTerminationForEarlierDate();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify a new pension membership account creation, then alter the beneficiary details while membership is in both Provisional then Active status.", async ({ navBar, beneficiaryPage }) => {
    try {
        await navBar.navigateToTTRMembersPage();
        let member = memberData.Beneficiary.PensionMembershipAccountNumber_Hesta;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Beneficiary.PensionMembershipAccountNumber_Vanguard;
            case FUND.AE:
                member = memberData.Beneficiary.PensionMembershipAccountNumber_Vanguard;
        }

        await navBar.selectMember(member);
        await beneficiaryPage.reltionShipButton();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})

