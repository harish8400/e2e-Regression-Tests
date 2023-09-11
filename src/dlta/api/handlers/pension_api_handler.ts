import waitUntil from "async-wait-until";
import { CaseApi } from "../case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "../member_api";
import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE } from "../../../../constants";
import { DateUtils } from "../../../utils/date_utils";

export class PensionApiHandler {

    static async updatePensionPaymentToAnnualMinimum(memberApi: MemberApi, caseApi: CaseApi, memberId: string, paymentDate: Date, skipCorrespondence?: boolean) {
        let initialData = {
            claimingPensionTaxFreeThreshold: false,
            amount: 0,
            frequency: "annually",
            annualPensionPaymentOption: "minimumAmount",
            nextPaymentDate: DateUtils.ISOStringDate(paymentDate),
            skipCorrespondence: skipCorrespondence || true
        };

        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.PENSION_UPDATE_PAYMENT_DETAILS, CASE_CONFIG_REFERENCE.PENSION_UPDATE_PAYMENT_DETAILS);

        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.PENSION_UPDATE_PAYMENT_DETAILS, initialData, newCase.case.caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);
        //there sometimes appear to be a slight delay in processing, this delay to pause test execution briefly
        let startTime = Date.now();
        await waitUntil(() => Date.now() - startTime >= 4000);
        //there is a second review on this update on Increment Member Pension Schedule step
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE)
    }

}