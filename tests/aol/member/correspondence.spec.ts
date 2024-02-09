import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import * as member from "../../../src/aol/data/member.json"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ }) => {
    test.setTimeout(600000);
});

test(fundName()+"-Stop Correspondence", async ({ navBar , relatedInformationPage }) => {
    
    try {
        await allure.suite("Pension");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID
        await navBar.selectMember(mem);
        await relatedInformationPage.editCorrespondence('Lost Member');
        console.log("Test Execution Completed: Correspondence set to Inactive");
    } catch (error) {
        throw error;
    }
    
})
