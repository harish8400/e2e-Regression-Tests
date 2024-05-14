import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
        
});

test(fundName()+"-Stop Correspondence @pension", async ({ navBar , relatedInformationPage,memberApi,pensionAccountPage }) => {
    
    try {
        await navBar.navigateToPensionMembersPage();
        let { memberNo, processId } = await ShellAccountCreationApiHandler.createPensionShellAccount(memberApi);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await ShellAccountCreationApiHandler.getCaseGroupId(memberApi, processId);
        await ShellAccountCreationApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
        await relatedInformationPage.editCorrespondence('Lost Member');
    } catch (error) {
        throw error;
    }
    
})
