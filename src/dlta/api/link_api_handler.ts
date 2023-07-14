import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPES, CaseData, LINK_TYPE, ProcessTemplateData } from "../../../types";
import { CaseApi } from "./case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "./member_api";

export class LinkApiHandler {

    static async deleteLinkType(memberApi: MemberApi, caseApi: CaseApi, memberId: string, linkType: LINK_TYPE, skipCorrespondence?: boolean) {
        let links = await memberApi.getLink(memberId);

        let foundLink = links.data.find((link: { type: string; }) => link.type === linkType);

        if (!foundLink) {
            return;
        }

        let caseData: CaseData = {
            type: CASE_TYPES.REMOVE_TAGS,
            notes: "E2E auto test case creation",
            status: CASE_STATUS.PENDING,
            hold: false,
            configReference: CASE_CONFIG_REFERENCE.REMOVE_MEMBER_CATEGORY,
        };
        let newCase = await memberApi.initCase(memberId, caseData);

        let templateData: ProcessTemplateData = {
            templateReference: CASE_CONFIG_REFERENCE.REMOVE_MEMBER_CATEGORY,
            initialData: {
                linkId: foundLink.linearId.id,
                skipCorrespondence: skipCorrespondence || true
            },
            linkedCaseGroupId: newCase.case.caseGroupId
        }
        await memberApi.initProcess(memberId, templateData);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

}