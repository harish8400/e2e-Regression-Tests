import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE, CONTRIBUTION_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";
import { MemberApi } from "../member_api";
import { CaseApiHandler } from "./case_api_handler";

export class ContribtionApiHandler {

    static async createContribution(memberApi: MemberApi, caseApi: CaseApi, memberId: string, contribution: Contribution, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.MEMBER_CREATE_CONTRIBUTION, CASE_CONFIG_REFERENCE.MEMBER_CONTRIBUTION);

        let initialData = {
            type: contribution.type,
            paymentReference: contribution.paymentReference,
            paymentReceivedDate: contribution.paymentReceivedDate.toISOString().slice(0, 10),
            effectiveDate: contribution.effectiveDate.toISOString().slice(0, 10),
            amount: contribution.amount,
            messageType: "paper",
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.MEMBER_CONTRIBUTION, initialData, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

}

export interface Contribution {
    type: CONTRIBUTION_TYPE,
    paymentReference: string,
    paymentReceivedDate: Date,
    effectiveDate: Date,
    amount: number
}