import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL } from "../../../src/aol/utils_aol";
import * as memberData from "../../../src/aol/data/pension_data.json";

test("Manual Roll-in - Pension Member", async ({ navBar, pensionAccountPage, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");

    await navBar.selectProduct();
    await navBar.navigateToPensionMemberPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await navBar.selectMember(uniqueSurname);
    await pensionTransactionPage.rollInTransaction();

})

test("ABP Rollover Out Commutation - Full exit @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMemberPage();
    let member = memberData.pension.ABP_Commutation_Rolout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.rollOutTransaction();

})