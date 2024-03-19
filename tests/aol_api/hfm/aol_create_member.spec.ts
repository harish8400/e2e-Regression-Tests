import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler";


export const test = base.extend<{apiRequestContext: APIRequestContext;}>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});



test(fundName() + "-Verify creation of a new active member account@accumulation", async ({ navBar, apiRequestContext,accountInfoPage ,internalTransferPage,pensionTransactionPage}) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let { memberNo ,processId} = await MemberApiHandler.createMember(apiRequestContext);
        await accountInfoPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext,caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await accountInfoPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(memberNo);
        let linearId =  await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await accountInfoPage.reload();
        await internalTransferPage.memberSummary();
        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        await pensionTransactionPage.transactionView();

    } catch (error) {
        throw error;
    }

})