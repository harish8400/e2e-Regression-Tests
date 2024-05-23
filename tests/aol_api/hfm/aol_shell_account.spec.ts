import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler";


export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});


test(fundName() + "-Pensionshell Account Creation @API-shellaccount", async ({ navBar, pensionAccountPage, apiRequestContext, internalTransferPage, pensionTransactionPage }) => {
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
    await navBar.navigateToPensionMembersPage();
    let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
    console.log('ProcessId:', processId);
    await pensionAccountPage.ProcessTab();
    const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
    await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await pensionAccountPage.reload();
    await navBar.navigateToPensionMembersPage();
    await navBar.selectMember(memberNo);
    let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
    await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
    await RollinApiHandler.createRollin(apiRequestContext, linearId.id)
    await pensionAccountPage.reload();
    await internalTransferPage.memberSummary();
    await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
    await pensionTransactionPage.transactionView();
})
