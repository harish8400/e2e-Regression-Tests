import { dltaOnlineTest as test } from "../../../src/aol/base_aol_test";
import { Admins } from "../../../src/aol/data/admins";
import { expect } from "@playwright/test";
import { allure } from "allure-playwright";

test.describe("Case management - Open cases", () => {
    test.setTimeout(60000);

    test.beforeEach(async ({ loginPage }) => {
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");
        await loginPage.navigateTo();
        await loginPage.doLogin(admin.username, admin.password);
    });

    /** This test verifies open cases page, filtering options, tries to add new case and assigning existing case to user */
    test("Verify open case management @casemanagement", async ({ dashboardPage }) => {
        await allure.suite("Case Management");
        await allure.subSuite("Open Cases");

        await test.step("Verify open cases page", async () => {
            await dashboardPage.verifyCaseManagementTabs();
            await dashboardPage.waitForTimeout(5000)
        })

        await test.step("Verify open cases page filters", async () => {
            await dashboardPage.clickFilter();
            await dashboardPage.waitForTimeout(5000);
            let expectedItems = ["Member Account Number", "Effective Date", "Assigned to", "Case Type", "Case Group ID", "Reference", "Status", "Outcome"];
            let actualItems = await dashboardPage.getListItems();
            expect(actualItems).toEqual(expectedItems);
        })

        await test.step("Add new case", async () => {
            await dashboardPage.addNewCase();
        })

        await test.step("Assign existing case", async () => {
            await dashboardPage.sleep(5000);
            const rowNumberToClick = 2;
            await dashboardPage.clickOnTableRow(rowNumberToClick);
            await dashboardPage.addCaseToAssignee();
            await dashboardPage.sleep(5000);
            await expect(dashboardPage.activity_text).toContainText("Case Assigned to");
        })


        //This step verifies if case list is displayed with open, close, on hold, Go tabs options to select
        test("Ensure cases are correctly displayed under Open Cases tab @casemanagement", async ({ dashboardPage }) => {
            expect(await dashboardPage.casemanagement.innerText()).toBe("Case Management");

            test("Ensure cases are correctly displayed under Open Cases tab", async ({ dashboardPage }) => {
                await allure.suite("Case Management");
                await allure.subSuite("Open Cases");
                await dashboardPage.verifyCaseManagementTabs();
                await dashboardPage.waitForTimeout(5000)

                await dashboardPage.takeScreenshot('Tabs.png');

            });

            test("Ensure the user can successfully filter on multiple parameters in Case Management Open Cases", async ({ dashboardPage }) => {
                await allure.suite("Case Management");
                await allure.subSuite("Open Cases");

                await dashboardPage.clickFilter();
                await dashboardPage.waitForTimeout(5000);
                let expectedItems = ["Member Account Number1", "Effective Date", "Assigned to", "Case Type", "Case Group ID", "Reference", "Status", "Outcome"];
                let actualItems = await dashboardPage.getListItems();
                expect(actualItems).toEqual(expectedItems);

            });

            test("Ensure that an existing case can be assigned to a user", async ({ dashboardPage }) => {
                await allure.suite("Case Management");
                await allure.subSuite("Open Cases");

                await dashboardPage.sleep(5000);
                const rowNumberToClick = 2;
                await dashboardPage.clickOnTableRow(rowNumberToClick);
                await dashboardPage.addCaseToAssignee();
                await dashboardPage.sleep(5000);
                // Regex pattern for the dynamic assignment text
                const expected_activity = /Case Assigned from '.+' to '.+'/;
                const activityNotes = await dashboardPage.activity_notes();
                expect(activityNotes).toMatch(expected_activity);

            });
        })
    })
})

