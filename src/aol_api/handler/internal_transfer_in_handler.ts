import { APIRequestContext } from '@playwright/test';
import { ShellAccountApi } from '../internal_transfer_in';
import { Navbar } from '../../aol/pom/component/navbar';
import { MemberApiHandler } from './member_api_handler';
import { PensionShellAccount } from '../../aol/pom/Pension/pension_account_page';
import { TransactionsApiHandler } from './transaction_api_handler';

export class ShellAccountApiHandler {
    static async getMemberDetails(apiRequestContext: APIRequestContext, linearId?: string): Promise<{
        memberNo: string;
        otherNames?: string;
        givenName?: string;
        surname?: string;
        gender?: string;
        title?: string;
        dob?: string;
        tfn?:string;
        memberId?:string;
    }> {
        const memberApi = new ShellAccountApi(apiRequestContext);
        return memberApi.getMemberDetails(linearId!);
    }
    
    static async getMemberInfo(apiRequestContext: APIRequestContext, memberNo?: string) {
        const Information = new ShellAccountApi(apiRequestContext);
        return Information.getMemberInfo(memberNo!);
    }
    
    static async addRollIn(apiRequestContext: APIRequestContext,memberId?: string) {
        const rollin = new ShellAccountApi(apiRequestContext);
        return rollin.addRollIn(memberId!);
    }

    static async createPensionShellAccount(apiRequestContext: APIRequestContext, fundProductId?: string) {
        const shellaccountCreation = new ShellAccountApi(apiRequestContext);
        return shellaccountCreation.createPensionShellAccount(fundProductId!);
    }

    static async fetchMemberDetails(apiRequestContext: APIRequestContext, memberNo?: string) {
        const memberApi = new ShellAccountApi(apiRequestContext);
        return memberApi.fetchMemberDetails(memberNo!);
    }

    static async shellAccount(navBar: Navbar, pensionAccountPage: PensionShellAccount, apiRequestContext: APIRequestContext) {
        const { memberNo, processId, surname } = await ShellAccountApiHandler.createPensionShellAccount(apiRequestContext);
    
        // Perform necessary operations related to pension account creation
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
    
        // Navigate to TTR members page and select member
        await navBar.navigateToTTRMembersPage(); 
        await navBar.selectMember(memberNo);
    
        // Return relevant data
        return { memberNo, processId, surname };
      }

      static async ttrShellAccountCreation(navBar: Navbar, pensionAccountPage: PensionShellAccount, apiRequestContext: APIRequestContext) {
        let { memberNo, surname } = await this.shellAccount(navBar, pensionAccountPage, apiRequestContext);
    
        // Fetch additional details and perform pension-related actions
        let linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
        await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
        await MemberApiHandler.addRollIn(apiRequestContext, linearId.id);
        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        let { id, fundName, tfn, givenName, dob } = await MemberApiHandler.getMemberDetails(apiRequestContext, linearId.id);
    
        if (id) {
          await MemberApiHandler.memberIdentity(apiRequestContext, id, { tfn, dob, givenName, fundName });
        }
        // Return relevant data
        return { memberNo, surname ,linearId };
      }

      static async ptbTransactions(navBar: Navbar, pensionAccountPage: PensionShellAccount, apiRequestContext: APIRequestContext) {
        let { linearId ,memberNo,surname} = await this.ttrShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
        await MemberApiHandler.ptbTransactions(apiRequestContext,linearId.id);
        return {memberNo,surname};
    }


    static async addContribution(apiRequestContext: APIRequestContext,memberId?: string) {
        const contribution = new ShellAccountApi(apiRequestContext);
        return contribution.addContribution(memberId!);
    }

    
}

