import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "../member_api";
import { DateUtils } from "../../../utils/date_utils";

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

    static async createStandardZurichPendingPolicies(memberApi: MemberApi, caseApi: CaseApi, memberId: string, policies: Array<InsurancePolicy>, skipCorrespondence?: boolean) {
        let todayDate = DateUtils.localISOStringDate(new Date());
        let policiesToCreate = [];
        for (let index = 0; index < policies.length; index++) {
            const policy = policies[index];
            switch (policy.category) {
                case "STD Death":
                    policiesToCreate.push(
                        {
                            active: true,
                            category: "STD Death",
                            originalCoverAmount: policy.coverAmount,
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
                            originalCoverAmount: policy.coverAmount,
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

        await InsuranceApiHandler.createPolicies(memberApi, caseApi, memberId, policiesToCreate, skipCorrespondence);
    }

    static async createDefaultAiaPendingPolicies(memberApi: MemberApi, caseApi: CaseApi, memberId: string, policies: Array<InsurancePolicy>, skipCorrespondence?: boolean) {
        let todayDate = DateUtils.localISOStringDate(new Date());
        let policiesToCreate = [];
        for (let index = 0; index < policies.length; index++) {
            const policy = policies[index];
            switch (policy.category) {
                case "Default age based Death":
                    policiesToCreate.push(
                        {
                            active: true,
                            benefitPeriod: null,
                            cancellationReason: null,
                            category: "Default age based Death",
                            cover: policy.coverAmount,
                            coverAmount: policy.coverAmount,
                            coverBasis: "dollarBased",
                            coverType: "death",
                            coverUnits: null,
                            defaultCover: true,
                            effectiveDate: todayDate,
                            endDate: null,
                            exclusions: [],
                            hasExclusion: false,
                            isNew: true,
                            isSaved: true,
                            memberSpecificAAL: null,
                            occupation: "professional",
                            occupationModel: "professional",
                            occupationStatus: null,
                            occupationStatusModel: null,
                            originalCoverAmount: policy.coverAmount,
                            outstandingPremium: 0,
                            premium: policy.premium,
                            premiumLoading: 0,
                            provider: "AIA Australia Limited",
                            status: "PENDING",
                            waitingPeriod: null,
                            isEdited: true,
                            coverBasisLabel: "Dollar Based",
                            categoryName: "Default age based Death",
                            defaultCoverLabel: "Yes",
                            sourceOfCover: null
                        }
                    )
                    break;
                case "Default age based TPD":
                    policiesToCreate.push(
                        {
                            active: true,
                            benefitPeriod: null,
                            cancellationReason: null,
                            category: "Default age based TPD",
                            cover: policy.coverAmount,
                            coverAmount: policy.coverAmount,
                            coverBasis: "dollarBased",
                            coverType: "tpd",
                            coverUnits: null,
                            defaultCover: true,
                            effectiveDate: todayDate,
                            endDate: null,
                            exclusions: [],
                            hasExclusion: false,
                            isNew: true,
                            isSaved: true,
                            memberSpecificAAL: null,
                            occupation: "professional",
                            occupationModel: "professional",
                            occupationStatus: null,
                            occupationStatusModel: null,
                            originalCoverAmount: policy.coverAmount,
                            outstandingPremium: 0,
                            premium: policy.premium,
                            premiumLoading: 0,
                            provider: "AIA Australia Limited",
                            status: "PENDING",
                            waitingPeriod: null,
                            isEdited: true,
                            coverBasisLabel: "Dollar Based",
                            categoryName: "Default age based TPD",
                            defaultCoverLabel: "Yes",
                            sourceOfCover: null
                        }
                    )
                    break;
                default:
                    throw new Error(`Don't know yet how to deal with policy category: '${policy.category}'`);
            }
        }

        await InsuranceApiHandler.createPolicies(memberApi, caseApi, memberId, policiesToCreate, skipCorrespondence);
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

    private static async createPolicies(memberApi: MemberApi, caseApi: CaseApi, memberId: string, policiesToCreate: any[], skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.INSURANCE_MODIFY_COVER, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE)

        let initialData = {
            policiesToCreate: policiesToCreate,
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.PROCESS_MEMBER_INSURANCE, initialData, newCase.case.caseGroupId)

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

};

export interface InsurancePolicy {
    category: string,
    coverAmount: number,
    premium: number,
};
