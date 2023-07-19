import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "../member_api";
import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";

export class BeneficaryApiHandler {

    //TODO: resolve delete and add code duplication
    static async deleteMemberBeneficiaries(memberApi: MemberApi, caseApi: CaseApi, memberId: string, skipCorrespondence?: boolean) {
        let beneficiaries = await memberApi.getBeneficiaries(memberId);

        if (beneficiaries.data.length < 1) {
            return;
        } else {
            let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.MODIFY_BENEFICIARIES, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES);

            let beneficiariesIdToDelete = beneficiaries.data.map((beneficiary: any) => beneficiary.linearId.id);

            let initialData = {
                beneficiariesToCreate: [],
                beneficiariesToUpdate: [],
                beneficiariesToDelete: beneficiariesIdToDelete,
                skipCorrespondence: skipCorrespondence || true
            }
            await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES, initialData, newCase.case.caseGroupId);

            await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

            await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

            await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
        }
    }

    static async createMemberBeneficiaries(memberApi: MemberApi, caseApi: CaseApi, memberId: string, beneficiaries: Array<DltaBeneficary>, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.MODIFY_BENEFICIARIES, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES);

        let beneficiariesToCreate = beneficiaries.map(beneficiary => {
            return {
                entityName: beneficiary.entityName,
                percent: beneficiary.percent,
                dob: beneficiary.dob,
                beneficiaryType: beneficiary.beneficiaryType,
                relationship: beneficiary.relationship,
                contactDetails: []
            }
        })

        let initialData = {
            beneficiariesToCreate: beneficiariesToCreate,
            beneficiariesToUpdate: [],
            beneficiariesToDelete: [],
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.MODIFY_BENEFICIARIES, initialData, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

};

export interface DltaBeneficary {
    entityName: string,
    percent: number,
    dob: string,
    beneficiaryType: string,
    relationship: string,
    contactDetails: any[]
};
