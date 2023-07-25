import { CASE_CONFIG_REFERENCE, CASE_STATUS, CASE_TYPE } from "../../../../constants";
import { CaseApi } from "../case_api";
import { MemberApi } from "../member_api";
import { CaseApiHandler } from "./case_api_handler";

export class RollinApiHandler {

    static async createRollin(memberApi: MemberApi, caseApi: CaseApi, memberId: string, rollin: Rollin, skipCorrespondence?: boolean) {

        let newCase = await CaseApiHandler.createPendingCase(memberApi, memberId, CASE_TYPE.ROLLOVER_IN_CREATE, CASE_CONFIG_REFERENCE.MANUAL_ROLLIN);

        let initialData = {
            fundName: "AustralianSuper",
            transferringFundABN: "65714394898",
            productName: "AustralianSuper",
            targetInvestments: null,
            selectInvestmentAllocation: false,
            taxed: rollin.taxed,
            untaxed: rollin.untaxed || 0,
            taxFree: rollin.taxFree || 0,
            kiwiTaxFree: 0,
            preserved: rollin.preserved,
            kiwiPreserved: 0,
            restrictedNonPreserved: rollin.restrictedNonPreserved || 0,
            unrestrictedNonPreserved: rollin.unrestrictedNonPreserved || 0,
            transferringFundUSI: "STA0100AU",
            fundUSI: "STA0100AU",
            validUSI: true,
            transferringClientIdentifier: rollin.transferringClientIdentifier,
            paymentReference: rollin.paymentReference,
            paymentReceivedDate: rollin.paymentReceivedDate.toISOString().slice(0, 10),
            effectiveDate: rollin.effectiveDate.toISOString().slice(0, 10),
            amount: rollin.amount,
            messageType: "Client-RTR",
            skipCorrespondence: skipCorrespondence || true
        }
        await CaseApiHandler.initCaseProcess(memberApi, memberId, CASE_CONFIG_REFERENCE.MANUAL_ROLLIN, initialData, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.IN_REVIEW);

        await CaseApiHandler.approveCaseGroup(caseApi, newCase.case.caseGroupId);

        await CaseApiHandler.waitForCaseGroupStatus(caseApi, newCase.case.caseGroupId, CASE_STATUS.COMPLETE);
    }

}

export interface Rollin {
    taxed: number,
    untaxed?: number,
    taxFree?: number,
    preserved: number,
    restrictedNonPreserved?: number,
    unrestrictedNonPreserved?: number,
    transferringClientIdentifier: string,
    paymentReference: string,
    paymentReceivedDate: Date,
    effectiveDate: Date,
    amount: number,
}