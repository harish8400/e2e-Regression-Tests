import { APIRequestContext } from '@playwright/test';
import { MemberApi } from '../member_api';
import { RollinApi } from '../rollin_api';
import { Transactions } from './transaction_api_handler';



export class ShellAccountCreationApiHandler {
    

    static async createPensionShellAccount(memberApi: MemberApi, fundProductId?: string) {
        return memberApi.createPensionShellAccount(fundProductId!);
    }

    static async getCaseGroupId(memberApi: MemberApi, processId?: string) {
        
        return await memberApi.getCaseGroupId(processId!);
    }


    static async approveProcess(memberApi: MemberApi,caseGroupId?: string, notes: string = "E2E auto test - approve") {
        return await memberApi.approveProcess(caseGroupId!, notes);
    }

    static async fetchMemberDetails(memberApi: MemberApi, memberNo?: string) {
       
        return await memberApi.fetchMemberDetails(memberNo!);
    }

    static async commencePensionMember(memberApi: MemberApi, memberId?: string) {
        return await memberApi.commencePensionMember(memberId!);
    }

    static async createRollin(rollinApi: RollinApi,memberId?: string) {
        return await rollinApi.createRollin(memberId!);
    }

    static async fetchRollInDetails(transactionApi:Transactions, memberId?: string) {
        return transactionApi.fetchRollInDetails(memberId!);
    }

    static async rpbpPayments(apiRequestContext: APIRequestContext, memberId?: string) {
        const payments = new MemberApi(apiRequestContext);
        return payments.rpbpPayments(memberId!);
    }

}


