import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";


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

test(fundName() + "-Manual Roll-in - Pension Member @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
    })

    await test.step("Add a New Pensions Member", async () => {
        await pensionTransactionPage.shellAccount(navBar, pensionAccountPage, apiRequestContext);
    })

    await test.step("Add some MoneyIn", async () => {
        await pensionTransactionPage.rollInTransaction();
    })

    await test.step("Validate the Transaction details", async () => {
        let rollinId = await pensionTransactionPage.transactionView();

        let rollinTransactionId = rollinId!.split(":")[1];
        await TransactionsApiHandler.fetchTransactionDetails(apiRequestContext, rollinTransactionId!.trim());
    })
})

test(fundName() + "-ABP Rollover Out Commutation - Partial @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToPensionMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationRolloverOut(false);
    await pensionTransactionPage.paymentView();
    await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, membersId);
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await pensionTransactionPage.memberStatus();
})

test(fundName() + "-ABP UNP Commutation - Partial @PensionNewTest", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToPensionMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationUNPBenefit(false);
    let paymentId = await pensionTransactionPage.paymentView();
    let paymentTransactionId = paymentId!.split(":")[1];
    await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);

})

test(fundName() + "-TTR RLO Commutation - Partial @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToTTRMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationRolloverOut(false);
    await pensionTransactionPage.paymentView();
    await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, membersId);
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await pensionTransactionPage.memberStatus();
})

test(fundName() + "-ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.commutationUNPBenefitReject(false);
})

test(fundName() + "-ABP Rollover Out Commutation - Full exit @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToPensionMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationRolloverOut(true);
    await pensionTransactionPage.paymentView();
    await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, membersId);
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await pensionTransactionPage.memberStatus();

})

test(fundName() + "-ABP UNP Commutation - Full Exit @commutation", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToPensionMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationUNPBenefit(true);
    let paymentId = await pensionTransactionPage.paymentView();
    let paymentTransactionId = paymentId!.split(":")[1];
    await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await pensionTransactionPage.memberStatus();

})

test(fundName() + "-TTR RLO Commutation - Full Exit @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi }) => {
    await navBar.navigateToTTRMembersPage();
    let memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    let membersId = memberId.linearId.id;
    await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
    await pensionTransactionPage.investementBalances();
    await pensionTransactionPage.commutationRolloverOut(true);
    let paymentId = await pensionTransactionPage.paymentView();
    let paymentTransactionId = paymentId!.split(":")[1];
    await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
    await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, membersId);
    await pensionTransactionPage.unitPriceValidation();
    await MemberApiHandler.fetchMemberSummary(apiRequestContext, membersId);
    await ShellAccountCreationApiHandler.getMemberFee(transactionApi, membersId);
    await pensionTransactionPage.memberStatus();
})

test(fundName() + "-ABP Death Benefit Payment @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
        await pensionTransactionPage.deathBenefitTransaction();
    } catch (error) {
        throw error
    }
})

test(fundName() + "-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToTTRMembersPage();
    await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.commutationRolloverOutTTR(false);
})

test(fundName() + "-ABP Pension commencement WITH PTB @pension", async ({ navBar, memberPage, accountInfoPage, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
    })
    let linearId: string | undefined;
    await test.step("Create Shell Account for same Member & add PTB", async () => {
        await pensionAccountPage.createShellAccountExistingMember(createMemberNo!);
        let memberCreated  = await pensionAccountPage.getMemberId();
        const memberId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberCreated!)
        linearId = memberId.id;
    })
    await test.step("Select the Accumulation Member", async () => {
        await pensionAccountPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
    })

    await test.step("Navigate to ABP Screen", async () => {
            await pensionAccountPage.retirement()
    })

    await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
        await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionTransactionPage.transactionView();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(5000)
    })
    await test.step("commence pension & validate member is active", async () => {
        await MemberApiHandler.ptbTransactions(apiRequestContext, linearId!);
        await pensionTransactionPage.pensionCommence();
        
        await pensionTransactionPage.memberStatus();
    })
    await test.step("Validate balance from investment and balance & Correpondence payload is generated", async () => {
        await pensionTransactionPage.investementBalances();
        await pensionTransactionPage.memberTransactionTab.click();
        await pensionTransactionPage.componentsValidation();
    })
    await test.step("Validate Pension Commencement & Investment Switch status", async () =>{
        await pensionTransactionPage.InvestmentSwitchTransactionStatus();
    })
})

test(fundName() + "Verify the updating of member's CRN in the account details @pension", async ({ navBar, accountInfoPage, memberPage, apiRequestContext, internalTransferPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    const { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
    await navBar.selectMember(createMemberNo);
    await accountInfoPage.updateCRN();
})