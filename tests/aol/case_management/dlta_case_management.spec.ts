import { aolTest as test } from "../../../src/aol/base_aol_test";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as caseManagement from '../../../src/aol/data/case_data.json';
import { AssertionError } from "assert";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
});

test("Test @prodtest",async () => {
    let prod = process.env.PRODUCT;
    console.log(prod);
})

/* Ensure that a new case can be created without being assigned to a member with possible outcome of Processing, Error, Success */
test("Verify new case creation without assigning to a member @casemanagement", async ({ dashboardPage }) => {
    try {
        let prod = process.env.PRODUCTS;

        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        let expectedOutcomes = ['Processing', 'Error', 'Success'];
        // Add new case and verify outcome
        await dashboardPage.addNewCase(expectedOutcomes);

        console.log('Test Execution Success : Verify new case creation without assigning to a member ')
        
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : New case creation without assigning to a member has failed" });
    }
})

/** Verify that adhoc case can be created and assigned to an existing member */
test("Create adhoc case and assign to user @casemanagement", async ({ dashboardPage }) => {

    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        //Create shell case and assign to a user
        await dashboardPage.createShellCaseAndAsssignToUser();
        //Verify log of username, date and time when case is closed
        await dashboardPage.verifyCaseCloseLog();

        console.log('Test Execution Success : Ensure adhoc case can be created and assigned to an existing member')
        
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Create adhoc case and assign to user has failed" });
    }
})

/* Ensure that user can find exact created and updated date time of a case */
test("Ensure that user can find exact created and updated date time of a case @casemanagement", async ({ dashboardPage }) => {

    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        await dashboardPage.verifyCreatedAndUpdatedDatetime();
        console.log('Test Execution Success : Ensure that user can find exact created and updated date time of a case')

    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Ensure that user can find exact created and updated date time of a case has failed" });
    }

})

/* Ensure that primary statuses of the cases are: Pending, In Progress, In Review, On Hold (Open Cases) and Closed, Deleted (Closed Cases) */
test("Verify the primary statuses of open cases @casemanagement", async ({ dashboardPage }) => {
    
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        await dashboardPage.verifyOpencaseStatuses({ dashboardPage });
        await dashboardPage.verifyClosedcaseStatuses({ dashboardPage });

        console.log('Test Execution Success : Verifying the primary statuses of open cases')

    } catch (error) {
        throw new AssertionError({message: "Test Execution Failed : Verifying primary status of cases has failed"});
    }
})

/* Ensure cases are correctly displayed under Open Cases tab with following tabs: Open Cases, Closed Cases, On Hold, SLA */
test("Verify that open cases are displayed correctly @casemanagement", async ({ dashboardPage }) => {
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();
        expect(await dashboardPage.casemanagement.innerText()).toBe('Case Management');
        await dashboardPage.verifyCaseManagementTabs();

        console.log('Test Execution Success : Verifying that open cases are displayed correctly')

    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Verifying cases displayed under open case tab has failed" });
    }
})

/* Ensure filtering is available on Open Cases in Case Management & user can filter on multiple parameters */
test("Verify filter option on open cases @casemanagement", async ({ dashboardPage }) => { 
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();

        // verify if all filters are displayed correctly
        await test.step("Verify filters", async () => {
            await dashboardPage.clickFilter();
            const expectedFilters = caseManagement.expectedItems;
            const actualFilters = await dashboardPage.getListItemsAndHighlight();
            expect(actualFilters).toEqual(expectedFilters);
        })

        // verify if all filters are filtering results correctly 
        await test.step("Verify filter results", async () => {
            await dashboardPage.validateMemberAccountNumberFilter({ dashboardPage });
            await dashboardPage.validateEffectiveDateFilter({ dashboardPage });
            await dashboardPage.validateMemberTobeAssignedFilter({ dashboardPage });
            await dashboardPage.validateCaseTypeFilter({ dashboardPage });
            await dashboardPage.validateCaseIdFilter({ dashboardPage });
            await dashboardPage.validateReferenceFilter({ dashboardPage });
        })

        console.log('Test Execution Success : Verify filter option on open cases')
        
    } catch (error) {
        throw new AssertionError({ message: "Test Execution Failed : Verifying filter option on open cases has failed" });
    }
})

test("Verify that an existing case can be updated by assigning to a user @casemanagement", async ({ dashboardPage }) => { 
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();

        //await dashboardPage.open();
        await dashboardPage.clickOnFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.ToAssign);
        await dashboardPage.box_select();
        await dashboardPage.sleep(2000);
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.sleep(2000);
        const rowNumberToClick = 1;
        await dashboardPage.clickOnTableRow(rowNumberToClick);

        await dashboardPage.addCaseToAssignee();
        await dashboardPage.sleep(2000);
        const expected_activity = /Case Assigned to '.+'/;
        const activityNotes = await dashboardPage.activity_notes();
        expect(activityNotes).toMatch(expected_activity);

        console.log('Test Execution Success : Verify that an existing case can be updated by assigning to a user')

    } catch (error) {
        console.log('Test Execution Failed : Verify that an existing case can be updated by assigning to a user')
    }
})

test("Verify that an existing case can be updated by adding notes/comments @casemanagement", async ({ dashboardPage }) => { 
    try {
        await allure.suite("Case Management");

        //await dashboardPage.navigateToCaseManagement();

        await dashboardPage.clickOnFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.ToAssign);
        await dashboardPage.box_select();
        await dashboardPage.sleep(2000);
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.sleep(2000);
        const rowNumberToClick = 1;
        await dashboardPage.clickOnTableRow(rowNumberToClick);

        await dashboardPage.addNotes();

        console.log('Test Execution Success : Verify that an existing case can be updated by adding notes/comments')

    } catch (error) {
        console.log('Test Execution Failed : Verify that an existing case can be updated by adding notes/comments')
    }
})

test("Verify if existing case can be updated by adding attachment", async ({ dashboardPage }) => { 

    try {

        await allure.suite("Case Management");
        //await dashboardPage.navigateToCaseManagement();

        await dashboardPage.clickOnFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.ToAssign);
        await dashboardPage.box_select();
        await dashboardPage.sleep(2000);
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.sleep(2000);
        const rowNumberToClick = 2;
        await dashboardPage.clickOnTableRow(rowNumberToClick);

        // Perform the file upload
        await dashboardPage.uploadFileCaseManagement();

    } catch (error) {
        console.log('Test Execution Failed : Verify that an existing case can be updated by adding attachments')

    }
})
