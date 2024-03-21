import { MemberApi } from '../member_api';
import { RollinApi } from '../rollin_api';
import { Transactions } from './transaction_api_handler';
import { ShellAccountApi } from '../internal_transfer_in';



export class AccumulationMemberApiHandler {
    
    static async createMember(memberApi: MemberApi, tfnNull: boolean = false) {
        return await memberApi.createMember(tfnNull);
    }
    static async getCaseGroupId(memberApi: MemberApi, processId?: string) {
        
        return await memberApi.getCaseGroupId(processId!);
    }


    static async approveProcess(memberApi: MemberApi,caseGroupId?: string, notes: string = "E2E auto test - approve") {
        return await memberApi.approveProcess(caseGroupId!, notes);
    }


    static async getMemberInfo(shellAccountApi: ShellAccountApi, memberNo?: string) {
        return await shellAccountApi.getMemberInfo(memberNo!);
    }

    static async createRollin(rollinApi: RollinApi,memberId?: string) {
        
        return await rollinApi.createRollin(memberId!);
    }

    static async fetchMemberSummary(memberApi: MemberApi, linearId?: string): Promise<{ status: boolean }> {
        return await memberApi.fetchMemberSummary(linearId!);
        
    }

    static async fetchRollInDetails(transactionApi:Transactions, memberId?: string) {
        return transactionApi.fetchRollInDetails(memberId!);
    }
    

}


