import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Insurance");
    await allure.parentSuite(process.env.PRODUCT!);
});


test("Verify that the insurance page is displayed correctly", async ({  navBar,insurancePage }) => {

    await allure.suite("Insurance");

    try {
        await navBar.selectProduct();
        await insurancePage.clickOnInsuranceLink();
    } catch (error) {
        throw error;
    }
})

test("Verify filter options are displayed correctly", async ({  navBar,insurancePage }) => {

    await allure.suite("Insurance");

    try {
        await navBar.selectProduct();
        await insurancePage.clickOnInsuranceLink();
        await insurancePage.clickOnFilter();
    } catch (error) {
        throw error;
    }
})