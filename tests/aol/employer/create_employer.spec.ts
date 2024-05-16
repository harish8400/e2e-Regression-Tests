import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { expect } from "@playwright/test";
import { UtilsAOL, fundName } from "../../../src/aol/utils_aol";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Verify if new employer ABN is created successfully @employer", async ({ employerIdentitiesPage }) => {

    await test.step("Navigate to Employer Identities page", async () => {
        await employerIdentitiesPage.employerIdentities();
    })

    await test.step("Click on Add new Employers", async () => {
        await employerIdentitiesPage.newEmployer();
    })

    await test.step("Enter the required member details and Click on Save Button", async () => {
        await employerIdentitiesPage.createNewEmployer();
    })

    await test.step("Verify new employer created on Employer Page", async () => {
        await employerIdentitiesPage.createNewEmployerValidations();
    })
})

test(fundName() + "Verify if new employer WPN is created successfully @employer", async ({ employerIdentitiesPage }) => {
   
    await test.step("Navigate to Employer Identities page", async () => {
        await employerIdentitiesPage.employerIdentities();
    })

    await test.step("Click on Add new Employers", async () => {
        await employerIdentitiesPage.newEmployer();
    })

    await test.step("Enter the required member details and Click on Save Button", async () => {
        await employerIdentitiesPage.createNewEmployerWPN();
    })

    await test.step("Verify new employer created on Employer Page", async () => {
        await employerIdentitiesPage.createNewEmployerWPNValidations();
    })
})

test(fundName() + "-Verify for new employer Contact Details are added successfully @employer", async ({ employerIdentitiesPage }) => {

    await test.step("Click on Add new Employers", async () => {
        await employerIdentitiesPage.employerIdentities();
        await employerIdentitiesPage.newEmployer();
    })

    await test.step("Add new employer Contact Details", async () => {
        await employerIdentitiesPage.addContactDetails();
    })

    await test.step("Verify new employer Contact Details", async () => {
        await employerIdentitiesPage.addContactDetailsValidation();
    })
})

test(fundName() +"Verify existing employer data can be edited successfully @employer", async ({ employerIdentitiesPage }) => {

    await test.step("Navigate to Employer Identities page", async () => {
        await employerIdentitiesPage.employerIdentities();
        await employerIdentitiesPage.newEmployer();
    })

    await test.step("- Existing employer", async () => {
        await employerIdentitiesPage.updateExistingEmployer(false);
    })
})    

test(fundName() + "-Verify if error is displayed on empty create employer request @employer", async ({ employerIdentitiesPage }) => {

        await test.step("Click on Add new Employers", async () => {
            await employerIdentitiesPage.validateInvalidEmployerCreation();
        });

})