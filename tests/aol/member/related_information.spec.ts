import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as member from "../../../src/aol/data/member.json"

test.beforeEach(async ({ }) => {
    test.setTimeout(600000);
});

test("Set Correspondance to Inactive", async ({ navBar , relatedInformationPage }) => {
    
    try {
        await allure.suite("Pension");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID
        await navBar.selectMember(mem);
        await relatedInformationPage.editCorrespondance('Lost Member');
        console.log("Test Execution Completed: Correspondance set to Inactive");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Correspodance Status Update Failed" });
    }
    
})
