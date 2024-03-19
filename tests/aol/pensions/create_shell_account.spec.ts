import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";

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

test(fundName() + "-Create a Pension Shell ABP account - Reached age 65 @pension", async ({navBar,apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
    	await new Promise(resolve => setTimeout(resolve, 5000));
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
//approve the process
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await navBar.selectMember(memberNo);

        
})

test(fundName() + "-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar,apiRequestContext  }) => {
    await navBar.navigateToPensionMembersPage();
    let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
    	await new Promise(resolve => setTimeout(resolve, 5000));
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
//approve the process
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await navBar.selectMember(memberNo);
})
