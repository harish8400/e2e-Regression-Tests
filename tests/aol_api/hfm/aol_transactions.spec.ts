import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";
import { CaseApiHandler } from "../../../src/aol_api/handler/case_api_handler";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { FUND } from "../../../constants";

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



test(fundName() + "-commutation Payment Full Exit @API-payment", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext ,processApi}) => {
    try {

        await navBar.navigateToPensionMembersPage();
        let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
        let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
        let { amount } = await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await MemberApiHandler.validateCommutation(apiRequestContext, linearId.id, amount);
        await pensionAccountPage.reload();
        await MemberApiHandler.rpbpPayments(apiRequestContext, linearId.id);
        await pensionTransactionPage.commutationUNPBenefit(true);
        if (ENVIRONMENT_CONFIG.name === "dev" && process.env.PRODUCT !== FUND.HESTA) {
            await CaseApiHandler.closeGroupWithError(processApi, linearId.id, caseGroupId);
        } else {
            await CaseApiHandler.closeGroupWithSuccess(processApi, linearId.id, caseGroupId);
        }
        let paymentId = await pensionTransactionPage.paymentView();
        let paymentTransactionId = paymentId!.split(":")[1];
        await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());


    } catch (error) {
        throw error;
    }
})


test(fundName() + "-commutation Rollout Full Exit @API-rollout", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext ,processApi }) => {
    try {
        await allure.suite("Pension");
        await allure.parentSuite(process.env.PRODUCT!);
        await navBar.navigateToPensionMembersPage();
        let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
        let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
        await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        await MemberApiHandler.validateCommutation(apiRequestContext, linearId.id);
        await pensionAccountPage.reload();
        await MemberApiHandler.rpbpPayments(apiRequestContext, linearId.id);
        let { id, fundName, tfn, givenName, dob } = await MemberApiHandler.getMemberDetails(apiRequestContext, linearId.id);
        if (id) {
            await MemberApiHandler.memberIdentity(apiRequestContext, id, { tfn, dob, givenName, fundName });
        }

        await pensionTransactionPage.commutationRolloverOut(true);
        if (ENVIRONMENT_CONFIG.name === "dev" && process.env.PRODUCT !== FUND.HESTA) {
            await CaseApiHandler.closeGroupWithError(processApi, linearId.id, caseGroupId);
        } else {
            await CaseApiHandler.closeGroupWithSuccess(processApi, linearId.id, caseGroupId);
        }
        await pensionTransactionPage.paymentView();
    } catch (error) {
        throw error;
    }
})