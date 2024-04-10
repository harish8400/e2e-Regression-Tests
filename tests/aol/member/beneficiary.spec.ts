import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import *  as data from "../../../data/aol_test_data.json"

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

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
        await beneficiaryPage.modifyMemberBeneficiary();
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


test(fundName() + "-Verify a new pension membership account creation, then alter the beneficiary details while membership is in Provisional status", async ({ navBar, beneficiaryPage, pensionTransactionPage, pensionAccountPage,  apiRequestContext }) => {
    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let memberID: string;

        if (data.generate_test_data_from_api) {
            await test.step("Add new TTR Member", async () => {
                let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext, false);
                memberID = memberData.memberNo;
            })
        }
        else {
            memberID = data.members.Modify_Beneficiary_ABP_Active_Member;
        }

        await test.step("Select the ABP Member", async () => {
            await navBar.selectMember(memberID);
        });

        await test.step("Alter Beneficiary of ABP Member", async () => {
            await beneficiaryPage.selectMemberRelationshipTab();
            await beneficiaryPage.modifyMemberBeneficiary();
        });
        
    } catch (error) {
        throw error;
    }
})

test(fundName() + "-Verify a new pension membership account creation, then alter the beneficiary details while membership is in Active status.", async ({ navBar, beneficiaryPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let memberID: string;

        if (data.generate_test_data_from_api) {
            await test.step("Add new TTR Member", async () => {
                let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                memberID = memberData.memberNo;
            })
        }
        else {
            memberID = data.members.Modify_Beneficiary_ABP_Active_Member;
        }

        await test.step("Select the ABP Member", async () => {
            await navBar.selectMember(memberID);
        });

        await test.step("Alter Beneficiary of ABP Member", async () => {
            await beneficiaryPage.selectMemberRelationshipTab();
            await beneficiaryPage.modifyMemberBeneficiary();
        });

    } catch (error) {
        throw error;
    }
})