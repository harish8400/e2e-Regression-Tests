import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { FUND } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Money gets invested into CASH after roll-in post member creation @pension", async ({ navBar, pensionInvestmentPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    await pensionInvestmentPage.RolloverInTransaction();
})

test(fundName() + "-Pension draw-down as Proportional @pension", async ({ navBar, pensionInvestmentPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    await pensionInvestmentPage.DrawdownTransactionsProportional();
})

test(fundName() + "-Pension draw-down as Specific order @pension", async ({ navBar, pensionInvestmentPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();
})

test(fundName() + "-Pension draw-down as Percentage @pension", async ({ navBar, pensionInvestmentPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    await pensionInvestmentPage.DrawdownTransactionsPercentage();
})

test(fundName() + "-For future drawdown Members should not be able to select any investment options in which the money is NOT currently invested @pension", async ({ navBar, pensionInvestmentPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    switch (process.env.PRODUCT!) {
        case FUND.VANGUARD:
            await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
        case FUND.AE:
            await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext);
    }

    await pensionInvestmentPage.verifyFutureDrawDownOptions();
})

test(fundName() + "Verify if user can add investment price for Investment product", async ({ navBar, investmentsAndPricing }) => {

    await navBar.accumulationProduct.click();
    await investmentsAndPricing.addInvestmentPrice();

})

test(fundName() + "Verify edit/updating an existing investment product", async ({ navBar, investmentsAndPricing }) => {

    await navBar.accumulationProduct.click();
    await investmentsAndPricing.editInvestment();
})


