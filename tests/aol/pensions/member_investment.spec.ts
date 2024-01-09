
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as memberData from "../../../src/aol/data/pension_data.json";

test.beforeEach(async ({ }) => {
    test.setTimeout(600000);
});

/* Ensure that a new case can be created without being assigned to a member with possible outcome of Processing, Error, Success */
test("Money gets invested into CASH after roll-in post member creation", async ({ navBar, pensionInvestmentPage }) => {
    try {
        await allure.suite("Pension");

        await navBar.selectProduct();
        await navBar.navigateToPensionMemberPage();
        let member = memberData.pension.Rollin_And_Verify_Cash_Investment;
        await navBar.selectMember(member);

        await pensionInvestmentPage.RolloverInTransaction();

    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed" });
    }
})

test("Pension draw-down as Proportional", async ({ navBar, pensionInvestmentPage }) => {
    try {

        await allure.suite("Pension");

        await navBar.selectProduct();
        await navBar.navigateToPensionMemberPage();
        let member = memberData.pension.Pension_Drawdown_Proportional_Order;
        await navBar.selectMember(member);

        await pensionInvestmentPage.DrawdownTransactionsProportional();

    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed" });
    }
})

