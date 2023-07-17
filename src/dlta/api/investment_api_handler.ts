import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPES, DltaInvestmentSelection, ProcessTemplateData } from "../../../types"
import { CaseApi } from "./case_api"
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "./member_api"

export class InvestmentApiHandler {

    static async changeFutureInvestment(memberApi: MemberApi, caseApi: CaseApi, memberId: string, investments: Array<DltaInvestmentSelection>, skipCorrespondence?: boolean) {
        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPES.MANUAL_INVESTMENT_SWITCH, CASE_CONFIG_REFERENCE.MANUAL_INVESTMENT_SWITCH);

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