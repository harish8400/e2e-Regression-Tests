import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import data from "../../../data/aol_test_data.json"
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";

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

test(fundName() + "-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ navBar, globalPage, accountInfoPage, apiRequestContext, internalTransferPage, memberPage, pensionAccountPage }) => {

    let membersId: string | undefined;

    //when api is set to true, we will use new member creation for testing.

    if (data.generate_test_data_from_api) {

        // Create New Accumulation Account
        await test.step("Create New Pension Shell Account", async () => {
            const memberId = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            membersId = memberId.createMemberNo
            await globalPage.captureScreenshot('Accumulation Account Creation');
        });

        //When api is set to false we will Exsisting member for testing.

    } else {

        // Select Existing Accumulation Member
        const memberNo = data.members.Accumulation_member;
        await test.step("Select the Exsisting Accumulation Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Accumulation Member Selection page');
        });

    }

    const getMemberId = () => membersId;
    await test.step("Create Shell Account for same Member", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionAccountPage.createShellAccountExistingMember(memberId!, true);
            await globalPage.captureScreenshot('Shell Account Creation for same Member');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    
    });

})

test(fundName() + "-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar, globalPage, pensionAccountPage, memberPage, accountInfoPage, apiRequestContext, internalTransferPage }) => {

    let membersId: string | undefined;

    //when api is set to true, we will use new member creation for testing.

    if (data.generate_test_data_from_api) {

        // Create New Accumulation Account
        await test.step("Create New Pension Shell Account", async () => {
            const memberId = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            membersId = memberId.createMemberNo
            await globalPage.captureScreenshot('Accumulation Account Creation');
        });

        //When api is set to false we will Exsisting member for testing.

    } else {

        // Select Existing Accumulation Member
        const memberNo = data.members.Accumulation_member;
        await test.step("Select the Exsisting Accumulation Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Accumulation Member Selection page');
        });

    }

const getMemberId = () => membersId;
    await test.step("Create Shell Account for same Member", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionAccountPage.createShellAccountExistingMember(memberId!, true);
            await globalPage.captureScreenshot('Shell Account Creation for same Member');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    
    });
})
