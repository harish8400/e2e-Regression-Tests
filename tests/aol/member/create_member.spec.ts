import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";
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

/**This test performs member creation tests */
test(fundName()+"-Verify a new Active Member Account is created successfully and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify new member creation without TFN and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify creation of a new active member account with Date Joined Fund date earlier than current system date is successful", async ({ memberPage, navBar }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true, true, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
    } catch (error) {
        throw error;
    }
})


test(fundName() + "-Verify creation of a new active member account@API-accumulation", async ({ navBar, accountInfoPage }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        const apiRequestContext: APIRequestContext = await initDltaApiContext();
        let { memberNo, fundProductId } = await MemberApiHandler.createMember(apiRequestContext);
        console.log(`Created member with memberNo: ${memberNo} and fundProductId: ${fundProductId}`);
        await navBar.selectMember(memberNo);
        await accountInfoPage.accountInfoTab();
        //await memberPage.verifyIfWelcomeLetterTriggered();

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