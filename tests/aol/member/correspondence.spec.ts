import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import * as member from "../../../src/aol/data/member.json"
import { fundName } from "../../../src/aol/utils_aol";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
        
});

test(fundName()+"-Stop Correspondence", async ({ navBar , relatedInformationPage }) => {
    
    try {
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID
        await navBar.selectMember(mem);
        await relatedInformationPage.editCorrespondence('Lost Member');
    } catch (error) {
        throw error;
    }
    
})
