import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import pensionMember from "../../../data/aol_test_data.json";
import * as member from "../../../src/aol/data/member.json"

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("SuperTick");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Verify Super Tick status is Matched for an Active Super member when a valid TFN is updated for the member @superTick", async ({ apiRequestContext, internalTransferPage, memberPage, navBar, memberOverviewpage, relatedInformationPage,accountInfoPage }) => {

    try {
        let createMemberNo: string | undefined;

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        if (pensionMember.generate_test_data_from_api) {

            //** create a new accumulation member with Active state if data from api is set to true */
            await test.step("Add new Accumulation Member", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
            })
        }
        else{
            //** select the existing accumulation member with Active status if data from api is set to false */
            createMemberNo = member.memberID;
            await navBar.selectMember(createMemberNo);
        }

        await test.step("do supertick call and verify supertick status is showing as 'Matched' ", async () => {
            await memberOverviewpage.superTickVerification();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
            await relatedInformationPage.verifySuperTickStatus(true);
        })
            
    } catch (error) {
        throw error;
    }
}) 

test(fundName()+"Verify that for a member with Pending status No super tick call is made. @superTick", async ({ globalPage, apiRequestContext, accountInfoPage, memberPage, navBar, memberOverviewpage, relatedInformationPage }) => {

    try {

        let createMemberNo: string | undefined;

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        if (pensionMember.generate_test_data_from_api) {

            //** create a new accumulation member with Active state if data from api is set to true */
            await test.step("Add new Accumulation Member", async () => {
                const memberData = await memberPage.createAccumulationMember(apiRequestContext, accountInfoPage, navBar);
                createMemberNo = memberData.createMemberNo;
                await globalPage.captureScreenshot('Accumulation Account Creation');
            })
        }
        else{
            //** select the existing accumulation member with Active status if data from api is set to false */
            createMemberNo = member.memberID;
            await navBar.selectMember(createMemberNo);
        }
        
        await test.step("do supertick call and verify supertick status is not showing as 'Matched' ", async () => {
            await memberOverviewpage.superTickVerification();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
            await relatedInformationPage.verifySuperTickStatus(false);
        })
        
    } catch (error) {
        throw error;
    }
})