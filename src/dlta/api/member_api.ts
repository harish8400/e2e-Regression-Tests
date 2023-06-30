import { CaseData, CloseCaseGroupData, ProcessTemplateData } from "../../../types";
import { APIRequestContext } from "@playwright/test";
import { BaseDltaApi } from "./base_dlta_api";

export class MemberApi extends BaseDltaApi {

    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async getBeneficiaries(memberId: string) {
        let response = await this.get(`member/${memberId}/beneficiary`);
        return await response.json();
    }

    async initCase(memberId: string, caseData: CaseData) {
        let path = `/member/${memberId}/case`;
        let data = {
            type: caseData.type,
            notes: caseData.notes || "E2E auto test case creation",
            documents: caseData.documents || [],
            outcome: caseData.outcome || null,
            status: caseData.status,
            hold: caseData.hold,
            configReference: caseData.configReference,
            creatorReference: caseData.creatorReference || this.userId
        };
        let response = await this.post(path, JSON.stringify(data));
        return await response.json();
    }

    async closeCaseGroup(memberId: string, closeCaseGroupData: CloseCaseGroupData, withSuccess: boolean) {
        let path = `/member/${memberId}/case`;
        let data = {
            caseGroupId: closeCaseGroupData.caseGroupId,
            handlerReference: null,
            outcome: closeCaseGroupData.outcome,
            status: closeCaseGroupData.status,
            override: true,
            notes: closeCaseGroupData.notes || withSuccess ? "E2E auto test Changed status to 'Closed - Success'" : "E2E auto test Changed status to 'Closed - Error'",
            creatorReference: closeCaseGroupData.creatorReference || this.userId
        };
        let response = await this.post(path, JSON.stringify(data));
        return await response.json();
    }


    async initProcess(memberId: string, templateData: ProcessTemplateData) {
        let path = `/member/${memberId}/process`;
        let data = {
            templateReference: templateData.templateReference,
            initialData: templateData.initialData,
            linkedCaseGroupId: templateData.linkedCaseGroupId
        }
        let response = await this.post(path, JSON.stringify(data));
        return await response.json();
    }

}