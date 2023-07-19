import { CASE_STATUS, PAYMENT_FREQUENCY, PensionPaymentDetails } from "../../../types";
import { molHfmPensionTest as test } from "./setup/mol_hfm_test";
import { PensionApiHandler } from "../../../src/dlta/api/pension_api_handler";
import { expect } from "@playwright/test";
import { CaseApiHandler } from "../../../src/dlta/api/case_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToPension();
})

test("MOL update pension payment details", async ({ pensionPage, memberApi, caseApi, memberId }) => {
    let today = new Date();
    today.setUTCHours(10, 0, 0, 0);
    let randomDays = Math.floor(Math.random() * (120 - 30 + 1)) + 30;
    let nextPaymentDate = new Date(today.setDate(today.getDate() + randomDays));

    await test.step("Data prep - DLTA update pension payment details to annually", async () => {
        await PensionApiHandler.updatePensionPaymentToAnnualMinimum(memberApi, caseApi, memberId, nextPaymentDate);
    });

    await test.step("Check payment details displayed correctly", async () => {
        await pensionPage.reload();
        let expectedPaymentDetails = [
            `Next payment: ${nextPaymentDate.getDate()} ${nextPaymentDate.toLocaleString('en-US', { month: 'short' })} ${nextPaymentDate.getFullYear()}`,
            "Frequency: Annually",
            "Payment selection: Minimum amount"
        ];
        let actualPaymentDetails = await pensionPage.getCurrentPaymentDetails();
        expect(actualPaymentDetails).toEqual(expectedPaymentDetails);
    });

    let newPaymentDetails: PensionPaymentDetails = { frequency: PAYMENT_FREQUENCY.MONTHLY, amount: 500 };
    await test.step("Change pension payment details", async () => {
        await pensionPage.changePaymentDetails(newPaymentDetails);
    });

    let caseGroupId = await pensionPage.waitForPaymentDetailsPutResponseCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Request successfully submitted.";
        await expect(pensionPage.messageItem).toHaveText(expectedSuccessText);
    });

    await test.step("Wait for DLTA processing", async () => {
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.IN_REVIEW);
    });

    await test.step("Check DLTA case initial data", async () => {
        let initialData = (await caseApi.getCaseGroupInitialData(caseGroupId)).dataList[0].data;
        expect(initialData.annualPensionPaymentOption).toEqual("nominatedAmount");
        expect(initialData.amount).toEqual(newPaymentDetails.amount);
        expect(initialData.frequency).toEqual(newPaymentDetails.frequency.toLowerCase());
        expect(initialData.memberId).toEqual(memberId);
    });

    await test.step("Reject case in DLTA", async () => {
        //DLTA doesn't currently handle other than annual payments from MOL, business workaround exists
        await CaseApiHandler.rejectCaseGroup(caseApi, caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.COMPLETE);
    });

})
