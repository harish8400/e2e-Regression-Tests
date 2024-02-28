import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});



test(fundName() + "-Verify creation of a new active member account@Hesta-accumulation", async ({ navBar, accountInfoPage }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        const apiRequestContext: APIRequestContext = await initDltaApiContext();
        let { memberNo, fundProductId } = await MemberApiHandler.createMember(apiRequestContext);
        console.log(`Created member with memberNo: ${memberNo} and fundProductId: ${fundProductId}`);
        await navBar.selectMember(memberNo);
        let caseId = await accountInfoPage.accountInfoTab();
        let caseGroupId = caseId!.trim();
        await MemberApiHandler.approveProcess(apiRequestContext,caseGroupId!);
        let linearId =  await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
        await accountInfoPage.reload();

    } catch (error) {
        throw error;
    }

})