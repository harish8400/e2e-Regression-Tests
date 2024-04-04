import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler";

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


test(fundName() + "-Internal Transfer Out @VG", async ({ navBar, pensionAccountPage, internalTransferPage, apiRequestContext  ,pensionTransactionPage}) => {
  try {
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
    await navBar.navigateToPensionMembersPage();
    let { memberNo, processId, surname } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
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
    await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
    await MemberApiHandler.internalTransferOutvalidation(apiRequestContext, linearId.id, amount)
    await pensionAccountPage.reload();
    await new Promise(resolve => setTimeout(resolve, 5000));
    await internalTransferPage.accumulationAccountCreation(true, false);
    let Id = await internalTransferPage.ProcessTab();
    Id.replace('Copy to clipboard', '').trim();
    await internalTransferPage.vanguard();
    await new Promise(resolve => setTimeout(resolve, 10000));
    await pensionAccountPage.reload();
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMemberSurName(surname);
    await internalTransferPage.internalTransferMemberOut('ABP', memberNo);
    await pensionTransactionPage.transactionView();
  } catch (error) {
    throw error;
  }
});