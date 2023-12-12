import { dltaOnlineTest as test } from "../../../src/aol/base_aol_test";
import { Admins } from "../../../src/aol/data/admins";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";
import * as caseManagement from '../../../src/aol/data/case_data.json';
//import { DateUtils } from "../../../src/utils/date_utils";

test("casemanagement @casemanagement", async ({ loginPage, dashboardPage }) => {
    await allure.suite("Case Management");
    await allure.subSuite("Open Cases");

    test.setTimeout(600000);

    let admin = Admins.getAdminByUsername("admin@tinasuper.com");

    await test.step("Login", async () => {
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
    });

    await test.step('Ensure cases are correctly displayed under Open Cases tab with following tabs: Open Cases, Closed Cases, On Hold, SLA @casemanagement', async () => {

        expect(await dashboardPage.casemanagement.innerText()).toBe('Case Management');
        await dashboardPage.verifyCaseManagementTabs()
    });

    await test.step('Ensure filtering is available on Open Cases in Case Management & user can filter on multiple parameters', async () => {
        await allure.subSuite("Filtering");
        await dashboardPage.open();
        await dashboardPage.close_main();
        await dashboardPage.waitForTimeout(5000);
        await dashboardPage.clickFilter();
        const expectedItems = caseManagement.expectedItems;
        const actualItems = await dashboardPage.getListItemsAndHighlight();
        expect(actualItems).toEqual(expectedItems);
        await dashboardPage.validateMemberAccountNumber({ dashboardPage });
        await dashboardPage.validateeffectivedate({ dashboardPage });
        await dashboardPage.validate_MemberTobeAssigned({ dashboardPage });
        await dashboardPage.validate_case_type({ dashboardPage });
        await dashboardPage.validate_case_Id({ dashboardPage });
        await dashboardPage.validate_reference({ dashboardPage });
    });

    await test.step('Ensure that a new case can be created without being assigned to a member with possible outcome of Processing, Error, Success', async () => {
        await allure.suite("Case Management");
        await allure.subSuite("Adding new case");
        await dashboardPage.addNewCase();
        await dashboardPage.clickOnClosedIcon();
        await dashboardPage.selectOutcomeItems({ dashboardPage });
        await dashboardPage.closedCase({ dashboardPage })
    })


    await test.step("Ensure that primary statuses of the cases are: Pending, In Progress, In Review, On Hold (Open Cases)", async () => {
        await dashboardPage.select_status({ dashboardPage });
        await dashboardPage.select_status_closed({ dashboardPage });
    })


    await test.step('Verify that an existing case can be updated with:assigning to a user @casemanagement', async () => {
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

    await test.step('Verify that an existing case can be updated with:adding notes/comments @casemanagement', async () => {
        await dashboardPage.notes_comments();
        const expected_activity = caseManagement.Notes;
        const activityLogElement = await dashboardPage.getActivityLogElement();
        expect(activityLogElement).toMatch(expected_activity);
    })
    // // await test.step('Verify that an existing case can be updated with:adding attachments @casemanagement', async () => {

    // //     try {
    // //         // Perform the file upload
    // //         await dashboardPage.attachemnts();
    // //         const fileName = caseManagement.AddFile;
    // //         await dashboardPage.uploadCsvFile(fileName);


    // //     } catch (error) {
    // //         console.error("Error:", error);

    // //     }
    // //     await dashboardPage.done_upload();
    // // })


    // await test.step("Ensure that user can find exact created and updated date time of a case", async () => {
    //     const { lastColumn, beforeLastColumn } = await dashboardPage.getLastAndBeforeLastColumnData();


    // const highlightElement = async (el: { style: { backgroundColor: any; }; }, color: any) => {
    //     el.style.backgroundColor = color;
    //     // Add any other styling you prefer for highlighting
    // };

    // // Highlight last column text
    // for (const element of lastColumn) {
    //     await dashboardPage.evaluate(highlightElement, element, 'yellow');
    // }

    // // Highlight before last column text
    // for (const element of beforeLastColumn) {
    //     await dashboardPage.evaluate(highlightElement, element, 'orange');
    // }

    // // Rest of your assertions and validations
    // expect(lastColumn.length).toBeGreaterThan(0); 
    // expect(beforeLastColumn.length).toBeGreaterThan(0);

    //     for (const text of lastColumn) {
    //         const expectedPattern = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
    //         expect(text).toMatch(expectedPattern);
    //         console.log(text);
    //     }

    //     for (const text of beforeLastColumn) {
    //         const expectedPattern = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
    //         expect(text).toMatch(expectedPattern);
    //         console.log(text);
    //     }
    // });




})

