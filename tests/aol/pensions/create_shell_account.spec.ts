import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import data from "../../../data/aol_test_data.json"
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";

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

test(fundName() + "-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ shellAccountApi, navBar, globalPage, accountInfoPage, apiRequestContext, internalTransferPage, memberPage, pensionAccountPage, transactionApi }) => {

    let membersId: string | undefined;

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Member Page');
    })


    //when api is set to true, we will use new member creation for testing.

    if (data.generate_test_data_from_api) {

        // Create New Accumulation Account
        await test.step("Create New Pension Shell Account", async () => {
            const memberId = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            membersId = memberId.memberNo
            await globalPage.captureScreenshot('Accumulation Account Creation');
        });

        //When api is set to false we will Exsisting member for testing.

    } else {

        // Select Existing Accumulation Member
        const memberNo = data.members.Accumulation_member;
        await test.step("Select the Exsisting Accumulation Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Accumulation Member Selection page');
        });

    }

    const getMemberId = () => membersId;
    await test.step("Create Shell Account for same Member", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionAccountPage.createShellAccountExistingMember();
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }

    });

    // Validate MAAS Submit Report
    await test.step("Validate MAAS Submit Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Submit Report.");
        }
    });


})

test(fundName() + "-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar, globalPage, pensionAccountPage, memberPage, accountInfoPage, apiRequestContext, internalTransferPage, transactionApi, shellAccountApi }) => {

    let membersId: string | undefined;

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Member Page');
    })


    //when api is set to true, we will use new member creation for testing.
    let memberNo: string;

    if (data.generate_test_data_from_api) {

        // Create New Accumulation Account
        await test.step("Create New Pension Shell Account", async () => {
            const memberId = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            membersId = memberId.memberNo
            await globalPage.captureScreenshot('Accumulation Account Creation');
        });

        //When api is set to false we will Exsisting member for testing.

    } else {

        // Select Existing Accumulation Member
        memberNo = data.members.Capturing_Beneficiary_Accumulation_member_Internal_transfer;
        await test.step("Select the Exsisting Accumulation Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Accumulation Member Selection page');
        });

    }

    const getMemberId = () => membersId;
    await test.step("Create Shell Account for same Member", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionAccountPage.createShellAccountExistingMember(true, memberNo);
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }

    });

    // Validate MAAS Submit Report
    await test.step("Validate MAAS Submit Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
            console.log('MAAS Report:', MAASReport);
            allure.attachment('MAAS Report Data', JSON.stringify(MAASReport, null, 2), 'application/json');
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Submit Report.");
        }
    });

})
