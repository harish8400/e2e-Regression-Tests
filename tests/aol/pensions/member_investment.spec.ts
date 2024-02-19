import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import * as memberData from "../../../src/aol/data/pension_data.json";
import { FUND } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";
//import { product }from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"-Money gets invested into CASH after roll-in post member creation @pension", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Rollin_And_Verify_Cash_Investment;
        await navBar.selectMember(member);
        await pensionInvestmentPage.RolloverInTransaction();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Pension draw-down as Proportional @pension", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Pension_Drawdown_Change;
        await navBar.selectMember(member);
        await pensionInvestmentPage.DrawdownTransactionsProportional();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Pension draw-down as Specific order @pension", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Pension_Drawdown_Change;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
            case FUND.AE:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
        }

        await navBar.selectMember(member);

        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Pension draw-down as Percentage @pension", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Pension_Drawdown_Change;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
            case FUND.AE:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
        }

        await navBar.selectMember(member);

        await pensionInvestmentPage.DrawdownTransactionsPercentage();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-For future drawdown Members should not be able to select any investment options in which the money is NOT currently invested @pension", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Pension_Drawdown_Change;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
            case FUND.AE:
                member = memberData.pension_vangaurd.Pension_Drawdown_Change;
        }

        await navBar.selectMember(member);

        await pensionInvestmentPage.verifyFutureDrawDownOptions();

    } catch (error) {
        throw error;
    }
})

test("Add Investment Pricing", async ({ navBar, investmentsAndPricing }) => {
    try {

        await allure.suite("Pension");

        await navBar.selectProduct();
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.addInvestmentPrice();

    } catch (error) {
        throw error;
    }
})

test("Investment product update", async ({ navBar, investmentsAndPricing }) => {
    try {

        await allure.suite("Pension");

        await navBar.selectProduct();
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.editInvestment();

    } catch (error) {
        throw error;
    }
})