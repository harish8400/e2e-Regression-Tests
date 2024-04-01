import { APIRequestContext } from '@playwright/test';
import { MemberApi } from '../member_api';
import { RollinApi } from '../rollin_api';



export class MemberApiHandler {
    static async createMember(apiRequestContext: APIRequestContext) {
        const memberCreation = new MemberApi(apiRequestContext);
        return memberCreation.createMember();
    }

    static async approveProcess(apiRequestContext: APIRequestContext, caseGroupId?: string, notes: string = "E2E auto test - approve") {
        const approval = new MemberApi(apiRequestContext);
        return approval.approveProcess(caseGroupId!, notes);
    }


    static async createPensionShellAccount(apiRequestContext: APIRequestContext, fundProductId?: string) {
        const shellaccountCreation = new MemberApi(apiRequestContext);
        return shellaccountCreation.createPensionShellAccount(fundProductId!);
    }

    static async fetchMemberDetails(apiRequestContext: APIRequestContext, memberNo?: string) {
        const memberApi = new MemberApi(apiRequestContext);
        return memberApi.fetchMemberDetails(memberNo!);
    }

    static async commencePensionMember(apiRequestContext: APIRequestContext, memberId?: string) {
        const commencePension = new MemberApi(apiRequestContext);
        return commencePension.commencePensionMember(memberId!);
    }

    static async rpbpPayments(apiRequestContext: APIRequestContext, memberId?: string) {
        const payments = new MemberApi(apiRequestContext);
        return payments.rpbpPayments(memberId!);
    }

    static async validateCommutation(apiRequestContext: APIRequestContext, memberId?: string, amount?: number) {
        const commutation = new RollinApi(apiRequestContext);
        return commutation.validateCommutation(memberId!, amount!);
    }

    static async internalTransferOutvalidation(apiRequestContext: APIRequestContext, memberId?: string, amount?: number) {
        const transferOut = new RollinApi(apiRequestContext);
        return transferOut.internalTransferOutvalidation(memberId!, amount!);
    }

    static async getMemberDetails(apiRequestContext: APIRequestContext, linearId?: string) {
        const memberApi = new MemberApi(apiRequestContext);
        return memberApi.getMemberDetails(linearId!);
    }
    static async memberIdentity(apiRequestContext: APIRequestContext, memberId?: string, memberDetails?: { tfn: string, dob: string, givenName: string, fundName: string }) {
        const identity = new MemberApi(apiRequestContext);
        const details = memberDetails || await identity.getMemberDetails(memberId!);
        return identity.memberIdentity(memberId!, details);
    }

    static async fetchMemberSummary(apiRequestContext: APIRequestContext, linearId?: string,FullExit?:boolean): Promise<{ status: boolean }> {
        const details = new MemberApi(apiRequestContext);
        const summary = await details.fetchMemberSummary(linearId!,FullExit!);
        return summary;
    }

    static async ptbTransactions(apiRequestContext: APIRequestContext, memberId?: string) {
        const transactions = new MemberApi(apiRequestContext);
        return transactions.ptbTransactions(memberId!);
    }

    static async getCaseGroupId(apiRequestContext: APIRequestContext, processId?: string) {
        const Id = new MemberApi(apiRequestContext);
        return Id.getCaseGroupId(processId!);
    }

    static async addRollIn(apiRequestContext: APIRequestContext,memberId?: string) {
        const rollin = new MemberApi(apiRequestContext);
        return rollin.addRollIn(memberId!);
    }

    static async getMemberRelatedBeneficiaries(memberApi:MemberApi,memberId?: string) {
        return memberApi.getMemberRelatedBeneficiaries(memberId!);
    }

    static async getMemberInvestmentRebalance(memberApi:MemberApi,memberId?: string) {
        return memberApi.getMemberInvestmentRebalance(memberId!);
    }

    static async getMemberInvestmentSwitch(memberApi:MemberApi,memberId?: string) {
        return memberApi.getMemberInvestmentSwitch(memberId!);
    }

}


