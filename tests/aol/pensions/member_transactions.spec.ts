import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json"
import { MemberTransactionsPage } from "../../../src/aol/pom/member_transaction";
import { ReviewCase } from "../../../src/aol/pom/component/review_case";


export const test = base.extend<{apiRequestContext: APIRequestContext;}>({
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

test(fundName()+"-Manual Roll-in - Pension Member @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage ,apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.shellAccount(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.rollInTransaction();
    let rollinId = await pensionTransactionPage.transactionView();
    let rollinTransactionId = rollinId!.split(":")[1];
    await TransactionsApiHandler.fetchTransactionDetails(apiRequestContext, rollinTransactionId!.trim());
})

test(fundName()+"-ABP Rollover Out Commutation - Partial @pension", async ({ navBar, pensionTransactionPage ,pensionAccountPage ,apiRequestContext}) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationRolloverOut(false);
    await pensionTransactionPage.paymentView();
})

test(fundName()+"-ABP UNP Commutation - Partial @PensionNewTest", async ({ navBar, pensionTransactionPage , pensionAccountPage,apiRequestContext}) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationUNPBenefit(false);
    let paymentId = await pensionTransactionPage.paymentView();
    let paymentTransactionId = paymentId!.split(":")[1];
    await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
})

test(fundName()+"-TTR RLO Commutation - Partial @pension", async ({ navBar, pensionTransactionPage ,pensionAccountPage ,apiRequestContext}) => {
    await navBar.navigateToTTRMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationRolloverOut(false);
    await pensionTransactionPage.paymentView();
})

test(fundName()+"-ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension", async ({ navBar, pensionTransactionPage,pensionAccountPage,apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationUNPBenefitReject(false);
})

test(fundName()+"-ABP Rollover Out Commutation - Full exit @pension", async ({ navBar, pensionTransactionPage , pensionAccountPage, apiRequestContext}) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationRolloverOut(true);
    await pensionTransactionPage.paymentView();
})

test(fundName()+"-ABP UNP Commutation - Full Exit @Test", async ({ navBar, pensionTransactionPage , pensionAccountPage, apiRequestContext}) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationUNPBenefit(true);
    let paymentId = await pensionTransactionPage.paymentView();
    let paymentTransactionId = paymentId!.split(":")[1];
    await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
})

test(fundName()+"-TTR RLO Commutation - Full Exit @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToTTRMembersPage();
    await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
    await pensionTransactionPage.commutationRolloverOut(true);
    await pensionTransactionPage.paymentView();
})

test(fundName()+"-ABP Death Benefit Payment @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext  }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await pensionTransactionPage.deathBenefitTransaction();
    } catch (error) {
        throw error
    }
})

test(fundName()+"-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar,memberPage,memberTransactionPage, pensionTransactionPage , pensionAccountPage, apiRequestContext }) => {
    let memberNo = member.memberIdUNP;
    await navBar.navigateToTTRMembersPage();
    await navBar.selectMember(memberNo);
    await pensionTransactionPage.verifyErrorMessageForMemberBalanceNotHundredPercentUNP();
   
})

test(fundName()+"-ABP Pension commencement WITH PTB @pension", async ({ navBar, pensionTransactionPage , pensionAccountPage, apiRequestContext}) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.verifyPTBtransaction(true);
    await pensionTransactionPage.pensionCommence();
})

test(fundName()+"Verify the updating of member's CRN in the account details @pension", async ({ navBar, accountInfoPage ,memberPage,apiRequestContext, internalTransferPage}) => {
    
    await navBar.navigateToAccumulationMembersPage();
    const { createMemberNo  } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
    await navBar.selectMember(createMemberNo);
    await accountInfoPage.updateCRN();
})