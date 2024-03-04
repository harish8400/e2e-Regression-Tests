import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("Verify if new employer is created successfully", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.createNewemployer();
})

test("Verify if  employer details can be updated successfully", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.updateNewemployer();
})

test("Verify if newly added Employer is listed under 'select employer' option while adding a new member", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.createNewemployer(); 
    await employerPage.verifyNewlyAddedMemberUnderSelectMemberInMemberPage();
})