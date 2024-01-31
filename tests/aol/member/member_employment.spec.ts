import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import * as memberData from "../../../src/aol/data/pension_data.json";

test.beforeEach(async ({ }) => {
    test.setTimeout(600000);
});

/**This test performs Employment Termination  tests */
test("Verify an employment termination at current system date is processed successfully.", async ({ loginPage,navBar,memberTransactionPage  }) => {


    await allure.suite("Member");

    test.setTimeout(600000);

    try { 
        //await loginPage.navigateTo();
        //await loginPage.doLogin("admin@tinasuper.com","tinaArena");
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember("AE-10006"); 
        await memberTransactionPage.employmentTerminationForCurrentDate();

    } catch (error) {
        throw error;
    }
})
test("Verify an employment termination with effective date earlier than current system date is processed successfully.", async ({ loginPage,navBar,memberTransactionPage  }) => {


    await allure.suite("Member");

    test.setTimeout(600000);

    try { 
        //await loginPage.navigateTo();
        //await loginPage.doLogin("admin@tinasuper.com","tinaArena");
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember("AE-10006"); 
        await memberTransactionPage.employmentTerminationForEarlierDate("18/01/2024");

    } catch (error) {
        throw error;
    }
})
test("Verify a new pension membership account creation, then alter the beneficiary details while membership is in both Provisional then Active status.", async ({ loginPage,navBar,memberTransactionPage,beneficiaryPage  }) => {


    await allure.suite("Member");

    test.setTimeout(600000);

    try { 
        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        await memberTransactionPage.trasitionToRetirement();
        await navBar.selectMember("9020227");
        await beneficiaryPage.reltionShipButton();
        await beneficiaryPage.beneficiaryInputFileds();
    } catch (error) {
        throw error;
    }
})

