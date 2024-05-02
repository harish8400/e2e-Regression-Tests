import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import * as memberData from "../../../src/aol/data/member.json";
import { APIRequestContext } from "playwright";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import pensionMember from "../../../data/aol_test_data.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Switch");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+" Verify Combined switch is processed successfully for a member with 1 single option to another single options using current date.", async ({ internalTransferPage, apiRequestContext, accountInfoPage, navBar, memberPage }) => {
      
    try {
        if (pensionMember.generate_test_data_from_api) {
            await test.step("Navigate to Accumulation Members page", async () => {
                await navBar.navigateToAccumulationMembersPage();
            })
    
        let createMemberNo: string | undefined;
        
            await test.step("Add new Accumulation Member", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
            })
        }
        else{
            await test.step("Select the Accumulation Member", async () => {
                let member = memberData.Employment.EmployementTerminationMember_Hesta;
                await navBar.selectMember(member);
            })  
        }
        await test.step("Verify Combined switch is processed successfully for a member with 1 single option to another single options using current date.", async () => {
            await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToAnotherOption();
        });

    } catch (error) {
        throw error;
    } 

})

test(fundName()+" Verify Combined switch is processed successfully for a member with 1 single option to multiple option using current date.", async ({ internalTransferPage, apiRequestContext, accountInfoPage, navBar, memberPage }) => {
    try {
        if (pensionMember.generate_test_data_from_api) {
                await test.step("Navigate to Accumulation Members page", async () => {
                await navBar.navigateToAccumulationMembersPage();
            })
    
        let createMemberNo: string | undefined;
        
            await test.step("Add new Accumulation Member", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
            })
        }
        else{
            await test.step("Select the Accumulation Member", async () => {
                let member = memberData.Employment.EmployementTerminationMember_Hesta;
                await navBar.selectMember(member);
            })  
        }
        await test.step("Verify Combined Switch Processed Successfully For One SingleOption To Multiple Option", async () => {
            await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToMultipleOption();
        });

    } catch (error) {
        throw error;
    }
})

test(fundName()+" Verify Combined switch is processed successfully for a more than one option to single option using current date.", async ({ internalTransferPage, apiRequestContext, accountInfoPage, navBar, memberPage }) => {
    try {
        if (pensionMember.generate_test_data_from_api) {
            await test.step("Navigate to Accumulation Members page", async () => {
                await navBar.navigateToAccumulationMembersPage();
            })
    
        let createMemberNo: string | undefined;
        
            await test.step("Add new Accumulation Member", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
            })
        }
        else{
            await test.step("Select the Accumulation Member", async () => {
                let member = memberData.Employment.EmployementTerminationMember_Hesta;
                await navBar.selectMember(member);
            })  
        }
        await test.step("Verify Combined switch is processed successfully for a more than one option to single option using current date", async () => {
            await memberPage.verifyCombinedSwitchProcessedSuccessfullyForMoreThanOneOptionToSingleOption();
        });

    } catch (error) {
        throw error;
    }
})