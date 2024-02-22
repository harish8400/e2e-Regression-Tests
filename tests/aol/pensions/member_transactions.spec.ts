import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import * as memberData from "../../../src/aol/data/pension_data.json";
import * as member from "../../../src/aol/data/member.json";
import { FUND } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"-Manual Roll-in - Pension Member @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.Manual_Rollin;
    switch (process.env.PRODUCT!) {
        case FUND.VANGUARD:
            member = memberData.pension_vangaurd.Manual_Rollin;
        case FUND.AE:
            member = memberData.pension_vangaurd.Manual_Rollin;
    }
    await navBar.selectMember(member);
    await pensionTransactionPage.rollInTransaction();
})

test(fundName()+"-ABP Rollover Out Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollover_And_UNP_Partial_Member_Number;
    switch (process.env.PRODUCT!) {
        case FUND.VANGUARD:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
        case FUND.AE:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
    }
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(false);
})

test(fundName()+"-ABP UNP Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollover_And_UNP_Partial_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefit(false);
})

test(fundName()+"-TTR RLO Commutation - Partial @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(false);
})

test(fundName()+"-ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_UNP_Full_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefitReject(false);
})

test(fundName()+"-ABP Rollover Out Commutation - Full exit @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_Rollover_Full_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(true);
})

test(fundName()+"-ABP UNP Commutation - Full Exit @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let member = memberData.pension.ABP_Commutation_UNP_Full_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationUNPBenefit(true);
})

test(fundName()+"-TTR RLO Commutation - Full Exit @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOut(true);
})

test(fundName()+"-ABP Death Benefit Payment @pension", async ({ navBar, pensionTransactionPage }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Death_benefit_member_number;
        await navBar.selectMember(member);
        await pensionTransactionPage.deathBenefitTransaction();
    } catch (error) {
        throw error
    }
})

test(fundName()+"-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToTTRMembersPage();
    let member = memberData.pension.TTR_Lump_Sum_Unrestricted_Unreserved_Fund_Withdrawal_Error;
    await navBar.selectMember(member);
    await pensionTransactionPage.commutationRolloverOutTTR(false);
})

test(fundName()+"-verify H4M pension commencement with PTB @pension", async ({ navBar, pensionTransactionPage }) => {
    await navBar.navigateToPensionMembersPage();
    let mem = member.memberID;
    await navBar.selectMember(mem);
    await pensionTransactionPage.verifyPTBtransaction(true);
    await pensionTransactionPage.pensionCommence();
})

test(fundName()+"Verify the updating of member's CRN in the account details @pension", async ({ navBar, accountInfoPage }) => {
    
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMember(member.memberID);
    await accountInfoPage.updateCRN();
})