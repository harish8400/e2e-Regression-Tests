import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { expect } from "@playwright/test";
import { UtilsAOL } from "../../../src/aol/utils_aol";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

//test("Verify if new employer is created successfully @demorun", async ({ navBar, employerPage }) => {
//       await navBar.navigateToAccumulationMembersPage();
//       await employerPage.createNewemployer();
//  })

// test("Verify if  employer details can be updated successfully @demorun", async ({ navBar, employerPage }) => {
//     await navBar.navigateToAccumulationMembersPage();
//     await employerPage.updateNewemployer();
// })

// test("Verify if newly added Employer is listed under 'select employer' option while adding a new member @demorun", async ({ navBar, employerPage }) => {
//     await navBar.navigateToAccumulationMembersPage();
//     let newEmployer = await employerPage.createNewemployer(); 
//     await navBar.navigateToAccumulationMembersPage();
//     await employerPage.verifyNewlyAddedMemberUnderSelectMemberInMemberPage(newEmployer);
// })

// test("Verify employer types available while adding employer @demorun", async ({ navBar, employerPage }) => {
//     await navBar.navigateToAccumulationMembersPage();
//     let expectedEmployerTypes: string[] = ['Participating','Associated','Non-Associated'];
//     let actualEmployerTypes = await employerPage.getEmployerTypes();
//     expect(actualEmployerTypes).toEqual(expectedEmployerTypes);
// })

test("Verify if new employer ABN is created successfully @demorun", async ({ employerIdentitiesPage }) => {

    await employerIdentitiesPage.createNewEmployer();

})

test.skip("Verify if new employer WPN is created successfully @demorun", async ({ employerIdentitiesPage }) => {

    await employerIdentitiesPage.createNewEmployerWPN();

})

test("Verify for new employer Contact Details are added successfully @demorun", async ({ employerIdentitiesPage }) => {
    
    await employerIdentitiesPage.addContactDetails();

})

test("Verify existing employer data can be edited successfully @demorun", async ({ employerIdentitiesPage }) => {
  
    await employerIdentitiesPage.updateExistingEployer();

})