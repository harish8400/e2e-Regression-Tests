import { Locator, Page, expect, APIRequestContext } from "@playwright/test";
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
import { allure } from "allure-playwright";
import { GlobalPage } from "./component/global_page";
import * as path from 'path';
import { csv_utils } from "../../utils/csv_utils";
import { xmlUtility } from "../../utils/xml_util";
import process from 'process';
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { AssertionError } from "assert";

let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;

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

    readonly investementBalancesTab: Locator
    readonly investmentEditBtn: Locator
    readonly investmentDropDown: Locator
    readonly conservative: Locator
    readonly balanceAllocation: Locator
    readonly transactionAllocation: Locator
    readonly addBtn: Locator
    readonly australianShares: Locator
    readonly investmentDropDown1: Locator
    readonly balanceAllocation1: Locator
    readonly transactionAllocation1: Locator
    readonly addBtn1: Locator
    readonly viewCases: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly processException: Locator;
    readonly leftArrow: Locator;
    readonly investmentProfileDropDown: Locator;
    readonly memberLink: Locator;
    readonly firstRowMember: Locator;
    readonly percentage: Locator;
    readonly verifySwitchSuccess: Locator;
    readonly highGrowth: Locator;
    readonly investmentDropDown2: Locator;
    readonly australianShares1: Locator;
    readonly memberCreated: Locator;
    readonly rollOut: Locator;
    readonly rollOut_VG: Locator;
    readonly navBar: Navbar
    readonly contribution: Locator;
    readonly contribution_vg: Locator;

    readonly rolloverIn: Locator;
    readonly globalPage: GlobalPage;
    readonly FilterClick: Locator;
    readonly FilterOption: Locator;
    readonly FilterOptionInput: Locator;
    readonly BtnApply: Locator;
    readonly gctarTransaction: Locator;
    readonly caseID: Locator;
    
    readonly sustainbleGrowth1: Locator;

    constructor(page: Page) {
        super(page)
        this.globalPage = new GlobalPage(page);
        this.reviewCase = new ReviewCase(page);
        this.navBar = new Navbar(page)
        this.accumulationAddMember = page.getByRole('button', { name: 'add-circle icon Add Member' });
        this.memberInfoTab = page.getByRole('button', { name: 'Account Info' });
        this.memberCreatedCase = page.getByRole('cell', { name: 'Member - Create', exact: true });
        this.welcomeLetterTrigger = page.getByText('Process step completed with note: New member welcome letter sent.');
        this.memberLink = page.getByRole('link', { name: 'Members' });
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
        this.investmentDropDown = page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).getByPlaceholder('Select');
        this.conservative = page.locator('li').filter({ hasText: 'Conservative' })
        this.balanceAllocation = page.getByRole('spinbutton').first();
        this.transactionAllocation = page.getByRole('spinbutton').nth(1);
        this.addBtn = page.getByRole('button', { name: 'ADD', exact: true });
        this.australianShares = page.locator('li').filter({ hasText: 'Australian Shares' }).first();
        this.australianShares1 = page.locator('li').filter({ hasText: 'Australian Shares' });
        this.investmentDropDown1 = page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).getByRole('img').nth(1);
        this.balanceAllocation1 = page.getByRole('spinbutton').nth(2);
        this.transactionAllocation1 = page.getByRole('spinbutton').nth(3);
        this.addBtn1 = page.getByRole('button', { name: 'ADD', exact: true });
        this.viewCases = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.leftArrow = page.getByRole('button', { name: 'arrow-left icon clipboard-' });
        this.investmentProfileDropDown = page.getByRole('button', { name: 'arrow-down icon' }).first();
        this.firstRowMember = page.locator('td:nth-child(6) > .cell').first();
        this.percentage = page.getByText('100%');
        this.verifySwitchSuccess = page.getByText('Process step completed with note: Investment change letter payload sent.');
        this.highGrowth = page.locator('li').filter({ hasText: 'High Growth' });
        this.investmentDropDown2 = page.getByRole('main').locator('section').filter({ hasText: 'Investment REBALANCE Member' }).getByRole('img');
        this.memberCreated = page.getByText('Process step completed with note: New member welcome letter sent.');
        this.contribution = page.getByText('Process step Send Superstream Contribution Payload. did not meet conditions.');
        this.contribution_vg = page.getByText('Process step completed with note: Superstream contribution payload sent.');

        this.rolloverIn = page.getByText('Process step completed with note: Member roll in payload sent to Chandler.');
        this.rollOut = page.getByText('Process step completed with note: Manual Super Stream rollout correspondence sent.');
        this.rollOut_VG = page.getByText('Process step completed with note: Rollover received from other fund letter sent.')
        this.gctarTransaction = page.getByText('Process step completed with note: GCTAOR sent.');

        // #filter
        this.FilterClick = page.getByRole('button', { name: 'FILTER' });
        this.FilterOption = page.getByText('Name', { exact: true });
        this.FilterOptionInput = page.getByRole('textbox').nth(1);
        this.BtnApply = page.getByRole('button', { name: 'APPLY' });
        this.caseID = page.locator(`(//span[@class='inline-block align-middle text-xs font-semibold'])[1]`);

        this.sustainbleGrowth1 = page.locator("(//span[contains(text(),'Sustainable Growth')]/parent::li)[1]");
    }

    async addNewMember(tfnNull?: boolean, addBeneficiary?: boolean, dateJoinedFundEarlier?: boolean, memberIsChild?: boolean) {

        await this.accumulationAddMember.click();
        let tfn = UtilsAOL.generateValidTFN();
        await this.title.click();
        await this.selectTitle.click();
        await this.givenName.fill(this.memberGivenName);
        await this.surname.fill(this.memberSurname);
        if (memberIsChild == true) {
            await this.dob.fill(member.childDOB);
        }
        else {
            await this.dob.fill(member.dob);
        }
        await this.gender.click();
        await this.genderSelect.click();
        await this.emailAddress.fill(member.email);
        await this.primaryPhone.fill(member.phone);
        await this.preferredContactMethod.click();
        await this.preferredContactMethodSelect.click();

        if (!tfnNull) {
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

        if (process.env.PRODUCT != FUND.HESTA && dateJoinedFundEarlier) {
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
        if (addBeneficiary) {
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

    async selectMember(memberName: string) {
        await this.sleep(3000);
        await this.page.reload();

        //Filter member
        await this.FilterClick.click();
        await this.FilterOption.click();
        await this.sleep(1000);
        await this.FilterOptionInput.fill(memberName);
        await this.BtnApply.click();

        await expect(this.page.getByRole('cell', { name: memberName }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: memberName }).first().click();
    }

    async verifyIfWelcomeLetterTriggered() {
        await this.sleep(5000);
        await this.memberInfoTab.click();
        await this.memberCreatedCase.click();

        //Check member creation case and approve correspondence
        await this.reviewCase.reviewCaseProcess(this.welcomeLetterTrigger);
    }

    async approveMemberCreationProcess(surName: string) {
        await this.processeslink.click();
        await this.memberCreateProcessRow.click();
        //await this.page.locator('button').filter({ hasText: `Member - CreateRun on${DateUtils.ddMMMyyyStringDate(new Date())}` }).first();
        await this.memberCreateReviewRow.click();
        await this.memberActivityData.click();
        await expect(this.page.getByText(`Surname:${surName}`)).toBeVisible();
        await this.reviewCase.reviewCaseProcess(this.welcomeLetterTrigger);
    }

    async verifySuperstreamProcess(superstreamProcess: string) {
        await this.page.locator("(//a[@class='NxLAj'])[1]").click();
        await this.processeslink.click();
        await this.sleep(3000);
        await this.reloadPageWithDelay(this.page, 1);
        await this.page.locator(`//div[text()='${superstreamProcess}']`).first().click();
    
        await this.sleep(2000);
        let process = await this.page.locator("(//div[@class='cell']//span)[1]");
        if (await process.innerText() === "In Review") {
            await this.page.getByText('In Review').click({ force: true });
        } else if (await process.innerText() === "In Progress") {
            await this.page.locator("//span[text()='In Progress ']").click({ force: true });
        }
        else if (await process.innerText() === "Pending") {
            await this.page.getByRole('cell', { name: 'Pending' }).locator('span').click({ force: true });
        }
        else {
            await this.page.getByRole('cell', { name: 'Closed' }).click({ force: true });
        }
    
        if (superstreamProcess == 'SuperStream - Contribution') {
            switch (product) {
                case 'HESTA for Mercy':
                    await this.reviewCase.reviewCaseProcess(this.contribution);
                    break;
                case 'Vanguard Super':
                    const textContent = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]");
                    const text = await textContent.textContent();
                    console.log(text);
                    const outcome = text?.trim();
                    console.log(outcome);
                    await this.page.waitForTimeout(3000);
                    if (outcome === 'Process step completed with note: Superstream contribution payload sent.') {
                        await this.reviewCase.reviewCaseProcess(this.contribution_vg);
                    } else if (outcome?.includes('Process step Send Superstream Contribution Payload. did not meet conditions')) {
                        await this.reviewCase.reviewCaseProcess(this.contribution);
                    } else {
                        console.log('undefined');
                    }                    
                    
                    break;
                default:
                    throw new Error(`Unsupported product: ${product}`);
            }
        } else if (superstreamProcess == 'SuperStream - MRR') {
            await this.reviewCase.reviewCaseProcess(this.memberCreated);
        } else if (superstreamProcess == 'SuperStream - Rollover Out') {
            switch (product) {
                case 'HESTA for Mercy':
                    await this.reviewCase.reviewCaseProcess(this.rollOut);
                    break;
                case 'Vanguard Super':
                    const textContent = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]");
                    const text = await textContent.textContent();
                    console.log(text);
                    const outcome = text?.trim();
                    console.log(outcome);
                    if (outcome === 'Process step completed with note: Rollover received from other fund letter sent.') {
                        await this.sleep(3000);
                        await this.reviewCase.reviewCaseProcess(this.rollOut_VG);
                    } else {
                        await this.reviewCase.reviewCaseProcess(this.rollOut);
                    }
                    break;
                default:
                    throw new Error(`Unsupported product: ${product}`);
            }
        } else if (superstreamProcess == 'SuperStream GCTAR') {
            switch (product) {
                case 'HESTA for Mercy':
                    await this.reviewCase.reviewCaseProcess(this.gctarTransaction);
                    break;
                case 'Vanguard Super':
                    const textContent = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]");
                    const text = await textContent.textContent();
                    console.log(text);
                    const outcome = text?.trim();
                    console.log(outcome);
                    if (outcome === 'Process step completed with note: Rollover received from other fund letter sent.') {
                        console.log('java.lang.IllegalArgumentException: This transaction has pending dependencies and cannot be processed yet.')
                    } else {
                        await this.reviewCase.reviewCaseProcess(this.gctarTransaction);
                    }
                    break;
                default:
                    throw new Error(`Unsupported product: ${product}`);
            }
        } else {
            await this.reviewCase.reviewCaseProcess(this.rolloverIn);
        }
    }
    


    async accumulationMember(navBar: Navbar, accountInfoPage: AccountInfoPage, apiRequestContext: APIRequestContext, internalTransferPage: InternalTransferPage) {
        const { memberNo, processId } = await MemberApiHandler.createMember(apiRequestContext);
        // await accountInfoPage.ProcessTab();
        await new Promise(resolve => setTimeout(resolve, 5000));
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 5000));
        //await accountInfoPage.reload();
        //await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(memberNo);
        const linearId = await ShellAccountApiHandler.getMemberInfo(apiRequestContext, memberNo);
        await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id);
        await accountInfoPage.reload();
        await internalTransferPage.memberSummary();
        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        await accountInfoPage.reload();
        await ShellAccountApiHandler.getMemberDetails(apiRequestContext, linearId.id);
        return { memberNo ,linearId};
    }

    async createAccumulationMember(apiRequestContext: APIRequestContext) {
        const { memberNo, processId } = await MemberApiHandler.createMember(apiRequestContext);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId!);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const linearId = await ShellAccountApiHandler.getMemberInfo(apiRequestContext, memberNo);
        await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id);

        await TransactionsApiHandler.fetchRollInDetails(apiRequestContext, linearId.id);
        await ShellAccountApiHandler.getMemberDetails(apiRequestContext, linearId.id);

        return { memberNo };
    }

    async memberOverview() {
        await this.page.reload();
        let memberNumber = await this.page.locator("(//td[@colspan='1']//div)[2]");
        await this.sleep(3000).then(() => memberNumber.scrollIntoViewIfNeeded());
        let MemberUniqueNumber = (await memberNumber?.textContent()) ?? null;
        console.log(MemberUniqueNumber);

        if (MemberUniqueNumber !== null) {
            await this.sleep(3000).then(() => this.navBar.navigateToAccumulationMembersPage());
            await this.navBar.selectMember(MemberUniqueNumber);
        } else {
            console.error("MemberUniqueNumber is null.");
        }
        await this.sleep(5000).then(() => this.page.getByRole('button', { name: 'Overview' }).click({ force: true }));

        let memberNumberOnScreen = await this.page.locator("(//p[@class='truncate'])[1]");
        await this.sleep(3000).then(() => memberNumberOnScreen.scrollIntoViewIfNeeded());
        let MemberNumberIs = (await memberNumberOnScreen?.textContent()) ?? null;
        console.log(MemberNumberIs);

        if (MemberNumberIs === MemberUniqueNumber) {
            allure.logStep("Expected MemberNumberIs: " + MemberUniqueNumber + ", Actual MemberNumberIs: " + MemberNumberIs);
        }

        else throw "The displayed number does not match the Expected number.";

    }

    async getFirstName(): Promise<string | null> {
        const memberFirstName = await this.page.locator("(//label[@for='givenName']/following::p[@class='truncate'])[1]");
        return memberFirstName ? memberFirstName.textContent() : null;
    }

    async getLastName(): Promise<string | null> {
        const membersurName = await this.page.locator("(//label[@for='surname']/following::p[@class='truncate'])[1]");
        return membersurName ? membersurName.textContent() : null;
    }

    async getDOB(): Promise<string | null> {
        const memberDob = await this.page.locator("(//label[@for='dob']/following::p[@class='truncate'])[1]");
        return memberDob ? memberDob.textContent() : null;
    }

    async reloadPageWithDelay(page: Page, reloadCount: number) {
        for (let i = 0; i < reloadCount; i++) {
            await page.reload();

        }
    }

    async getTFN(): Promise<string | null> {
        const tfn = await this.page.locator("(//label[@for='tfn']/following::p[@class='truncate'])[1]");
        return tfn ? tfn.textContent() : null;
    }

    async memberTransaction() {
        await this.sleep(3000);
        await this.page.reload();
        let memberLink = await this.page.locator("(//a[contains(@class,'gs-link text-teal-300')]//span)[1]");;
        await this.sleep(3000)
        memberLink.scrollIntoViewIfNeeded().then(() => this.sleep(3000).then(() => memberLink.click()));
        if (process.env.PRODUCT === FUND.HESTA) {
            (await this.sleep(3000).then(() => this.page.locator("//button[text()='HESTA for Mercy Super']"))).click();
        } else {
            (await this.sleep(3000).then(() => this.page.locator("//button[text()='Vanguard Accumulation']"))).click();
        }
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
        await this.sleep(3000);
        let transactionType = (await this.sleep(3000).then(() => this.page.locator("//table[@class='el-table__body']/tbody[1]/tr[1]/td[2]"))).first();
        transactionType.scrollIntoViewIfNeeded().then(() => this.sleep(3000));
        transactionType.click();
        await this.transactionsMessage();

    }

    async transactionsMessage() {
        await this.sleep(5000);
        let viewCase = await this.page.locator("//span[text()=' VIEW CASE ']").scrollIntoViewIfNeeded().then(() => this.sleep(2000));
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Investements Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Components']").click());
        viewCase;
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Components Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Payment Details']").click());
        viewCase;
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));


    }

    async getEmployerOrganisationName(): Promise<string | null> {
        const employerOrganisationName = await this.page.locator("(//p[text()='Name']/following::p[@class='font-semibold'])[1]").textContent();
        return employerOrganisationName ? employerOrganisationName.trim() : null;
    }

    async getAustralianBusinessNumber(): Promise<string | null> {
        const australianBusinessNumber = await this.page.locator("(//p[text()='ABN']/following::p[@class='font-semibold'])[1]").textContent();
        return australianBusinessNumber ? australianBusinessNumber.trim() : null;
    }

    async getAmountContributed(): Promise<string | null> {
        const amount = await this.page.locator("(//p[text()='Amount']/following::p[@class='font-semibold'])[1]").textContent();
        return amount ? amount.trim() : null;
    }

    async getMessageType(): Promise<string | null> {
        await this.sleep(3000);
        const message = await this.page.locator("(//p[text()='Message type']/following::p[@class='font-semibold'])[1]").textContent();
        return message ? message.trim() : null;
    }

    async getConversationId(): Promise<string | null> {
        const id = await this.page.locator("//p[text()='Conversation ID']/following-sibling::p").textContent();
        return id ? id.trim() : null;
    }

    async multipleContributions() {
        await this.amountContributedTypeMNC();
        await this.amountContributedTypeOTP();
        await this.amountContributedTypeEAC();
        await this.amountContributedTypeSAL();
        await this.amountContributedTypeSPO();


    }

    async amountContributedTypeMNC() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let mncType = await this.page.locator("//div[@class='cell']/following::div[text()='MNC']").first();
        mncType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => mncType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Personal is: ${amount}`);

    }

    async amountContributedTypeOTP() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let otpType = await this.page.locator("//div[@class='cell']/following::div[text()='OTP']").first();
        otpType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => otpType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Other Third Party is: ${amount}`);

    }

    async amountContributedTypeEAC() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let eacType = await this.page.locator("//div[@class='cell']/following::div[text()='EAC']").first();
        eacType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => eacType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Employer Additional is: ${amount}`);

    }

    async amountContributedTypeSAL() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let salType = await this.page.locator("//div[@class='cell']/following::div[text()='SAL']").first();
        salType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => salType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Salary Sacrifice is: ${amount}`);

    }

    async amountContributedTypeSGC() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let sgcType = await this.page.locator("//div[@class='cell']/following::div[text()='SGC']").first();
        sgcType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => sgcType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Super Guarantee is: ${amount}`);



    }

    async amountContributedTypeSPO() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let spoType = await this.page.locator("//div[@class='cell']/following::div[text()='SPO']").first();
        spoType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => spoType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Spouse is: ${amount}`);

    }

    async amountContributedTypeAWD() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let awdType = await this.page.locator("//div[@class='cell']/following::div[text()='AWD']").first();
        awdType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => awdType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed as Award is: ${amount}`);

    }

    async memberWithoutTFNMultipleContributions() {
        await this.amountContributedTypeAWD();
        await this.amountContributedTypeSAL();



    }

    async rollInTransaction() {

        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Overview']/following-sibling::button"))).click();
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
        let transactionType = (await this.sleep(3000).then(() => this.page.locator("//div[@class='cell']/following::div[text()='RLI']"))).first();
        transactionType.scrollIntoViewIfNeeded().then(() => this.sleep(3000));
        transactionType.click();
        let viewCase = await this.page.locator("//span[text()=' VIEW CASE ']").scrollIntoViewIfNeeded().then(() => this.sleep(2000));
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Investements Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Components']").click());
        await this.sleep(1000).then(() => this.taxedComponent);
        await this.sleep(1000).then(() => this.unTaxedComponent);
        await this.sleep(1000).then(() => this.preservedComponent);
        await this.sleep(1000).then(() => this.unPreservedComponent);
        await this.sleep(1000).then(() => this.restrictedPreservedComponent);
        viewCase;
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Components Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Payment Details']").click());
        viewCase;
        await this.sleep(1000).then(() => this.paymentReference);
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));

    }

    async taxedComponent() {
        const taxed = await this.page.locator("//p[normalize-space()='Taxable - taxed']/following-sibling::p[1]").textContent();
        return taxed ? taxed.trim() : null;
    }

    async unTaxedComponent() {
        const unTaxed = await this.page.locator("//p[normalize-space()='Taxable - untaxed']/following-sibling::p[1]").textContent();
        return unTaxed ? unTaxed.trim() : null;

    }

    async preservedComponent() {
        const preserved = await this.page.locator("//p[normalize-space()='Preserved']/following-sibling::p[1]").textContent();
        return preserved ? preserved.trim() : null;
    }

    async unPreservedComponent() {
        const unp = await this.page.locator("//p[normalize-space()='UNP']/following-sibling::p[1]").textContent();
        return unp ? unp.trim() : null;
    }

    async restrictedPreservedComponent() {
        const rnp = await this.page.locator("//p[normalize-space()='RNP']/following-sibling::p[1]").textContent();
        return rnp ? rnp.trim() : null;
    }

    async paymentReference() {
        const paymentRef = await this.page.locator("//section[@class='gs-row flex padding-bottom-20 border-b border-neutral-100']//div[3]//p[1]");
        const paymentRefText = await paymentRef.textContent();
        const trimmedPaymentRefText = paymentRefText ? paymentRefText.trim().replace('Payment ref: ', '') : null;
        return trimmedPaymentRefText;

    }

    async memberNumberLink() {
        await this.page.reload();
        let memberLink = await this.page.locator("(//a[contains(@class,'gs-link text-teal-300')]//span)[1]");;
        await this.sleep(3000)
        memberLink.scrollIntoViewIfNeeded().then(() => this.sleep(3000).then(() => memberLink.click()));
    }

    async memberGCTRContribution() {
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Overview']/following-sibling::button"))).click();
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
        let transactionType = (await this.sleep(3000).then(() => this.page.locator("//table[@class='el-table__body']/tbody[1]/tr[1]/td[2]/div[1]"))).first();
        transactionType.scrollIntoViewIfNeeded().then(() => this.sleep(3000));
        transactionType.click();
        let viewCase = await this.page.locator("//span[text()=' VIEW CASE ']").scrollIntoViewIfNeeded().then(() => this.sleep(2000));
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Components Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Payment Details']").click());
        viewCase;
        await this.sleep(1000).then(() => this.paymentReference);
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));
        await this.amountContributedTypeLIT();
        await this.amountContributedTypeGCC();
        await this.amountContributedTypeSEC();


    }

    async amountContributedTypeLIT() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let litType = await this.page.locator("//div[@class='cell']/following::div[text()='LIT']").first();
        litType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => litType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from LISTO is: ${amount}`);

    }

    async amountContributedTypeGCC() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let gccType = await this.page.locator("//div[@class='cell']/following::div[text()='GCC']").first();
        gccType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => gccType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Co-Contribution is: ${amount}`);

    }

    async amountContributedTypeSEC() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let secType = await this.page.locator("//div[@class='cell']/following::div[text()='GCC']").first();
        secType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => secType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from SHA - Employer is: ${amount}`);

    }

    async getPayrollNumber() {
        const payrollNumber = await this.page.locator("//p[text()='Payroll number identifier']/following::p[@class='font-semibold']").textContent();
        return payrollNumber ? payrollNumber.trim() : null;
    }
    async exitAccountTable(IsFullExit?: boolean) {
        if (IsFullExit) {
            let Table = await this.page.locator("//table[@class='el-table__body']/tbody[1]/tr[1]/td[6]/div[1]/span[1]");
            await this.sleep(3000).then(() => { Table.scrollIntoViewIfNeeded() });
            await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Exited Accounts'));
            await Table.click();
        } else {
            (await this.sleep(3000).then(() => this.page.locator("//button[text()='Overview']/following-sibling::button"))).click();
        }

        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
        let transactionType = (await this.sleep(3000).then(() => this.page.locator("//div[@class='cell']/following::div[text()='RLI']"))).first();
        transactionType.scrollIntoViewIfNeeded().then(() => this.sleep(3000));
        transactionType.click();
        let viewCase = await this.page.locator("//span[text()=' VIEW CASE ']").scrollIntoViewIfNeeded().then(() => this.sleep(2000));
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Components Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Payment Details']").click());
        viewCase;
        await this.sleep(1000).then(() => this.paymentReference);
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));
        viewCase;

    }

    async rolloutType() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let rollout = await this.page.locator("//div[@class='cell']/following::div[text()='RLOP']").first();
        rollout.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => rollout.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount Transferred to Member after rollout transaction is: ${amount}`);

    }

    async rolloverTypeRLO() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let transactionType = (await this.sleep(3000).then(() => this.page.locator("//div[@class='cell']/following::div[text()='RLO']"))).first();
        transactionType.scrollIntoViewIfNeeded().then(() => this.sleep(3000));
        transactionType.click();
        let viewCase = await this.page.locator("//span[text()=' VIEW CASE ']").scrollIntoViewIfNeeded().then(() => this.sleep(2000));
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Components Screen'));
        await this.sleep(3000).then(() => this.page.locator("//span[text()='Payment Details']").click());
        viewCase;
        await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));

    }



    async amountContributedTypeGCTARP() {
        (await this.sleep(3000).then(() => this.page.locator("//i[@class='el-icon el-dialog__close']"))).click();
        let GCTARPType = await this.page.locator("//div[@class='cell']/following::div[text()='GCTARP']").first();
        GCTARPType.scrollIntoViewIfNeeded().then(() => this.sleep(2000)).then(() => GCTARPType.click());
        await this.transactionsMessage();
        let amount = await this.getAmountContributed();
        allure.logStep(`Government Amendment of a Contribution Payment is: ${amount}`);

    }

    async amountContributedTypeGCTAR_SGC() {
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Overview']/following-sibling::button"))).click();
        (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
        await this.sleep(3000);
        let sgcType = await this.page.locator("//div[@class='cell']/following::div[text()='SGC']").first();
        await sgcType.scrollIntoViewIfNeeded();
        await this.sleep(2000);
        await sgcType.click();
        await this.transactionsMessage(); // Assuming this method performs some actions
        let amount = await this.getAmountContributed();
        allure.logStep(`Amount contributed from Super Guarantee is: ${amount}`);
        const message = await this.getMessageType();
        allure.logStep(`Message Type expected for this contribution is: ${message}`);
    }

    async bankFile() {
        await this.page.locator("//a[.='Banking']").click();
        (await this.sleep(3000).then(() => this.page.locator("//span[text()=' Upload File ']"))).click();
        (await this.sleep(3000).then(() => this.page.locator("(//label[text()='Search Related Cases ']/following::input)[2]"))).click();
        (await this.sleep(3000).then(() => this.page.locator("//input[@class='el-input__inner']/following::span[text()='ANZ CSV']"))).click();

    }


    async uploadFile(templateFileName: string): Promise<string | null> {
        try {
            console.log("Waiting for file chooser event...");
            const fileChooserPromise = this.page.waitForEvent('filechooser');

            // Click the "Choose File" button to trigger the file chooser dialog
            await (await this.sleep(3000).then(() => this.page.getByRole('button', { name: 'Choose File' }))).click({ force: true });

            // Generate the file name
            let formattedDate: string = DateUtils.yyyymmddStringDate();
            formattedDate = DateUtils.yyyymmddStringDate();
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const fileName = `ANZBank_error_${formattedDate}_1${randomThreeDigitNumber}.csv`;

            // Copy the template file to the processed folder with the generated file name
            xmlUtility.copyTemplateFileToProcessedFolder(templateFileName, fileName);
            console.log("File chooser event detected.");

            // Wait for the file chooser dialog and set the files to be uploaded
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(path.join(__dirname, `../../../src/aol/data/superstream_processed/${fileName}`));

            // Click the upload button
            await (await this.sleep(3000).then(() => this.page.locator("//span[text()=' Upload ']"))).click();


            // Return the fileName after upload
            return fileName;
        } catch (error) {
            console.error("Error selecting file:", error);
            return null; // Return null in case of error
        }
    }




    async fileValidation(fileName: string) {
        await this.sleep(3000).then(() => this.page.reload());
        await this.page.locator("//span[text()=' FILTER ']").click();
        (await this.sleep(3000).then(() => this.page.locator("(//div[text()='File name'])[2]"))).click();
        (await this.sleep(3000).then(() => this.page.locator("//label[text()='File name']/following::input"))).fill(fileName);
        await this.page.getByRole('button', { name: 'APPLY' }).click();
        allure.logStep('File that is uploaded : ' + fileName);

    }

    async uploadedcsvFileIs() {
        const uploadedFile = await this.page.locator("//table[@class='el-table__body']/tbody[1]/tr[1]/td[6]/div[1]/span[1]").textContent();
        return uploadedFile ? uploadedFile.trim() : null;
        if (uploadedFile == 'Failed Process') {
            allure.logStep("File is uploaded sucessfully but the validation has been failed ")
        } else {
            allure.logStep("File is uploaded sucessfully and the validation has been passed ")
        }
    }

    async uploadEditedCSVFile(templateFileName: string) {

        try {
            console.log("Waiting for file chooser event...");
            const fileChooserPromise = this.page.waitForEvent('filechooser');

            // Click the "Choose File" button to trigger the file chooser dialog
            await (await this.sleep(3000).then(() => this.page.getByRole('button', { name: 'Choose File' }))).click({ force: true });

            // Generate the file name
            let formattedDate: string = DateUtils.yyyymmddStringDate();
            formattedDate = DateUtils.yyyymmddStringDate();
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const fileName = `ANZBank_Success_${formattedDate}_${randomThreeDigitNumber}.csv`;

            // Copy the template file to the processed folder with the generated file name
            xmlUtility.copyTemplateFileToProcessedFolder(templateFileName, fileName);

            // Edit the CSV file to update the "Value Date" and "Post Date" columns to today's date
            const csvFilePath = path.join(__dirname, `../../../src/aol/data/superstream_processed/${fileName}`);
            const dateToBeChanged = DateUtils.ddMMMyyyFormatDate(new Date());
            await csv_utils.editAndSaveCSV(csvFilePath, dateToBeChanged, dateToBeChanged, dateToBeChanged);

            // Wait for the file chooser dialog and set the files to be uploaded
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(csvFilePath);

            // Click the upload button
            await (await this.sleep(3000).then(() => this.page.locator("//span[text()=' Upload ']"))).click();

            // Return the fileName after upload
            return fileName;
        } catch (error) {
            console.error("Error selecting file:", error);
            return null; // Return null in case of error
        }
    }

    async verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToAnotherOption() {
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.viewCases.click({ timeout: 5000 });
        await this.createCase.click({ timeout: 15000 });
        await this.investmentDropDown.click();
        await this,this.sleep(3000);
        await this.conservative.scrollIntoViewIfNeeded();
        await this.conservative.click({force:true});
        await this.conservative.press('Enter');
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('100');
        await this.addBtn.click();
        await this.sleep(3000);
        //await this.investmentDropDown1.click();
        //await this.sustainableGrowth.click();
        //await this.balanceAllocation1.fill('0');
        //await this.transactionAllocation1.fill('50');
        //await this.addBtn1.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click();
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.sleep(2000);
        await this.viewCases.click({ timeout: 15000 });
        await this.sleep(2000);
        await this.createCase.click({ timeout: 15000 });
        await this.sleep(2000);
        await this.investmentDropDown.click();
        await this.australianShares.click();
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('100');
        await this.addBtn.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click();
        await expect(this.page.getByTitle('Conservative')).toContainText('Conservative');
    }


    async verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToMultipleOption() {
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.viewCases.click({ timeout: 15000 });
        await this.createCase.click({ timeout: 15000 });
        await this.investmentDropDown.click();
        await this.highGrowth.click();
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('100');
        await this.addBtn.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click()
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.sleep(2000);
        await this.viewCases.click({ timeout: 15000 });
        await this.sleep(2000);
        await this.createCase.click({ timeout: 15000 });
        await this.sleep(2000);
        await this.investmentDropDown.click();
        await this.conservative.click();
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('50');
        await this.addBtn.click();
        await this.investmentDropDown1.click();
        await this.sustainbleGrowth1.click();
        await this.balanceAllocation1.fill('0');
        await this.transactionAllocation1.fill('50');
        await this.addBtn1.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click()
        //await expect(this.page.getByTitle('Conservative')).toContainText('Conservative');
        await this.globalPage.captureScreenshot();
    }

    async verifyCombinedSwitchProcessedSuccessfullyForMoreThanOneOptionToSingleOption() {
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.viewCases.click({ timeout: 15000 });
        await this.createCase.click({ timeout: 15000 });
        await this.investmentDropDown.click();
        await this.conservative.click();
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('50');
        await this.addBtn.click();
        await this.investmentDropDown1.click();
        await this.australianShares.click();
        await this.balanceAllocation1.fill('0');
        await this.transactionAllocation1.fill('50');
        await this.addBtn1.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click();
        await this.investementBalancesTab.click();
        await this.investmentEditBtn.click();
        await this.viewCases.click({ timeout: 15000 });
        await this.createCase.click({ timeout: 15000 });
        await this.investmentDropDown.click();
        await this.highGrowth.click();
        await this.balanceAllocation.fill('0');
        await this.transactionAllocation.fill('100');
        await this.addBtn.click();
        await this.linkCase.click({ timeout: 10000 });
        await this.reviewCase.reviewCaseProcess(this.verifySwitchSuccess);
        await this.leftArrow.click();
        await this.investmentProfileDropDown.click();
        //await expect(this.page.getByTitle('Conservative')).toContainText('Conservative');
        await this.globalPage.captureScreenshot();
    }

    async verifySuperstreamProcessForVG(superstreamProcess: string, expectedTexts: string[]) {
        await this.page.locator("(//a[@class='NxLAj'])[1]").click();
        await this.processeslink.click();
        await this.sleep(3000);
        await this.reloadPageWithDelay(this.page, 1);
        await this.page.locator(`//div[text()='${superstreamProcess}']`).first().click()
        await this.sleep(2000);
        let process = await this.page.locator("(//div[@class='cell']//span)[1]");
        if (await process.innerText() === "In Review") {
            await this.page.getByText('In Review').click({ force: true });
        } else if (await process.innerText() === "In Progress") {
            await this.page.locator("//span[text()='In Progress ']").click({ force: true });
        }
        else if (await process.innerText() === "Pending") {
            await this.page.getByRole('cell', { name: 'Pending' }).locator('span').click({ force: true });
        }
        else {
            await this.page.getByRole('cell', { name: 'Closed' }).click({ force: true });
        }
    
        for (const expectedText of expectedTexts) {
            await this.reviewCaseProcess(this.rollOut_VG, expectedText);
        }
    }
    
    async reviewCaseProcess(successLocator: Locator, expectedText: string) {
        console.log('Case ID: ' + await this.caseID.textContent());
    
        // Review case process steps, approve/retry or exit on exception
        do {
            // Approve step
            if (await this.approveProcessStep.count() > 0) {
                try {
                    await this.approveProcessStep.click({ timeout: 5000 });
                } catch (TimeoutException) { }
            }
    
            // Retry step
            if (await this.retryProcessStep.count() > 0) {
                try {
                    await this.retryProcessStep.click({ timeout: 5000 });
                } catch (TimeoutException) { }
            }
    
            // Break if there is a process exception
            if (await this.processException.count() > 0) {
                throw new AssertionError({ message: "Case Process has Failed" });
            }
    
            await this.sleep(5000);
    
        } while (await successLocator.count() === 0);
    
        await successLocator.scrollIntoViewIfNeeded();
        await expect(successLocator).toBeVisible();
    
        // Check if the expected text is present
        await this.waitForTextMatch("(//div[contains(@class,'leading-snug break-words')]//p)[1]", expectedText);
    
        // Log the completion of the process
        console.log(`Process step completed with note: ${expectedText}`);
    }
    
    // Define the waitForTextMatch method to accept a string selector
    async waitForTextMatch(selector: string, expectedText: string, timeout: number = 30000) {
        // Use the provided selector to locate the element
        const element = await this.page.locator(selector);
        if (!element) {
            throw new Error(`Element with selector '${selector}' not found`);
        }
    
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            await this.sleep(1000); // Adjust the delay as per your requirement
    
            // Get the text content of the element
            const text = await element.textContent();
            if (text && text.trim() === expectedText) {
                return; // Text content matches, exit the loop
            }
        }
    
        throw new Error(`Timeout: Text '${expectedText}' not found within ${timeout}ms`);
    }
    

}






