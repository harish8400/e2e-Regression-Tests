import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as memberData from "../../../src/aol/data/pension_data.json";

test.beforeEach(async ({ }) => {
    test.setTimeout(600000);
});


test("Internal Transfer from Accumulation to TTR", async ({ navBar , internalTransferPage }) => {
    
    try {
        await allure.suite("Pension");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Internal_Transfer_Accumulation_To_ABP_Destination_Account;
        await navBar.selectMember(member);
        await internalTransferPage.internalTransferMember('Accumulation');
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Internal Transfer from Accumulation to TTR has failed" });
    }
    
})

test("Internal Transfer from TTR to Accumulation", async ({ navBar , internalTransferPage }) => {
    
    try {
        await allure.suite("Pension");
        
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();

        let member = memberData.pension.Internal_Transfer_ABP_To_Accumulation_Destination_Account;
        await navBar.selectMember(member);
        await internalTransferPage.internalTransferMember('ABP');
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Internal Transfer from Accumulation to TTR has failed" });
    }
    
})

test("Retirement Transition process with PTB @pension", async ({ navBar , internalTransferPage, pensionTransactionPage }) => {
    
    try {
        await allure.suite("Pension");
        
        //navigating to TTR source member and verifying PTB
        await navBar.selectProduct();
        await navBar.navigateToTTRMembersPage();

        let sourceAcc = memberData.pension.Internal_Transfer_TTR_To_ABP_Source_Account;
        await navBar.selectMember(sourceAcc);
        await pensionTransactionPage.verifyPTBtransaction(true);

        //navigating to ABP destination member and initiating internal transfer from source TTR to ABP
        await navBar.navigateToPensionMembersPage();
        const destAcc = memberData.pension.Internal_Transfer_TTR_To_ABP_Destination_Account;
        await navBar.selectMember(destAcc);
        await internalTransferPage.internalTransferMember('TTR');
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (error) {
        throw error;
    }
    
})

test("Retirement Transition process with CoR and No PTB @pension", async ({ navBar , internalTransferPage, relatedInformationPage, pensionTransactionPage }) => {
    
    try {
        await allure.suite("Pension");
        
        await navBar.selectProduct();

        //navigating to TTR source member and adding condition of release
        await navBar.navigateToTTRMembersPage();
        const sourceMember = memberData.pension.Internal_Transfer_TTR_To_ABP_Source_Account;
        await navBar.selectMember(sourceMember);
        await pensionTransactionPage.verifyPTBtransaction(false);
        await relatedInformationPage.addConditionOfRelease();

        //navigating to ABP destination member and initiating internal transfer from source TTR to ABP
        await navBar.navigateToPensionMembersPage();
        const destMember = memberData.pension.Internal_Transfer_TTR_To_ABP_Destination_Account;
        await navBar.selectMember(destMember);
        await internalTransferPage.internalTransferMember('TTR');
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (error) {
        throw error;
    }
    
})