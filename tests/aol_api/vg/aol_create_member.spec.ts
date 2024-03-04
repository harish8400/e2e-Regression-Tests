import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
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



test(fundName() + "-Verify creation of a new active member account@VG-accumulation", async ({ navBar, accountInfoPage ,apiRequestContext,caseApi,processApi}) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let { memberNo, fundProductId ,memberId } = await MemberApiHandler.createMember(apiRequestContext);
        console.log(`Created member with memberNo: ${memberNo} and fundProductId: ${fundProductId}`);
        let Id = await accountInfoPage.ProcessTab();
        let processId = Id.replace('Copy to clipboard', '').trim();
        await MemberApiHandler.approveProcess(apiRequestContext,processId!);
        if (ENVIRONMENT_CONFIG.name === "dev") {
            await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, processId, CASE_NOTE.UNAUTHORISED);
            await CaseApiHandler.closeGroupWithError(processApi, memberId, processId)
        } else {
            //TODO check letter payload
            await CaseApiHandler.closeGroupWithSuccess(processApi, memberId, processId)
        }
        let linearId =  await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await accountInfoPage.reload();

    } catch (error) {
        throw error;
    }

})