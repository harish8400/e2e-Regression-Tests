import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { CaseApiHandler } from "../../../src/aol_api/handler/case_api_handler";
import { CASE_NOTE } from "../../../constants";

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


test(fundName() + "-Internal Transfer Out @VG", async ({ navBar, pensionAccountPage, internalTransferPage, apiRequestContext, caseApi, processApi }) => {
  try {
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
    await navBar.navigateToPensionMembersPage();
    let { memberNo, surname } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
    let caseId = await pensionAccountPage.ProcessTab();
    let caseStatusId = caseId.replace('Copy to clipboard', '').trim();
    await MemberApiHandler.approveProcess(apiRequestContext, caseStatusId);
    await new Promise(resolve => setTimeout(resolve, 10000));
    await pensionAccountPage.reload();
    await navBar.navigateToPensionMembersPage();
    await navBar.selectMember(memberNo);
    let linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
    await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
    let { amount } = await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
    await MemberApiHandler.internalTransferOutvalidation(apiRequestContext, linearId.id, amount);
    await pensionAccountPage.reload();
    await new Promise(resolve => setTimeout(resolve, 3000));
    await internalTransferPage.internalTransferProcess(true, true);
   let Id = await internalTransferPage.ProcessTab();
   let processId = Id.replace('Copy to clipboard', '').trim();
      if (ENVIRONMENT_CONFIG.name === "dev") {
          await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, processId, CASE_NOTE.UNAUTHORISED);
          await CaseApiHandler.closeGroupWithError(processApi, linearId.id, processId)
      } else {
          //TODO check letter payload
          await CaseApiHandler.closeGroupWithSuccess(processApi, linearId.id, processId)
      }
    await new Promise(resolve => setTimeout(resolve, 10000));
    await pensionAccountPage.reload();
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMemberSurName(surname);
    await internalTransferPage.internalTransferMemberOut('ABP', memberNo);
    await internalTransferPage.memberSummary();
  } catch (error) {
    throw error;
  }
});