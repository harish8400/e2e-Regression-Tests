import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"- Add new non binding nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage, memberPage ,accountInfoPage,memberApi,rollinApi,internalTransferPage,transactions,shellAccountApi}) => {

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
        let linearId =  await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi,memberNo);
        await AccumulationMemberApiHandler.createRollin(rollinApi ,linearId.id);
        await accountInfoPage.reload();
        await internalTransferPage.memberSummary();
        await AccumulationMemberApiHandler.fetchRollInDetails(transactions,linearId.id);
        await memberPage.selectMember(memberNo);
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Add new Binding lapsing nomination on an existing account with all portion matched to 100%", async ({ navBar, beneficiaryPage ,accountInfoPage,memberApi}) => {

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
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.bindinglapsingInputFileds();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100%", async ({ navBar, beneficiaryPage ,accountInfoPage,memberApi}) => {

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
        await beneficiaryPage.addNewNonBindingNominationOnExistingAccount();
        await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Verify a new pension membership account creation, then alter the beneficiary details while membership is in both Provisional then Active status.", async ({ navBar, beneficiaryPage ,memberApi,pensionAccountPage}) => {
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
        await beneficiaryPage.reltionShipButton();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})