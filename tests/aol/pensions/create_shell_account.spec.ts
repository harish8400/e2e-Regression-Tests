import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import member from "../../../data/aol_test_data.json"

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

test(fundName() + "-Create a Pension Shell ABP account - Reached age 65 @pension", async ({ navBar, pensionAccountPage, globalPage }) => {

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Member page');
    })


    await test.step("Select the Exsisting Accumulation Member", async () => {
        const memberNo = member.members.Accumulation_member;
        await navBar.selectMember(memberNo);
        await globalPage.captureScreenshot('Exsisting Accumulation Member');

    })
    await test.step("Create shell account for the accumulation member", async () => {
        await pensionAccountPage.createShellAccountExistingMember();
        await globalPage.captureScreenshot('Same Member Shell Account Creation');
    })


})

test(fundName() + "-Capturing Reversionary and/or beneficiary details while creating a ABP/TTR pension member", async ({ navBar, globalPage, pensionAccountPage }) => {

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Member page');
    })


    await test.step("Select the Exsisting Accumulation Member", async () => {
        const memberNo = member.members.Accumulation_member;
        await navBar.selectMember(memberNo);
        await globalPage.captureScreenshot('Exsisting Accumulation Member');

    })

    await test.step("Create shell account for the accumulation member", async () => {
        await pensionAccountPage.createShellAccountExistingMember(true);
        await globalPage.captureScreenshot('Same Member Shell Account Creation');
    })
})
