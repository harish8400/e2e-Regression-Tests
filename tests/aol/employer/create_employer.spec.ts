import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { expect } from "@playwright/test";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("Verify if new employer is created successfully", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.createNewemployer();
})

test("Verify if  employer details can be updated successfullyd", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.updateNewemployer();
})

test("Verify if newly added Employer is listed under 'select employer' option while adding a new member", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    let newEmployer = await employerPage.createNewemployer(); 
    await navBar.navigateToAccumulationMembersPage();
    await employerPage.verifyNewlyAddedMemberUnderSelectMemberInMemberPage(newEmployer);
})

test("Verify employer types available while adding employer", async ({ navBar, employerPage }) => {
    await navBar.navigateToAccumulationMembersPage();
    let expectedEmployerTypes: string[] = ['Participating','Associated','Non-Associated'];
    let actualEmployerTypes = await employerPage.getEmployerTypes();
    expect(actualEmployerTypes).toEqual(expectedEmployerTypes);
})