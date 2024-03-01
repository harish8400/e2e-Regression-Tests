import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";
import * as memberData from "../../../src/aol/data/member.json";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"- Add new non binding nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage, memberPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await memberPage.selectMember("9010103");
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Add new Binding lapsing nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage, memberPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await memberPage.selectMember("9010105");
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.bindinglapsingInputFileds();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100%", async ({ navBar, beneficiaryPage, memberPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await memberPage.selectMember("9010106");
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Verify a new pension membership account creation, then alter the beneficiary details while membership is in both Provisional then Active status.", async ({ navBar, beneficiaryPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
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