import { aolTest as test } from "../../../src/aol/base_aol_test";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as caseManagement from '../../../src/aol/data/case_data.json';

/* Ensure that a new case can be created without being assigned to a member with possible outcome of Processing, Error, Success */
test("Verify new case creation without assigning to a member @casemanagement", async ({ dashboardPage }) => {
    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();
    let expectedOutcomes = ['Processing', 'Error', 'Success'];
    await dashboardPage.addNewCase(expectedOutcomes);
})

/* Ensure cases are correctly displayed under Open Cases tab with following tabs: Open Cases, Closed Cases, On Hold, SLA */
test("Verify that open cases are displayed correctly @casemanagement", async ({ dashboardPage }) => {
    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();
    expect(await dashboardPage.casemanagement.innerText()).toBe('Case Management');
    await dashboardPage.verifyCaseManagementTabs();
})

/* Ensure that primary statuses of the cases are: Pending, In Progress, In Review, On Hold (Open Cases) and Closed, Deleted (Closed Cases) */
test("Verify the primary statuses of open cases", async ({ dashboardPage }) => {
    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();
    await dashboardPage.verifyOpencaseStatuses({ dashboardPage });
    await dashboardPage.verifyClosedcaseStatuses({ dashboardPage });
})

/* Ensure filtering is available on Open Cases in Case Management & user can filter on multiple parameters */
test("Verify filter option on open cases", async ({ dashboardPage }) => { 
    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();

    await test.step("Verify filters", async () => { 
        await dashboardPage.clickFilter();
        const expectedFilters = caseManagement.expectedItems;
        const actualFilters = await dashboardPage.getListItemsAndHighlight();
        expect(actualFilters).toEqual(expectedFilters);
    })
    
    // verify if each filter is working 
    await test.step("Verify filter results", async () => { 
        await dashboardPage.validateMemberAccountNumberFilter({ dashboardPage });
        await dashboardPage.validateEffectiveDateFilter({ dashboardPage });
        await dashboardPage.validateMemberTobeAssignedFilter({ dashboardPage });
        await dashboardPage.validateCaseTypeFilter({ dashboardPage });
        await dashboardPage.validateCaseIdFilter({ dashboardPage });
        await dashboardPage.validateReferenceFilter({ dashboardPage });
    })
})

/* "Verify that an existing case can be updated with following:
1. assigning to a user 
2. adding notes/comments
3. adding attachments"
 */
test("Verify if existing case updated", async ({ dashboardPage }) => { 

    await test.step('Verify that an existing case can be updated by assigning to a user @casemanagement', async () => {
        await dashboardPage.open();
        await dashboardPage.clickOnFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.ToAssign);
        await dashboardPage.box_select();
        await dashboardPage.waitForTimeout(5000);
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.waitForTimeout(5000);
        const rowNumberToClick = 1;
        await dashboardPage.clickOnTableRow(rowNumberToClick);
        await dashboardPage.addCaseToAssignee();
        await dashboardPage.waitForTimeout(5000);
        const expected_activity = /Case Assigned to '.+'/;
        const activityNotes = await dashboardPage.activity_notes();
        expect(activityNotes).toMatch(expected_activity);
        
    })

    await test.step('Verify that an existing case can be updated by adding notes/comments @casemanagement', async () => {
        await dashboardPage.notes_comments();
        const expected_activity = caseManagement.Notes;
        const activityLogElement = await dashboardPage.getActivityLogElement();
        expect(activityLogElement).toMatch(expected_activity);
    })

    // await test.step('Verify that an existing case can be updated by adding attachments @casemanagement', async () => {

    //     try {
    //         // Perform the file upload
    //         await dashboardPage.attachemnts();
    //         const fileName = caseManagement.AddFile;
    //         await dashboardPage.uploadCsvFile(fileName);


    //     } catch (error) {
    //         console.error("Error:", error);

    //     }
    //     await dashboardPage.done_upload();
    // })
})

/* Ensure that user can find exact created and updated date time of a case */
test("Ensure that user can find exact created and updated date time of a case @casemanagement", async ({ dashboardPage }) => {

    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();
    await dashboardPage.verifyCreatedAndUpdatedDatetime();
})

/** Verify that adhoc case can be created and assigned to an existing member */
test("Create adhoc case and assign to user @casemanagement", async ({ dashboardPage }) => {

    await allure.suite("Case Management");

    await dashboardPage.navigateToCaseManagement();
    await dashboardPage.createShellCaseAndAsssignToUser();
    await dashboardPage.verifyCaseCloseLog();

})