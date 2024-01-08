import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL } from "../../../src/aol/utils_aol";

test("Manual Roll-in - Pension Member @pension", async ({ pensionAccountPage, pensionTransactionPage }) => {

    await allure.suite("Pension");

    test.setTimeout(600000);

    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await pensionTransactionPage.selectMember(uniqueSurname);
    await pensionTransactionPage.rollInTransaction();

})

test("ABP Rollover Out Commutation - Full exit", async ({ pensionAccountPage, pensionTransactionPage }) => {

    await allure.suite("Pension");

    test.setTimeout(600000);

    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await pensionTransactionPage.selectMember(uniqueSurname);
    await pensionTransactionPage.rollInTransaction();
    await pensionTransactionPage.rollOutTransaction();

})