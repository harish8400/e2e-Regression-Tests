import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "./member_api";
import { Beneficary, CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPES, ProcessTemplateData } from "../../../types";
import { CaseApi } from "./case_api";

export class BeneficaryApiHandler {

    //TODO: resolve delete and add code duplication
    static async deleteMemberBeneficiaries(memberApi: MemberApi, caseApi: CaseApi, memberId: string, skipCorrespondence?: boolean) {
        let beneficiaries = await memberApi.getBeneficiaries(memberId);

        if (beneficiaries.data.length < 1) {
            return;
        } else {
            let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPES.MODIFY_BENEFICIARIES, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES);

            let beneficiariesIdToDelete = beneficiaries.data.map((beneficiary: any) => beneficiary.linearId.id);
            let templateData: ProcessTemplateData = {
                templateReference: CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES,
                initialData: {
                    beneficiariesToCreate: [],
                    beneficiariesToUpdate: [],
                    beneficiariesToDelete: beneficiariesIdToDelete,
                    skipCorrespondence: skipCorrespondence || true
                },
                linkedCaseGroupId: newCase.case.caseGroupId
            }
            await memberApi.initProcess(memberId, templateData);

            await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

            await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

            await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
        }
    }

    static async createMemberBeneficiaries(memberApi: MemberApi, caseApi: CaseApi, memberId: string, beneficiaries: Array<Beneficary>, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPES.MODIFY_BENEFICIARIES, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES);

        let beneficiariesToCreate = beneficiaries.map(beneficiary => {
            return {
                entityName: beneficiary.name,
                percent: beneficiary.percentage,
                dob: beneficiary.dateOfBirth.toISOString().substring(0, 10),
                beneficiaryType: beneficiary.type || "nonBinding",
                relationship: beneficiary.relationship.toLowerCase(),
                contactDetails: []
            }
        })

        let templateData: ProcessTemplateData = {
            templateReference: CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES,
            initialData: {
                beneficiariesToCreate: beneficiariesToCreate,
                beneficiariesToUpdate: [],
                beneficiariesToDelete: [],
                skipCorrespondence: skipCorrespondence || true
            },
            linkedCaseGroupId: newCase.case.caseGroupId
        }
        await memberApi.initProcess(memberId, templateData);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

}