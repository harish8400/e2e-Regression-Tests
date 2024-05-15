import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Insurance");
    await allure.parentSuite(process.env.PRODUCT!);
});


test(fundName() + "Verify that the insurance page is displayed correctly", async ({ insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
    } catch (error) {
        throw error;
    }
})

test(fundName() + "Verify filter options are displayed correctly", async ({ insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
    } catch (error) {
        throw error;
    }
})

test(fundName() + "Verify that user can update Insurance category @Insurance", async ({ insurancePage }) => {

    try {
        await insurancePage.accumulationDropDown.click();
        await insurancePage.editInsurance();

    } catch (error) {
        throw error;
    }
})

test(fundName() + "Verify that user can create new Insurance category @Insurance", async ({ insurancePage }) => {

    try {
        await insurancePage.accumulationDropDown.click();
        await insurancePage.newInsurance();

    } catch (error) {
        throw error;
    }
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Provider", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
        await insurancePage.verifyDefaultDeathCoverCanBeBasedOnProvider();
    } catch (error) {
        throw error;
    }
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Cover Type - Death", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
        await insurancePage.verifyDefaultDeathCoverCanBeBasedOnCoverType();
    } catch (error) {
        throw error;
    }
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Category", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
        await insurancePage.verifyDefaultDeathCoverCanBeBasedOnCategory();
    } catch (error) {
        throw error;
    }
})

test("Verify that mandatory fields on the add insurance page are marked with a red asterisk. ", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnNewCategory();
        await insurancePage.verifyMandtoryFiledsNewCategory();
    } catch (error) {
        throw error;
    }
})

test("Verify an error is returned when the user selects save without all mandatory field populated", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnNewCategory();
        await insurancePage.validateErrorMessageWithoutAllMandatoryFields();
    } catch (error) {
        throw error;
    }
})

test("Verify the fields are displayed correctly", async ({ navBar, insurancePage }) => {

    try {
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnNewCategory();
        await insurancePage.verifyFiledsAreDisplayedOnNewCategory();
    } catch (error) {
        throw error;
    }
})