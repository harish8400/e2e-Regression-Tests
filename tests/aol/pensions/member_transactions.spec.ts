import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json"
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import pensionMember from "../../../data/aol_test_data.json"


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
    if (pensionMember.generate_test_data_from_api) {
        await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
        await pensionTransactionPage.commutationUNPBenefitReject(false);
    } else {
        // Selecting a member based on the test case
        const memberNo = pensionMember.members["ABP_UNP_Commutation_Partial_Member_Number"];
        await navBar.selectMember(memberNo);
    }
})

test(fundName() + "-ABP Rollover Out Commutation - Full exit @validation", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {
    let membersId: string | undefined;
    let userId: string | undefined;

    const captureScreenshotAndWait = async (description: string) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await globalPage.captureScreenshot(description);
    };

    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await captureScreenshotAndWait('Pensions Members page');
    });

    //when api is set to true, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {
        
        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_Full_Member_Number;
        await test.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await captureScreenshotAndWait('Pension Member Selection page');
        });

        //When api is set to false we will use new Shell account creation for testing.

    } else {
        // Create New Pension Shell Account
        await test.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await captureScreenshotAndWait('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId || userId;
    
    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await captureScreenshotAndWait('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Rollout Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(true);
        await captureScreenshotAndWait('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const paymentDetails = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await captureScreenshotAndWait('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await captureScreenshotAndWait('Unit Prices Page');
    });

    // Validate Member Fee Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await captureScreenshotAndWait('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });
});


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

test(fundName() + "-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar, pensionTransactionPage, globalPage }) => {
    let memberNo = member.memberIdUNP;
    await navBar.navigateToTTRMembersPage();
    await globalPage.captureScreenshot('TTR Member page');
    await navBar.selectMember(memberNo);
    await globalPage.captureScreenshot('TTR Member Selection');
    await pensionTransactionPage.verifyErrorMessageForMemberBalanceNotHundredPercentUNP();
    await globalPage.captureScreenshot('Error Message');

})

test(fundName() + "-ABP Pension commencement WITH PTB @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.verifyPTBtransaction(true);
    await pensionTransactionPage.pensionCommence();
})

test(fundName() + "Verify the updating of member's CRN in the account details @pension", async ({ navBar, accountInfoPage, memberPage, apiRequestContext, internalTransferPage }) => {

    await navBar.navigateToAccumulationMembersPage();
    const { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
    await navBar.selectMember(createMemberNo);
    await accountInfoPage.updateCRN();
})