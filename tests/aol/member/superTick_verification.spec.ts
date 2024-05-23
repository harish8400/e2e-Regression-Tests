import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import * as member from "../../../src/aol/data/member.json"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("SuperTick");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Verify Super Tick status is Matched for an Active Super member when a valid TFN is updated for the member @superTick", async ({ navBar, memberOverviewpage, relatedInformationPage ,memberApi,accountInfoPage}) => {       
    // let { memberNo ,processId} = await AccumulationMemberApiHandler.createMember(memberApi);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi,processId);
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await AccumulationMemberApiHandler.approveProcess(memberApi,caseGroupId!);

    let memberNo = member.memberID;
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMember(memberNo);
    await memberOverviewpage.superTickVerification();
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMember(memberNo);
    await relatedInformationPage.verifySuperTickStatus(true);
})

test(fundName()+"Verify that for a member with 'Provisional' status No super tick call is made. @superTick", async ({ navBar, memberOverviewpage, relatedInformationPage, memberApi }) => {
    let { memberNo ,processId} = await AccumulationMemberApiHandler.createMember(memberApi);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi,processId);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await AccumulationMemberApiHandler.approveProcess(memberApi,caseGroupId!);

    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMember(memberNo);
    await memberOverviewpage.superTickVerification();
    await navBar.navigateToAccumulationMembersPage();
    await navBar.selectMember(memberNo);
    await relatedInformationPage.verifySuperTickStatus(false);
})