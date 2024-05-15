import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import *  as data from "../../../data/aol_test_data.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"- Add new non binding nomination on an existing account with all portion matched to 100% @member", async ({ apiRequestContext, navBar, beneficiaryPage, memberPage ,accountInfoPage,internalTransferPage }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.memberNo;
        })

        await test.step("Add non binding nomination", async () => {
            await beneficiaryPage.modifyMemberBeneficiary(); 
        })
        
    } catch (error) {
        throw error;
    }
})


test(fundName()+"-Add new Binding lapsing nomination on an existing account with all portion matched to 100% @member", async ({ internalTransferPage, apiRequestContext, memberPage, navBar, beneficiaryPage ,accountInfoPage }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.memberNo;
        })

        await test.step("Add binding lapsing nomination", async () => {
            await beneficiaryPage.bindinglapsingInputFileds();
        })
        
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Non binding or Binding lapsing nomination cannot be updated if total portion is not equal to 100% @member", async ({ internalTransferPage, apiRequestContext, memberPage, navBar, beneficiaryPage ,accountInfoPage }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.memberNo;
        })

        await test.step("Add Non binding lapsing nomination", async () => {
            await beneficiaryPage.beneficiaryInputIsNotEqualToHundredPercent();
        })
        
    } catch (error) {
        throw error;
    }
})


test(fundName() + "-Verify a new pension membership account creation, then alter the beneficiary details while membership is in Provisional status @member", async ({ navBar, beneficiaryPage, pensionTransactionPage, pensionAccountPage,  apiRequestContext }) => {
    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let memberID: string;

        if (data.generate_test_data_from_api) {
            await test.step("Add new ABP Member", async () => {
                let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext, false);
                memberID = memberData.memberNo;
            })
        }
        else {
            memberID = data.members.Modify_Beneficiary_ABP_Pending_Status_Member;
            await test.step("Select the ABP Member", async () => {
                await navBar.selectMember(memberID);
            });
        }

        await test.step("Alter Beneficiary of ABP Member", async () => {
            //await beneficiaryPage.selectMemberRelationshipTab();
            await beneficiaryPage.modifyMemberBeneficiary();
        });
        
    } catch (error) {
        throw error;
    }
})

test(fundName() + "-Verify a new pension membership account creation, then alter the beneficiary details while membership is in Active status @member", async ({ navBar, beneficiaryPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let memberID: string;

        if (data.generate_test_data_from_api) {
            await test.step("Add new ABP Member", async () => {
                let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                memberID = memberData.memberNo;
            })
        }
        else {
            memberID = data.members.Modify_Beneficiary_ABP_Active_Member;
            await navBar.selectMember(memberID);
        }

        await test.step("Alter Beneficiary of ABP Member", async () => {
            //await beneficiaryPage.selectMemberRelationshipTab();
            await beneficiaryPage.modifyMemberBeneficiary();
        });

    } catch (error) {
        throw error;
    }
})