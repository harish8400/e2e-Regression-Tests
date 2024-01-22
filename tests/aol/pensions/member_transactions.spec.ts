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
    let member = memberData.pension.ABP_UNP_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefit(true);

})

test("ABP UNP Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_UNP_Commutation_Rollout_Fullexit_Member_Number;
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

test("ABP Death Benefit Payment @pension", async ({ navBar }) => {
    try {

        await allure.suite("Pension");

        await navBar.selectProduct();
        await navBar.navigateToTTRMembersPage();

        //for Vangaurd member
       //let member = memberData.pension_vangaurd.Pension_Drawdown_Proportional_Order;

       //For Hesta MemberId for UAT
        let member = memberData.pension.death_benefit_member_number;
        await navBar.selectMember(member);

        //await pensionInvestmentPage.DeathBenefitTrasection();

    } catch (error) {
        throw error
    }
})

test("TTR RLO Commutation - Full Exit @pensiondemo", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(false);

})

test("TTR RLO Commutation - Partial @pensiondemo", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(false);

})

test("Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    
    await navBar.selectProduct();
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Commutation_Rollout_Fullexit_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOutTTR(false);

})
