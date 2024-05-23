import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Configuration");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Verify if user can add investment price for Investment product", async ({ navBar, investmentsAndPricing }) => {
    await navBar.accumulationProduct.click();
    await investmentsAndPricing.addInvestmentPrice();
})

test(fundName() + "-Verify edit/updating an existing investment product", async ({ navBar, investmentsAndPricing }) => {
    await navBar.accumulationProduct.click();
    await investmentsAndPricing.editInvestment();
})