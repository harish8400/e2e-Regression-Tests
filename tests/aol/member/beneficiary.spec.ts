import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { selectedProduct } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(selectedProduct()+"- Add new non binding nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})


test(selectedProduct()+"-Add new Binding lapsing nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage, memberPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.bindinglapsingInputFileds();
    } catch (error) {
        throw error;
    }
})

test(selectedProduct()+"-Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100%", async ({ navBar, beneficiaryPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
    } catch (error) {
        throw error;
    }
})