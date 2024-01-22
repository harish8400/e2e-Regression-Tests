import { aolTest as test } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
//import * as memberData from "../../../src/aol/data/pension_data.json";
import * as member from "../../../src/aol/data/member.json"


test.beforeEach(async ({ }) => {
    test.setTimeout(120000);
});

/** Test Case: Maintain Income Stream Account: Bank account details (Edit) */
test("Maintain Income Stream Account_Bank Account Details_Edit @pension", async ({ navBar , accountInfoPage }) => {
    
    try {
        await allure.suite("Bank Account Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await accountInfoPage.editBankAccount();
        console.log("Test Execution Completed: Bank Account Details are updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Maintain Income Stream Account: Bank account details (Add New) */
test("Maintain Income Stream Account_New Bank Account Details @pension", async ({ navBar , accountInfoPage }) => {
    
    try {
        await allure.suite("Bank Account Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await accountInfoPage.addNewBankAccount();
        console.log("Test Execution Completed: Bank Account Details are updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details */
test("Maintain Income Stream Account_Pension Payment Details_Edit @pension", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await allure.suite("Pension Payment Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails();
        console.log("Test Execution Completed: Bank Account Details are updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})
