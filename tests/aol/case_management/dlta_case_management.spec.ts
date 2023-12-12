import { dltaOnlineTest as test } from "../../../src/aol/base_aol_test";
import { Admins } from "../../../src/aol/data/admins";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as caseManagement from '../../../src/aol/data/case_data.json';
import { DateUtils } from "../../../src/utils/date_utils";

test("casemanagement @casemanagement", async ({ loginPage, dashboardPage }) => {
    await allure.suite("Case Management");
    await allure.subSuite("Open Cases");

    test.setTimeout(600000);

    let admin = Admins.getAdminByUsername("admin@tinasuper.com");

    await test.step("Login", async () => {
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
    })

    await test.step('add Case', async () => {
        await allure.suite("Case Management");
        await allure.suite("Case Management");
        await allure.subSuite("Adding new case");
        await dashboardPage.addNewCase();
    })
    await test.step('Ensure that user is able to find the date and time of exactly when a case was created', async () => {
        const currentDate = new Date();
        const expectedDate = DateUtils.ddMMMyyyStringDate(currentDate);;
        const actual_date = await dashboardPage.getCreatedDate();
        expect(actual_date).toBe(expectedDate);
        
    })

    await test.step('Ensure that an existing case can be assigned to a user @casemanagement', async () => {
        await dashboardPage.clickOnClosedIcon();
        const rowNumberToClick = 1;
        await dashboardPage.clickOnTableRow(rowNumberToClick);
        await dashboardPage.addCaseToAssignee();
        await dashboardPage.waitForTimeout(5000);
        const expected_activity = /Case Assigned from '.+' to '.+'/;
        const activityNotes = await dashboardPage.activity_notes();
        expect(activityNotes).toMatch(expected_activity);
        await dashboardPage.clickOnClosedIcon();
    })


    await test.step('Ensure cases are correctly displayed under Open Cases tab @casemanagement', async () => {
        expect(await dashboardPage.casemanagement.innerText()).toBe('Case Management');
        await dashboardPage.verifyCaseManagementTabs();
        await dashboardPage.waitForTimeout(5000);
    })

    await test.step('Ensure the user can successfully filter on multiple parameters in Case Management Open Cases @casemanagement', async () => {
        await dashboardPage.clickFilter();
        await dashboardPage.waitForTimeout(5000);
        const expectedItems = caseManagement.expectedItems;
        const actualItems = await dashboardPage.getListItems();
        expect(actualItems).toEqual(expectedItems);
    })

    await test.step('Ensure that possible Outcomes for cases are: Processing, Error, Success', async () => {
        await dashboardPage.clickOnOutcomeItem(caseManagement.List_outcome);
        await dashboardPage.box_select();
        await dashboardPage.click_outcome();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        await dashboardPage.waitForTimeout(5000);
        const expectedAlertText = caseManagement.alert_outcome;
        const actualAlertText = await dashboardPage.alert_displayed();
        await dashboardPage.validateAlert(expectedAlertText, actualAlertText);
        const expectedData = caseManagement.dataExpected_outcomecase;
        await dashboardPage.verifyData(expectedData, dashboardPage);
    })
    await test.step('FilterOption:AssignedTo', async () => {
        await dashboardPage.clickFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.ToAssign);
        await dashboardPage.box_select();
        await dashboardPage.waitForTimeout(5000);
        await dashboardPage.verify_Member_TobeAssigned();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        const expectedAlertText = caseManagement.alert_assignedTo;
        const actualAlertText = await dashboardPage.alert_displayed();
        await dashboardPage.validateAlert(expectedAlertText, actualAlertText);
        const expectedData = caseManagement.AssignedTo;
        await dashboardPage.verifyData(expectedData, dashboardPage);
    })
    await test.step("Ensure that possible Outcomes for cases are: Processing, Error, Success", async () => {

        await dashboardPage.clickFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.caseType);
        await dashboardPage.click_caseType();
        await dashboardPage.waitForTimeout(5000);
        await dashboardPage.select_outcome();
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        const expectedAlertText = caseManagement.alert_outcome; // Replace with your expected alert text
        const actualAlertText = await dashboardPage.alert_displayed();
        await dashboardPage.validateAlert(expectedAlertText, actualAlertText);
        //To validate wheteher Outcome is displayed in table  
        const expectedData = caseManagement.case_type_selected; // Replace with the data you want to verify
        await dashboardPage.verifyData(expectedData, dashboardPage);
        await dashboardPage.waitForTimeout(5000);

    })
    await test.step("Ensure that primary statuses of the cases are: Pending, In Progress, In Review, On Hold (Open Cases)", async () => {
        await dashboardPage.select_status({ dashboardPage });
    })
    await test.step("Ensure that Last Updated column in case Management Open Cases correctly reflects date/time when the update was made on open case", async () => {
        await dashboardPage.clickFilter();
        await dashboardPage.clickOnOutcomeItem(caseManagement.EffectiveDate);
        await dashboardPage.effectivedate();
        await dashboardPage.waitForTimeout(5000);
        await dashboardPage.apply_button();
        await dashboardPage.go_Button();
        const expected_date = /Effective Date: \d{2} [A-Za-z]{3} \d{4}/;
        const actual_date = await dashboardPage.alert_displayed();
        if (typeof actual_date === 'string' && actual_date !== null) {
            const isMatch = expected_date.test(actual_date);
            expect(isMatch).toBeTruthy(); 
                  } else {
            throw new Error('Actual date is not a valid string');
                  }

                  const expected = await dashboardPage.getLastColumnData();

                  for (const data of expected) {
                    await dashboardPage.verifyData(data, dashboardPage);
                  }
                  

    })
    

})