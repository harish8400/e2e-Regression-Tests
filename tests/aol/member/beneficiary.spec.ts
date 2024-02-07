import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member Beneficiary");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("Add new non binding nomination on an existing account with all portion matched to 100%", async ({ loginPage, navBar, beneficiaryPage }) => {

    await allure.suite("Member");

    try {
        //await loginPage.navigateTo();
        //await loginPage.doLogin("admin@tinasuper.com","tinaArena");
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})


test("Add new Binding lapsing nomination on an existing account with all portion matched to 100%", async ({ loginPage, navBar, beneficiaryPage }) => {

    await allure.suite("Member");

    try {
        //await loginPage.navigateTo();
        //await loginPage.doLogin("admin@tinasuper.com","tinaArena");
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.bindinglapsingInputFileds();
    } catch (error) {
        throw error;
    }
})

test("Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100%", async ({ loginPage, navBar, beneficiaryPage }) => {

    await allure.suite("Member");
    try {
        //await loginPage.navigateTo();
        //await loginPage.doLogin("admin@tinasuper.com","tinaArena");
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
    } catch (error) {
        throw error;
    }
})