import { aolTest as test } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as member from "../../../src/aol/data/member.json"
import { fundName } from "../../../src/aol/utils_aol";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

/** Test Case: Maintain Income Stream Account: Bank account details (Edit) */
test(fundName()+"- Maintain Income Stream Account (documentation required): Bank account details", async ({ navBar , accountInfoPage }) => {
    
    try {
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await accountInfoPage.editBankAccount();
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Monthly' */
test(fundName()+"- Maintain Income Steam Account - Payment details (payment amount, frequency, payment draw down options)", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails();
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details freqeuncy 'Quarterly' */
test(fundName()+"- Verify Pension Payment is executed successful for Half-yearly frequency", async ({ navBar , pensionAccountPage }) => {
    
    try {
        
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails('Bi-Annualy');
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Annually' */
test(fundName()+"- Verify Pension Payment is executed successful for Quarterly frequency", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails('Quartely');
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})
