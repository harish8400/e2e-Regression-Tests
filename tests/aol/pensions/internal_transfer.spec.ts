import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as memberData from "../../../src/aol/data/pension_data.json";
//import { Admins } from "../../../src/aol/data/admins";
//import { LoginPage } from "../../../src/adviser_online/pom/login_page";

test.beforeEach(async ({ }) => {
    test.setTimeout(60000);
});


test("Internal Transfer from Accumulation to TTR", async ({ navBar , internalTransferPage }) => {
    
    try {
        await allure.suite("Internal Transfer");
        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();
        let member = memberData.pension.Internal_Transfer_Accumulation_Destination_Account;
        await navBar.selectMember(member);
        await internalTransferPage.transferFromAccumulationToRetirement();
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Internal Transfer from Accumulation to TTR has failed" });
    }
    
})

test("Internal Transfer from TTR to Accumulation", async ({ navBar , internalTransferPage }) => {
    
    try {
        await allure.suite("Internal Transfer");
        await navBar.selectProduct();
        internalTransferPage.sleep(3000);
        await internalTransferPage.AccumulationProduct.click();
        internalTransferPage.sleep(3000);
        await internalTransferPage.AccumulationMembers.click();
        let member = memberData.pension.Internal_Transfer_Accumulation_Destination_Account;
        await navBar.selectMember(member);
        await internalTransferPage.transferFromAccumulationToRetirement();
        console.log("Test Execution Completed: Internal Transfer from Accumulation to TTR is successful");
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Internal Transfer from Accumulation to TTR has failed" });
    }
    
})