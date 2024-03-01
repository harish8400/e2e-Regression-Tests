import { APIRequestContext } from "@playwright/test";
import { BaseDltaAolApi } from './base_dlta_aol';

export class ProcessApi extends BaseDltaAolApi {

    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async getBeneficiaries(memberId: string) {
        let response = await this.get(`member/${memberId}/beneficiary`);
        return await response.json();
    }

    async getLink(memberId: string) {
        let response = await this.get(`member/${memberId}/link`);
        return await response.json();
    }

    async getInsurance(memberId: string) {
        let response = await this.get(`member/${memberId}/insurance`);
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

};

export interface CaseData {
    type: string,
    notes?: string,
    documents?: Array<any>,
    outcome?: number,
    status: number,
    hold: boolean,
    configReference: string,
    creatorReference?: string
};

export interface CloseCaseGroupData {
    caseGroupId: string,
    outcome: number,
    status: number,
    notes?: string,
    creatorReference?: string
};

export interface ProcessTemplateData {
    templateReference: string,
    initialData: any,
    linkedCaseGroupId: string
};
