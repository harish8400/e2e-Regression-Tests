import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPES } from "../../../types";
import { CaseApi } from "./case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "./member_api";

export class PensionApiHandler {

    static async updatePensionPaymentToAnnual(memberApi: MemberApi, caseApi: CaseApi, memberId: string, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPES.PENSION_UPDATE_PAYMENT_DETAILS, CASE_CONFIG_REFERENCE.PENSION_UPDATE_PAYMENT_DETAILS);

        let today = new Date();
        let nextMonthDateString = new Date(today.setMonth(today.getMonth() + 1)).toISOString().substring(0, 10);
        let initialData = {
            claimingPensionTaxFreeThreshold: false,
            amount: 0,
            frequency: "annually",
            annualPensionPaymentOption: "minimumAmount",
            nextPaymentDate: nextMonthDateString,
            skipCorrespondence: skipCorrespondence || true
        };

        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.PENSION_UPDATE_PAYMENT_DETAILS, initialData, newCase.case.caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);
        //there is a second review on this update on Increment Member Pension Schedule step
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE)
    }

}