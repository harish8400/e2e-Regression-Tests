import { Locator, Page, expect ,APIRequestContext } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { DateUtils } from "../../utils/date_utils";
import { UtilsAOL } from "../utils_aol";
import * as member from "../data/member.json";
import { ReviewCase } from "./component/review_case";
import { FUND } from "../../../constants";
import { MemberApiHandler } from "../../aol_api/handler/member_api_handler";
import { Navbar } from "./component/navbar";
import { TransactionsApiHandler } from "../../aol_api/handler/transaction_api_handler";
import { AccountInfoPage } from "./Pension/account_info";
import { InternalTransferPage } from "./Pension/internal_transfer";
import { ShellAccountApiHandler } from "../../aol_api/handler/internal_transfer_in_handler";
export class MemberPage extends BasePage { 

    readonly accumulationAddMember: Locator;
    readonly memberInfoTab: Locator;
    readonly memberCreatedCase: Locator;
    readonly welcomeLetterTrigger: Locator

    readonly title: Locator;
    readonly selectTitle: Locator;
    readonly givenName: Locator;
    readonly surname: Locator;
    readonly dob: Locator;
    readonly gender: Locator;
    readonly genderSelect: Locator;
    readonly emailAddress: Locator;
    readonly primaryPhone: Locator;
    readonly preferredContactMethod: Locator;
    readonly preferredContactMethodSelect: Locator;
    readonly tfn: Locator;
    readonly address1: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly stateSelect: Locator;
    readonly postcode: Locator;
    readonly preferredContactName: Locator;
    readonly residencyStatus: Locator;
    readonly residencyStatusSelect: Locator;
    readonly dateJoined: Locator;
    readonly nextStep: Locator;
    //Employer
    readonly employer: Locator;
    readonly employerSelect: Locator;
    readonly employerStartDate: Locator;
    readonly employerSave: Locator;
    //Consolidation
    readonly addFund: Locator;
    readonly addFundSelect: Locator;
    readonly memberAccountNumber: Locator;
    readonly USI: Locator;
    readonly addFundSelectOption: Locator;
    readonly enterAmount: Locator;
    readonly saveFundDetails: Locator;
    //Investments
    readonly invSelect: Locator;
    readonly invSelection: Locator;
    readonly invPercentage: Locator;
    readonly saveInv: Locator;
    readonly profileType: Locator;
    readonly profileTypeSelect: Locator;
    //Beneficiaries
    readonly beneficiaryName: Locator;
    readonly addNewBeneficiary: Locator;
    readonly beneficiaryType: Locator;
    readonly beneficiaryRelation: Locator;
    readonly beneficiaryRelationSelect: Locator;
    readonly beneficiaryEffectiveDate: Locator;
    readonly beneficiaryPercentage: Locator;
    readonly beneficiaryContactName: Locator;
    readonly beneficiaryAddress1: Locator;
    readonly beneficiaryCity: Locator;
    readonly beneficiaryState: Locator;
    readonly beneficiaryStateSelect: Locator;
    readonly beneficiaryPostcode: Locator;
    readonly beneficiarySave: Locator;
    readonly createAccount: Locator;

    //approve member creation process
    readonly processeslink: Locator
    readonly memberCreateProcessRow: Locator
    readonly memberCreateReviewRow: Locator
    readonly memberActivityData: Locator

    readonly memberGivenName: string;
    readonly memberSurname: string;
    readonly reviewCase: ReviewCase;

    readonly investementBalancesTab:Locator
    readonly investmentEditBtn:Locator
    readonly investmentDropDown:Locator
    readonly conservative:Locator
    readonly balanceAllocation:Locator
    readonly transactionAllocation:Locator
    readonly addBtn:Locator
    readonly sustainableGrowth:Locator
    readonly investmentDropDown1:Locator
    readonly balanceAllocation1:Locator
    readonly transactionAllocation1:Locator
    readonly addBtn1:Locator
    readonly viewCases: Locator;
    readonly createCase:Locator;
    readonly linkCase:Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly processException: Locator;
    readonly leftArrow: Locator;
    readonly investmentProfileDropDown:Locator;
    readonly memberLink:Locator;
    readonly firstRowMember:Locator;
    readonly percentage:Locator;
    readonly verifySwitchSuccess: Locator;
    readonly highGrowth:Locator;
    readonly investmentDropDown2:Locator;
    readonly sustainbleGrowth1:Locator;

