import { aolTest as test } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as member from "../../../src/aol/data/member.json"
import { fundName } from "../../../src/aol/utils_aol";


test.beforeEach(async ({ }) => {
    test.setTimeout(120000);
});

/** Test Case: Maintain Income Stream Account: Bank account details (Edit) */
test(fundName()+"-Maintain Income Stream Account_Bank Account Details_Edit @pension", async ({ navBar , accountInfoPage }) => {
    
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
test(fundName()+"-Maintain Income Stream Account_New Bank Account Details @pension", async ({ navBar , accountInfoPage }) => {
    
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

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Monthly' */
test(fundName()+"-Maintain Income Stream Account_Pension Payment Details_Edit Frequency 'Monthly' @pension", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await allure.suite("Pension Payment Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails('Monthly');
        console.log("Test Execution Completed: pension payment details updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details freqeuncy 'Quarterly' */
test(fundName()+"-Maintain Income Stream Account_Pension Payment Details_Edit Frequency 'Quarterly' @pension", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await allure.suite("Pension Payment Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails('Quarterly');
        console.log("Test Execution Completed: pension payment details updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Annually' */
test(fundName()+"-Maintain Income Stream Account_Pension Payment Details_Edit Frequency 'Annually' @pension", async ({ navBar , pensionAccountPage }) => {
    
    try {
        await allure.suite("Pension Payment Details");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let mem = member.memberID;
        await navBar.selectMember(mem);
        await pensionAccountPage.editPaymentDetails('Annually');
        console.log("Test Execution Completed: pension payment details updated successfully");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Updating Bank Account Details has been failed" });
    }
    
})
