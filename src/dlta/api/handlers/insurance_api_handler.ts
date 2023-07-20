import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "../member_api";

export class InsuranceApiHandler {
    static async deleteAllPolicies(memberApi: MemberApi, caseApi: CaseApi, memberId: string, skipCorrespondence?: boolean) {
        let insurances = await memberApi.getInsurance(memberId);
        if (insurances.data.length < 1) {
            return;
        }

        let insuranceIdsToDelete = insurances.data.map((insurance: { linearId: { id: string; }; }) => insurance.linearId.id);

        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.INSURANCE_MODIFY_COVER, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE);

        let initialData = {
            policiesToDelete: insuranceIdsToDelete,
            skipCorrespondence: skipCorrespondence || true
        };
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE, initialData, newCase.case.caseGroupId)

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

    static async createStandardPendingPolicies(memberApi: MemberApi, caseApi: CaseApi, memberId: string, policies: Array<InsurancePolicy>, skipCorrespondence?: boolean) {
        let todayDate = new Date().toISOString().slice(0, 10);
        let policiesToCreate = [];
        for (let index = 0; index < policies.length; index++) {
            const policy = policies[index];
            switch (policy.category) {
                case "STD Death":
                    policiesToCreate.push(
                        {
                            active: true,
                            category: "STD Death",
                            cover: 10,
                            coverAmount: policy.coverAmount,
                            coverBasis: "unitBased",
                            coverType: "death",
                            coverUnits: 10,
                            defaultCover: true,
                            effectiveDate: todayDate,
                            exclusions: [],
                            hasExclusion: false,
                            isNew: true,
                            isSaved: true,
                            occupation: "default",
                            occupationModel: "default",
                            outstandingPremium: 0,
                            premium: policy.premium,
                            premiumLoading: 0,
                            provider: "Zurich",
                            status: "PENDING",
                            isEdited: true,
                            coverBasisLabel: "Unit Based",
                            categoryName: "STD Death",
                            defaultCoverLabel: "Yes"
                        }
                    )
                    break;
                case "STD TPD":
                    policiesToCreate.push(
                        {
                            active: true,
                            category: "STD TPD",
                            cover: 10,
                            coverAmount: policy.coverAmount,
                            coverBasis: "unitBased",
                            coverType: "tpd",
                            coverUnits: 10,
                            defaultCover: true,
                            effectiveDate: todayDate,
                            exclusions: [],
                            hasExclusion: false,
                            isNew: true,
                            isSaved: true,
                            occupation: "default",
                            occupationModel: "default",
                            outstandingPremium: 0,
                            premium: policy.premium,
                            premiumLoading: 0,
                            provider: "Zurich",
                            status: "PENDING",
                            isEdited: true,
                            coverBasisLabel: "Unit Based",
                            categoryName: "STD TPD",
                            defaultCoverLabel: "Yes"
                        }
                    )
                    break;
                case "STD IP 2y 60d":
                    policiesToCreate.push(
                        {
                            active: true,
                            benefitPeriod: "2 Years",
                            category: "STD IP 2y 60d",
                            cover: policy.coverAmount,
                            coverAmount: policy.coverAmount,
                            coverBasis: "dollarBased",
                            coverType: "ip",
                            defaultCover: true,
                            effectiveDate: todayDate,
                            exclusions: [],
                            hasExclusion: false,
                            isNew: true,
                            isSaved: true,
                            occupation: "default",
                            occupationModel: "default",
                            originalCoverAmount: policy.coverAmount,
                            outstandingPremium: 0,
                            premium: policy.premium,
                            premiumLoading: 0,
                            provider: "Zurich",
                            status: "PENDING",
                            waitingPeriod: "60 Days",
                            isEdited: true,
                            coverBasisLabel: "Dollar Based",
                            categoryName: "STD IP 2y 60d",
                            defaultCoverLabel: "Yes"
                        }
                    )
                    break;
                default:
                    throw new Error(`Don't know yet how to deal with policy category: '${policy.category}'`);
            }
        }

        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.INSURANCE_MODIFY_COVER, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE)

        let initialData = {
            policiesToCreate: policiesToCreate,
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE, initialData, newCase.case.caseGroupId)

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

    static async commenceInsuranceForMember(memberApi: MemberApi, caseApi: CaseApi, memberId: string, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.INSURANCE_BATCH_COMMENCEMENT, CASE_CONFIG_REFERENCE.INSURANCE_BATCH_COMMENCEMENT);

        let initialData = {
            memberId: memberId,
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.INSURANCE_BATCH_COMMENCEMENT, initialData, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

};

export interface InsurancePolicy {
    category: string,
    coverAmount: number,
    premium: number,
};