    constructor(page: Page) {
        super(page)

    this.reviewCase = new ReviewCase(page);
    this.accumulationAddMember = page.getByRole('button', { name: 'add-circle icon Add Member' });
    this.memberInfoTab = page.getByRole('button', { name: 'Account Info' });
    this.memberCreatedCase = page.getByRole('cell', { name: 'Member - Create',exact: true });
    this.welcomeLetterTrigger = page.getByText('Process step completed with note: New member welcome letter sent.');
    this.memberLink =page.getByRole('link', { name: 'Members' });
    this.memberGivenName = UtilsAOL.randomName();
    this.memberSurname = UtilsAOL.randomSurname(5);
    this.title = page.getByTitle('Title').getByRole('img');
    this.selectTitle = page.locator('li').filter({ hasText: /^Mr$/ });
    this.givenName = page.getByTitle('Given Name').getByRole('textbox');
    this.surname = page.getByTitle('Surname').getByRole('textbox');
    this.dob = page.getByTitle('DOB').getByPlaceholder('dd/mm/yyyy');
    this.gender = page.getByTitle('Gender').getByPlaceholder('Select');
    this.genderSelect = page.locator('li').filter({ hasText: /^Male$/ });
    this.emailAddress = page.getByTitle('Email Address').getByRole('textbox');
    this.primaryPhone = page.getByTitle('Primary Phone').getByRole('textbox');
    this.preferredContactMethod = page.getByTitle('Preferred contact method').getByPlaceholder('Select');
    this.preferredContactMethodSelect = page.getByText('Digital');
    this.tfn = page.getByTitle('TFN').getByRole('textbox');
    this.address1 = page.getByTitle('Residential Address line 1').getByRole('textbox');
    this.city = page.getByTitle('City/Town').getByRole('textbox');
    this.state = page.locator('#gs4__combobox div').first();
    this.stateSelect = page.getByText('New South Wales');
    this.postcode = page.getByTitle('Postcode').getByRole('textbox');
    this.preferredContactName = page.getByTitle('Preferred Contact Name').getByRole('textbox');
    this.residencyStatus = page.getByTitle('Residency Status').getByPlaceholder('Select');
    this.residencyStatusSelect = page.getByText('Resident', { exact: true });
    this.dateJoined = page.getByTitle('Date Joined').getByPlaceholder('dd/mm/yyyy');
    this.nextStep = page.getByRole('button', { name: 'Next Step arrow-right icon' });
    //Employer step
    this.employer = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
    this.employerSelect = page.getByRole('option').nth(0);
    this.employerStartDate = page.getByPlaceholder('dd/mm/yyyy');
    this.employerSave = page.getByRole('button', { name: 'SAVE' });
    //Consolidate step
    this.addFund = page.getByRole('button', { name: 'add-circle icon Add Fund' });
    this.addFundSelect = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.addFundSelectOption = page.getByText('External fund account');
    this.memberAccountNumber = page.getByLabel('Member account number *');
    this.USI = page.getByLabel('USI *');
    this.enterAmount = page.getByPlaceholder('0');
    this.saveFundDetails = page.getByRole('button', { name: 'SAVE' });
    //Investment step
    this.invSelect = page.getByRole('main').locator('section').filter({ hasText: 'InvestmentPercentage Add' }).getByPlaceholder('Select');
    this.invSelection = page.locator("(//ul[@class='el-scrollbar__view el-select-dropdown__list'])[2]/li[1]");
    this.invPercentage = page.getByRole('textbox').nth(1);
    this.saveInv = page.getByRole('button', { name: 'Add' });
    this.profileType = page.locator('#membershipProfile').getByPlaceholder('Select');
    this.profileTypeSelect = page.getByText('My Super', { exact: true });
    //Beneficiaries step
    this.addNewBeneficiary = page.getByRole('button', { name: 'Add New' });
    this.beneficiaryName = page.getByLabel('Beneficiary Name *');
    this.beneficiaryType = page.getByText('Non-Binding');
    this.beneficiaryRelation = page.locator('#gs8__combobox div').first();
    this.beneficiaryRelationSelect = page.getByText('Spouse');
    this.beneficiaryEffectiveDate = page.locator('input[name="effectiveDate"]');
    this.beneficiaryPercentage = page.getByPlaceholder('0'); 
    this.beneficiaryContactName = page.getByLabel('Contact First Name');
    this.beneficiaryAddress1 = page.getByLabel('Residential Address 1 *');
    this.beneficiaryCity = page.getByLabel('City/Town *');
    this.beneficiaryState = page.locator('#gs11__combobox div').first();
    this.beneficiaryStateSelect = page.getByRole('option', { name: 'New South Wales' });
    this.beneficiaryPostcode = page.getByLabel('Postcode *');
    this.beneficiarySave = page.getByRole('button', { name: 'SAVE' });
    this.createAccount = page.getByRole('button', { name: 'Create Account' });
    //MemberCreateProcess
    this.processeslink = page.getByRole('link', { name: 'Processes' });
    this.memberCreateProcessRow = page.getByLabel('Member - Create', { exact: true }).first();
    this.memberCreateReviewRow = page.getByRole('cell', { name: 'In Review' });
    this.memberActivityData = page.getByRole('button', { name: 'Activity Data' });

    //SwitchProcess
    this.investementBalancesTab = page.getByRole('button', { name: 'Investments and Balances' });
    this.investmentEditBtn = page.locator('button').filter({ hasText: 'Edit Content' });
    this.investmentDropDown =page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).locator('i').getByRole('img');
    this.conservative = page.locator("//li[@class='el-select-dropdown__item option__Conservative_2']"); 
    this.balanceAllocation =page.getByRole('spinbutton').first();   
    this.transactionAllocation =page.getByRole('spinbutton').nth(1);
    this.addBtn =page.getByRole('button', { name: 'ADD', exact: true });
    this.sustainableGrowth=page.locator('li').filter({ hasText: 'Sustainable Growth' }).nth(0);
    this.sustainbleGrowth1=page.locator('//li[@class="el-select-dropdown__item option__Sustainable Growth_3"]');
    this.investmentDropDown1 =page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).getByRole('img').nth(1);
    this.balanceAllocation1 =page.getByRole('spinbutton').nth(2);   
    this.transactionAllocation1 =page.getByRole('spinbutton').nth(3);
    this.addBtn1 =page.getByRole('button', { name: 'ADD', exact: true });
    this.viewCases = page.getByRole('button', { name: 'View Cases' });
    this.createCase = page.getByRole('button', { name: 'Create Case' });
    this.linkCase = page.getByRole('button', { name: 'Link to Case' });
    this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
    this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
    this.leftArrow = page.getByRole('button', { name: 'arrow-left icon clipboard-' });
    this.investmentProfileDropDown =page.getByRole('button', { name: 'arrow-down icon' }).first();
    this.firstRowMember =page.locator('td:nth-child(6) > .cell').first();
    this.percentage =page.getByText('100%');
    this.verifySwitchSuccess = page.getByText('Process step completed with note: Investment change letter payload sent.');
    this.highGrowth=page.locator('li').filter({ hasText: 'High Growth' });
    this.investmentDropDown2 =page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).getByRole('img');
}    

    async addNewMember(tfnNull?: boolean, addBeneficiary?: boolean, dateJoinedFundEarlier?: boolean){
        
        await this.accumulationAddMember.click();
        let tfn = UtilsAOL.generateValidTFN();
        await this.title.click();
        await this.selectTitle.click();
        await this.givenName.fill(this.memberGivenName);
        await this.surname.fill(this.memberSurname);
        await this.dob.fill(member.dob);
        await this.gender.click();
        await this.genderSelect.click();
        await this.emailAddress.fill(member.email);
        await this.primaryPhone.fill(member.phone);
        await this.preferredContactMethod.click();
        await this.preferredContactMethodSelect.click();
        
        if(!tfnNull){
            await this.tfn.click();
            await this.tfn.fill(`${tfn}`);
        }
        
        await this.address1.fill(member.address);
        await this.city.fill(member.city);
        await this.state.click();
        await this.stateSelect.click();
        await this.postcode.fill(member.postcode);
        await this.preferredContactName.fill(this.memberGivenName);
        await this.residencyStatus.click();
        await this.residencyStatusSelect.click();

        if(process.env.PRODUCT != FUND.HESTA && dateJoinedFundEarlier){
            await this.dateJoined.fill(`${DateUtils.ddmmyyyStringDate(-5)}`);
        }

        await this.nextStep.click();
        
        //Employer details
        await this.employer.click();
        await this.employerSelect.click();
        await this.employerStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`)
        await this.employerStartDate.press('Tab');
        await this.employerSave.click();
        await this.nextStep.click();
        
        //Consolidation details
        await this.addFund.click();
        await this.addFundSelect.click();
        await this.addFundSelectOption.click();
        await this.memberAccountNumber.fill(member.AccNumber);
        await this.USI.fill(member.USI);
        await this.USI.press('Tab');
        await this.enterAmount.fill(member.Amount);
        await this.sleep(1000);
        await this.saveFundDetails.click();
        await this.nextStep.click();
        
        //Investments
        await this.invSelect.click();
        await this.invSelection.click();
        await this.invPercentage.fill('100');
        await this.saveInv.click();
        await this.profileType.click();
        await this.profileTypeSelect.click();
        await this.nextStep.click();
        
        //Beneficiaries
        if(addBeneficiary){
            await this.addNewBeneficiary.click();
            await this.beneficiaryName.fill(member.names[0]);
            await this.beneficiaryName.press('Tab');
            await this.beneficiaryType.click();
            await this.beneficiaryRelation.click();
            await this.beneficiaryRelationSelect.click();
            await this.beneficiaryEffectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
            await this.beneficiaryEffectiveDate.press('Tab');
            await this.beneficiaryPercentage.fill('100');
            await this.beneficiarySave.click();
        }
        
        //Create account
        await this.createAccount.click();
        await this.sleep(5000);

        return this.memberSurname;
    }

    async selectMember(memberName: string){
        await this.sleep(3000);
        await this.page.reload();
        await expect(this.page.getByRole('cell', { name: memberName }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: memberName }).first().click();
    }

    async verifyIfWelcomeLetterTriggered(){
        await this.memberInfoTab.click();
        await this.memberCreatedCase.click();

        //Check member creation case and approve correspondence
        await this.reviewCase.reviewCaseProcess(this.welcomeLetterTrigger);
    }

    async approveMemberCreationProcess(surName: string){
        await this.processeslink.click();
        await this.memberCreateProcessRow.click();
        //await this.page.locator('button').filter({ hasText: `Member - CreateRun on${DateUtils.ddMMMyyyStringDate(new Date())}` }).first();
        await this.memberCreateReviewRow.click();
        await this.memberActivityData.click();
        await expect(this.page.getByText(`Surname:${surName}`)).toBeVisible();
        await this.reviewCase.reviewCaseProcess(this.welcomeLetterTrigger);
    }

    async accumulationMember(navBar: Navbar, accountInfoPage: AccountInfoPage, apiRequestContext: APIRequestContext, internalTransferPage: InternalTransferPage) {
        const { memberNo: createMemberNo, processId } = await MemberApiHandler.createMember(apiRequestContext);
        await accountInfoPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await accountInfoPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo);
        const linearId =  await ShellAccountApiHandler.getMemberInfo(apiRequestContext,createMemberNo);
        await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id);
        await accountInfoPage.reload();
        await internalTransferPage.memberSummary();
        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        await accountInfoPage.reload();
        await ShellAccountApiHandler.getMemberDetails(apiRequestContext, linearId.id);
        return {createMemberNo};
    }

    async superstreamMRR(){
        await this.sleep(1000);
        await this.page.locator("(//a[@class='NxLAj'])[1]");
        await this.processeslink.click();
        await this.sleep(2000);
        await this.page.locator("//div[text()='SuperStream - MRR']").first().click();
        }

    

}