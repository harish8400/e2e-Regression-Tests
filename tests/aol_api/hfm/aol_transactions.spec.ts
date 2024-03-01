import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";

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



test(fundName() + "-commutation Payment Full Exit @API-payment", async ({ navBar, pensionTransactionPage, pensionAccountPage,apiRequestContext }) => {
    try {

        await navBar.navigateToPensionMembersPage();
        let { memberNo } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        let caseId = await pensionAccountPage.ProcessTab();
        let caseGroupId = caseId.replace('Copy to clipboard', '').trim();
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
        let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
        let {amount} = await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await MemberApiHandler.validateCommutation(apiRequestContext, linearId.id, amount);
        await pensionAccountPage.reload();
        await MemberApiHandler.rpbpPayments(apiRequestContext, linearId.id);
        await pensionTransactionPage.commutationUNPBenefit(true);
        let paymentId = await pensionTransactionPage.paymentView();
        let paymentTransactionId = paymentId!.split(":")[1];
        await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
    } catch (error) {
        throw error;
    }
})

test(fundName() + "-commutation RollOut Full Exit @API-Rollout", async ({ navBar, pensionTransactionPage, pensionAccountPage,apiRequestContext }) => {
    try {
        await allure.suite("Pension");
        await allure.parentSuite(process.env.PRODUCT!);
        await navBar.navigateToPensionMembersPage();
        let { memberNo } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        let caseId = await pensionAccountPage.ProcessTab();
        let caseGroupId = caseId.replace('Copy to clipboard', '').trim();
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
        let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
        await RollinApiHandler.createRollin(apiRequestContext, linearId.id)
        await MemberApiHandler.validateCommutation(apiRequestContext, linearId.id);
        await pensionAccountPage.reload();
        await MemberApiHandler.rpbpPayments(apiRequestContext, linearId.id);
        await MemberApiHandler.getMemberDetails(apiRequestContext, linearId.id)
            .then(async (linearIdDetails) => {
                if (linearIdDetails.id) {
                    console.log('fundName:', linearIdDetails.fundName, linearIdDetails.tfn);
                    return MemberApiHandler.memberIdentity(apiRequestContext, linearId.id, {
                        tfn: linearIdDetails.tfn,
                        dob: linearIdDetails.dob,
                        givenName: linearIdDetails.givenName,
                        fundName: linearIdDetails.fundName,
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                throw error;
            });
        await pensionTransactionPage.commutationRolloverOut(true);
        await pensionTransactionPage.paymentView();
    } catch (error) {
        throw error;
    }
})