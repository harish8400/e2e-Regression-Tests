import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import * as member from "../../../src/aol/data/member.json"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("SuperTick");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Verify Super Tick status is Matched for an Active Super member when a valid TFN is updated for the member @superTick", async ({ navBar, memberOverviewpage, relatedInformationPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(member.memberID);
        await memberOverviewpage.superTickVerification();
        await relatedInformationPage.verifySuperTickStatus();
        
    } catch (error) {
        throw error;
    }
})