import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE, LINK_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";
import { CaseApiHandler } from "./case_api_handler";
import { MemberApi } from "../member_api";

export class LinkApiHandler {

    static async deleteLinkType(memberApi: MemberApi, caseApi: CaseApi, memberId: string, linkType: LINK_TYPE, skipCorrespondence?: boolean) {
        let links = await memberApi.getLink(memberId);

        let foundLink = links.data.find((link: { type: string; }) => link.type === linkType);

        if (!foundLink) {
            return;
        }

        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.REMOVE_TAGS, CASE_CONFIG_REFERENCE.REMOVE_MEMBER_CATEGORY);

        let initialData = {
            linkId: foundLink.linearId.id,
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.REMOVE_MEMBER_CATEGORY, initialData, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

}