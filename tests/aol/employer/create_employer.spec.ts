import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { expect } from "@playwright/test";
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Verify if new employer ABN is created successfully @employer", async ({ employerIdentitiesPage }) => {

    await employerIdentitiesPage.createNewEmployer();

})

test(fundName() + "-Verify if new employer WPN is created successfully @employer", async ({ employerIdentitiesPage }) => {

    await employerIdentitiesPage.createNewEmployerWPN();

})

test(fundName() + "-Verify for new employer Contact Details are added successfully @employer", async ({ employerIdentitiesPage }) => {
    
    await employerIdentitiesPage.addContactDetails();

})

test(fundName() + "-Verify existing employer data can be edited successfully @employer", async ({ employerIdentitiesPage }) => {
  
    await employerIdentitiesPage.updateExistingEmployer();

})

test(fundName() + "-Verify if error is displayed on empty create employer request @employer", async ({ employerIdentitiesPage }) => {

    await employerIdentitiesPage.validateInvalidEmployerCreation();

})