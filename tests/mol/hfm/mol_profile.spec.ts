import { expect } from "@playwright/test";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { CASE_NOTE } from "../../../constants";


test("MOL Profile - update landline number @mol @mol_profile", async ({ dashboardPage, caseApi, memberApi, memberId }) => {
    await dashboardPage.navigateToContactDetails();

    let newLandlineNumber = (Math.floor(Math.random() * 90000000) + 10000000).toString();
    await test.step(`Update landline number to ${newLandlineNumber}`, async () => {
        await dashboardPage.contactDetailsSidebar.updateLandlineNumber(newLandlineNumber);
    });

    let caseGroupId = await dashboardPage.contactDetailsSidebar.waitForContactDetailsPutResponseCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Request successfully submitted";
        await expect(dashboardPage.messageItem).toHaveText(expectedSuccessText);
    });

    await test.step("Wait for DLTA processing", async () => {
        await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.UPDATE_SENT);
        //TODO check letter payload
        await CaseApiHandler.closeGroupWithSuccess(memberApi, memberId, caseGroupId)
    })

    await test.step("Check landline number updated", async () => {
        await dashboardPage.reload();
        await dashboardPage.navigateToContactDetails();
        let expectedLandlineNumber = `*******${newLandlineNumber.slice(-4)}`;
        let actualLandlineNumber = await dashboardPage.contactDetailsSidebar.getLandlineNumber();
        expect(actualLandlineNumber).toEqual(expectedLandlineNumber);
    })

})