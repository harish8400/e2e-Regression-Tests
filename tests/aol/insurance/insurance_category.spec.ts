import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Insurance");
    await allure.parentSuite(process.env.PRODUCT!);
});


test(fundName() + "Verify that the insurance page is displayed correctly", async ({ insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
})

test(fundName() + "Verify filter options are displayed correctly", async ({ insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnFilter();
})

test(fundName() + "Verify that user can update Insurance category @Insurance", async ({ insurancePage }) => {
    await insurancePage.accumulationDropDown.click();
    await insurancePage.editInsurance();
})

test(fundName() + "Verify that user can create new Insurance category @Insurance", async ({ insurancePage }) => {
    await insurancePage.accumulationDropDown.click();
    await insurancePage.newInsurance();
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Provider", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnFilter();
    await insurancePage.verifyDefaultDeathCoverCanBeBasedOnProvider();
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Cover Type - Death", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnFilter();
    await insurancePage.verifyDefaultDeathCoverCanBeBasedOnCoverType();
})

test("Verify that the insurance category Default death cover can be viewed when the user filters the insurance category based on Category", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnFilter();
    await insurancePage.verifyDefaultDeathCoverCanBeBasedOnCategory();
})

test("Verify that mandatory fields on the add insurance page are marked with a red asterisk.", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnNewCategory();
    await insurancePage.verifyMandtoryFiledsNewCategory();
})

test("Verify an error is returned when the user selects save without all mandatory field populated", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnNewCategory();
    await insurancePage.validateErrorMessageWithoutAllMandatoryFields();
})

test("Verify the fields are displayed correctly", async ({ navBar, insurancePage }) => {
    await insurancePage.clickOnInsuranceLink();
    await insurancePage.clickOnNewCategory();
    await insurancePage.verifyFiledsAreDisplayedOnNewCategory();
})