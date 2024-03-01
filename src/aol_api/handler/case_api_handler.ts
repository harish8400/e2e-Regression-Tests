import waitUntil from "async-wait-until";
import { CaseApi, CaseGroupApproveRejectData } from "../case_api";
import { CaseData, CloseCaseGroupData, ProcessApi, ProcessTemplateData } from "../process_api";
import { CASE_CONFIG_REFERENCE, CASE_NOTE, CASE_OUTCOME, CASE_STATUS, CASE_TYPE } from "../../../constants";

export class CaseApiHandler {

    static async waitForCaseGroupStatus(caseApi: CaseApi, caseGroupId: string, expectedStatus: CASE_STATUS) {
        await waitUntil(async () => {
            return (await caseApi.getCaseGroup(caseGroupId)).caseGroup.status === expectedStatus;
        }, { timeout: 30000, intervalBetweenAttempts: 3000 })
    }

    static async waitForCaseGroupOutcome(caseApi: CaseApi, caseGroupId: string, expectedOutcome: CASE_OUTCOME) {
        await waitUntil(async () => {
            return (await caseApi.getCaseGroup(caseGroupId)).caseGroup.outcome === expectedOutcome;
        }, { timeout: 30000, intervalBetweenAttempts: 3000 })
    }

    static async waitForCaseGroupCaseWithNote(caseApi: CaseApi, caseGroupId: any, note: CASE_NOTE) {
        await waitUntil(async () => {
            let caseGroupResult = await caseApi.getCaseGroup(caseGroupId);
            let caseWithMatchingNote = caseGroupResult.cases.find(c => c.notes === note);
            return caseWithMatchingNote !== undefined;
        }, { timeout: 30000, intervalBetweenAttempts: 3000 })
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

    static async closeGroupWithSuccess(memberApi: ProcessApi, memberId: string, caseGroupId: string) {
        let closeData: CloseCaseGroupData = {
            caseGroupId: caseGroupId,
            outcome: CASE_OUTCOME.SUCCESS,
            status: CASE_STATUS.COMPLETE,
        }
        await memberApi.closeCaseGroup(memberId, closeData, true);
    }

    static async closeGroupWithError(memberApi: ProcessApi, memberId: string, caseGroupId: string) {
        let closeData: CloseCaseGroupData = {
            caseGroupId: caseGroupId,
            outcome: CASE_OUTCOME.ERROR,
            status: CASE_STATUS.COMPLETE,
        }
        await memberApi.closeCaseGroup(memberId, closeData, false);
    }

    static async createPendingCase(memberApi: ProcessApi, memberId: string, caseType: CASE_TYPE, configReference: CASE_CONFIG_REFERENCE) {
        let caseData: CaseData = {
            type: caseType,
            notes: "E2E auto test case creation",
            status: CASE_STATUS.PENDING,
            hold: false,
            configReference: configReference,
        };
        let newCase = await memberApi.initCase(memberId, caseData);
        return newCase;
    }

    static async initCaseProcess(memberApi: ProcessApi, memberId: string, configReference: CASE_CONFIG_REFERENCE, initialData: any, caseGroupId: string) {
        let templateData: ProcessTemplateData = {
            templateReference: configReference,
            initialData: initialData,
            linkedCaseGroupId: caseGroupId
        }
        await memberApi.initProcess(memberId, templateData);
    }

};