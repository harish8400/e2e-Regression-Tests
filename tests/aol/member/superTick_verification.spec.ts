import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("SuperTick");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Verify Super Tick status is Matched for an Active Super member when a valid TFN is updated for the member @superTick", async ({ navBar, memberOverviewpage, relatedInformationPage ,memberApi,accountInfoPage}) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        let { memberNo ,processId} = await AccumulationMemberApiHandler.createMember(memberApi);
        await accountInfoPage.ProcessTab();
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi,processId);
        await AccumulationMemberApiHandler.approveProcess(memberApi,caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await accountInfoPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(memberNo);
        await memberOverviewpage.superTickVerification();
        await relatedInformationPage.verifySuperTickStatus();
        
    } catch (error) {
        throw error;
    }
})