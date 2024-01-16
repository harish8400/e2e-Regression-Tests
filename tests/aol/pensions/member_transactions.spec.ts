import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import * as memberData from "../../../src/aol/data/pension_data.json";

test("Manual Roll-in - Pension Member @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");

    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.Manual_Rollin;
    await navBar.selectMember(member);
    await pensionTransactionPage.rollInTransaction();

})

test("ABP Rollover Out Commutation - Full exit", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(true);

})

test("ABP Rollover Out Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(false);

})

test("ABP UNP Commutation - Full Exit", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefit(true);

})

test("ABP UNP Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefit(false);

})

test("ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    member = "9020358";
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefitReject(false);

})

