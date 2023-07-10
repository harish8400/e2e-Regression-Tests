import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPES, CaseData, DltaInvestmentSelection, ProcessTemplateData } from "../../../types"
import { CaseApi } from "./case_api"
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "./member_api"

export class InvestmentApiHandler {

    static async changeFutureInvestment(memberApi: MemberApi, caseApi: CaseApi, memberId: string, investments: Array<DltaInvestmentSelection>, skipCorrespondence?: boolean) {
        let caseData: CaseData = {
            type: CASE_TYPES.MANUAL_INVESTMENT_SWITCH,
            status: CASE_STATUS.PENDING,
            hold: false,
            configReference: CASE_CONFIG_REFERENCE.MANUAL_INVESTMENT_SWITCH,
        };
        let newCase = await memberApi.initCase(memberId, caseData);

        let templateData: ProcessTemplateData = {
            templateReference: CASE_CONFIG_REFERENCE.MANUAL_INVESTMENT_SWITCH,
            initialData: {
                investmentSwitch: null,
                profileChange: {
                    investments: investments
                },
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