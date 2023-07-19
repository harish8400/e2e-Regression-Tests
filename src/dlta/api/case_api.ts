import { CaseGroupApproveRejectData, CaseGroupResponse } from "../../../types";
import { APIRequestContext } from "@playwright/test";
import { BaseDltaApi } from "./base_dlta_api";

export class CaseApi extends BaseDltaApi {

    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async getCaseGroup(caseGroupId: string) {
        let path = `/case/group/${caseGroupId}`;
        let response = await this.get(path);
        let caseGroupResult: CaseGroupResponse = await response.json();
        return caseGroupResult;
    }

    async getCaseGroupInitialData(caseGroupId: string) {
        let path = `/case/group/${caseGroupId}/initialdata`;
        let response = await this.get(path);
        let initalData = await response.json();
        return initalData;
    }

    async rejectCaseGroup(caseGroupId: string, caseGroupRejectData: CaseGroupApproveRejectData) {
        let path = `/case/group/${caseGroupId}/reject`;
        caseGroupRejectData.notes = "E2E auto test - reject";
        let data = this.assembleApproveRejectBody(caseGroupRejectData);
        let response = await this.post(path, JSON.stringify(data));
        return await response.json();
    }

    async approveCaseGroup(caseGroupId: string, caseGroupApproveData: CaseGroupApproveRejectData) {
        let path = `/case/group/${caseGroupId}/approve`;
        caseGroupApproveData.notes = "E2E auto test - approve";
        let data = this.assembleApproveRejectBody(caseGroupApproveData);
        let response = await this.post(path, JSON.stringify(data));
        return await response.json();
    }

    private assembleApproveRejectBody(caseGroupApproveRejectData: CaseGroupApproveRejectData) {
        return {
            memberId: caseGroupApproveRejectData.memberId,
            fundProductId: caseGroupApproveRejectData.fundProductId,
            fundName: caseGroupApproveRejectData.fundName,
            notes: caseGroupApproveRejectData.notes,
            creatorReference: caseGroupApproveRejectData.creatorReference || this.userId
        }
    }

}