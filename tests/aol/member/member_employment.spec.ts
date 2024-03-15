import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs Employment Termination  tests */
test(fundName()+"-Verify an employment termination at current system date is processed successfully.", async ({  navBar, memberTransactionPage,accountInfoPage ,memberApi}) => {
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
        await memberTransactionPage.employmentTerminationForCurrentDate();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify an employment termination with effective date earlier than current system date is processed successfully.", async ({ navBar, memberTransactionPage,accountInfoPage ,memberApi}) => {
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
        await memberTransactionPage.employmentTerminationForEarlierDate();

    } catch (error) {
        throw error;
    }
})