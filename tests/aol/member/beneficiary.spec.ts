import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"- Add new non binding nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Add new Binding lapsing nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage, memberPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.bindinglapsingInputFileds();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100%", async ({ navBar, beneficiaryPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
    } catch (error) {
        throw error;
    }
})