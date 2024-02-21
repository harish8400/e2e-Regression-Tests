import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Insurance");
    await allure.parentSuite(process.env.PRODUCT!);
});


test(fundName()+"Verify that the insurance page is displayed correctly", async ({ insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify filter options are displayed correctly", async ({ insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify that user can update Insurance category @Insurance", async ({ insurancePage }) => {

    try {
        await insurancePage.accumulationDropDown.click();
        await insurancePage.editInsurance();
        
    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify that user can create new Insurance category @Insurance", async ({ insurancePage }) => {

    try {
        await insurancePage.accumulationDropDown.click();
        await insurancePage.newInsurance();
        
    } catch (error) {
        throw error;
    }
})