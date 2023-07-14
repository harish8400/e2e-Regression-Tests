import waitUntil from "async-wait-until";
import { CaseApi } from "./case_api";
import { CASE_NOTES, CASE_OUTCOME, CASE_STATUS, CaseGroupApproveRejectData, CloseCaseGroupData } from "../../../types";
import { MemberApi } from "./member_api";

export class CaseApiHandler {

    static async waitForCaseGroupStatus(caseApi: CaseApi, caseGroupId: string, expectedStatus: CASE_STATUS) {
        await waitUntil(async () => {
            return (await caseApi.getCaseGroup(caseGroupId)).caseGroup.status === expectedStatus;
        }, { timeout: 15000, intervalBetweenAttempts: 2000 })
    }

    static async waitForCaseGroupOutcome(caseApi: CaseApi, caseGroupId: string, expectedOutcome: CASE_OUTCOME) {
        await waitUntil(async () => {
            return (await caseApi.getCaseGroup(caseGroupId)).caseGroup.outcome === expectedOutcome;
        }, { timeout: 15000, intervalBetweenAttempts: 2000 })
    }

    static async waitForCaseGroupCaseWithNote(caseApi: CaseApi, caseGroupId: any, note: CASE_NOTES) {
        await waitUntil(async () => {
            let caseGroupResult = await caseApi.getCaseGroup(caseGroupId);
            let caseWithMatchingNote = caseGroupResult.cases.find(c => c.notes === note);
            return caseWithMatchingNote !== undefined;
        }, { timeout: 15000, intervalBetweenAttempts: 2000 })
    }

    //TODO: resolve approve and reject code duplication
    static async rejectCaseGroup(caseApi: CaseApi, caseGroupId: string) {
        let caseGroupResponse = await caseApi.getCaseGroup(caseGroupId);
        let rejectData: CaseGroupApproveRejectData = {
            memberId: caseGroupResponse.caseGroup.memberId,
            fundProductId: caseGroupResponse.caseGroup.fundProductId,
            fundName: caseGroupResponse.caseGroup.fundName
        }
        await caseApi.rejectCaseGroup(caseGroupId, rejectData);
    }

    static async approveCaseGroup(caseApi: CaseApi, caseGroupId: string) {
        let caseGroupResponse = await caseApi.getCaseGroup(caseGroupId);
        let rejectData: CaseGroupApproveRejectData = {
            memberId: caseGroupResponse.caseGroup.memberId,
            fundProductId: caseGroupResponse.caseGroup.fundProductId,
            fundName: caseGroupResponse.caseGroup.fundName
        }
        await caseApi.approveCaseGroup(caseGroupId, rejectData);
    }

    static async closeGroupWithSuccess(memberApi: MemberApi, memberId: string, caseGroupId: string) {
        let closeData: CloseCaseGroupData = {
            caseGroupId: caseGroupId,
            outcome: CASE_OUTCOME.SUCCESS,
            status: CASE_STATUS.COMPLETE,
        }
        await memberApi.closeCaseGroup(memberId, closeData, true);
    }

}