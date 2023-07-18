import { CASE_NOTES, CASE_STATUS, PAYMENT_FREQUENCY, PensionPaymentDetails } from "../../../types";
import { molHfmPensionTest as test } from "./setup/mol_hfm_test";
import { PensionApiHandler } from "../../../src/dlta/api/pension_api_handler";
import { expect } from "@playwright/test";
import { CaseApiHandler } from "../../../src/dlta/api/case_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToPension();
})

test("MOL update pension payment details", async ({ pensionPage, memberApi, caseApi, memberId }) => {
    await test.step("Data prep - DLTA update pension payment details to annually", async () => {
        await PensionApiHandler.updatePensionPaymentToAnnual(memberApi, caseApi, memberId);
    });

    let newPaymentDetails: PensionPaymentDetails = { frequency: PAYMENT_FREQUENCY.MONTHLY, amount: 500 };
    await test.step("Change pension payment details", async () => {
        await pensionPage.reload();
        await pensionPage.changePaymentDetails(newPaymentDetails);
    });

    let caseGroupId = await pensionPage.waitForPaymentDetailsPutResponseCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Request successfully submitted.";
        await expect(pensionPage.messageItem).toHaveText(expectedSuccessText);
    });

    await test.step("Wait for DLTA processing and approve", async () => {
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, caseGroupId);
        await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTES.PENSION_PAYMENT_CORRESPONDENCE_SENT);
        await CaseApiHandler.closeGroupWithSuccess(memberApi, memberId, caseGroupId);
    });

})
