import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { RollinApiHandler } from "../../../src/aol_api/handler/rollin_api-handler";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ navBar, pensionAccountPage, memberPage }) => {
    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await memberPage.selectMember(uniqueSurname);
})

test(fundName() + "-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar, pensionAccountPage, memberPage }) => {
    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname, true);
    await memberPage.selectMember(uniqueSurname);
})

test(fundName() + "-Pensionshell Account Creation @API-shellaccount", async ({ navBar, pensionAccountPage }) => {

    try {

        await allure.suite("Pension");
        await allure.parentSuite(process.env.PRODUCT!);
        await navBar.navigateToPensionMembersPage();
        const apiRequestContext: APIRequestContext = await initDltaApiContext();
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
         await pensionAccountPage.reload();
    } catch (error) {
        throw error;
    }
})
