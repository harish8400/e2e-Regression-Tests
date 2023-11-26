import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { TFN } from "../data/tfn";
import { ProcessPage } from "./process_page";
import { DateUtils } from "../../utils/date_utils";

export class MemberPage extends BasePage { 

    readonly processPage: ProcessPage;
    readonly processesLink: Locator;

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

    readonly memberGivenName: string;


    constructor(page: Page) {
        super(page)

    this.processesLink = page.getByRole('link', { name: 'Processes' });
    this.processPage = new ProcessPage(page);

    this.memberGivenName = "Michelle";
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
    this.nextStep = page.getByRole('button', { name: 'Next Step arrow-right icon' });
    //Employer step
    this.employer = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
    this.employerSelect = page.getByText('woolworths');
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
    this.invSelection = page.getByText('Balanced Growth', { exact: true });
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

    }

    async addNewMember(){
        
        let tfns = TFN.getValidTFN();
        await this.title.click();
        await this.selectTitle.click();
        await this.givenName.fill(this.memberGivenName);
        await this.surname.fill('Faulkner');
        await this.dob.fill('01/01/2000');
        await this.gender.click();
        await this.genderSelect.click();
        await this.emailAddress.fill('anilkumar.shanthalingappa@grow.inc');
        await this.primaryPhone.fill('61412345678');
        await this.preferredContactMethod.click();
        await this.preferredContactMethodSelect.click();
        await this.tfn.click();
        await this.tfn.fill(tfns.tfn);
        await this.address1.fill('11 high street');
        await this.city.fill('Sydney');
        await this.state.click();
        await this.stateSelect.click();
        await this.postcode.fill('2000');
        await this.preferredContactName.fill(this.memberGivenName);
        await this.residencyStatus.click();
        await this.residencyStatusSelect.click();
        await this.nextStep.click();
        
        //Employer details
        await this.employer.click();
        await this.employerSelect.click();
        await this.employerStartDate.fill(`${DateUtils.ddmmyyyStringDate()}`)
        await this.employerSave.click();
        await this.nextStep.click();
        
        //Consolidation details
        await this.addFund.click();
        await this.addFundSelect.click();
        await this.addFundSelectOption.click();
        await this.memberAccountNumber.fill('AUS-ACC-102030');
        await this.USI.fill('STA0100AU');
        await this.USI.press('Tab');
        await this.enterAmount.fill('50000');
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
        await this.addNewBeneficiary.click();
        await this.beneficiaryName.fill('Rose');
        await this.beneficiaryName.press('Tab');
        await this.beneficiaryType.click();
        await this.beneficiaryRelation.click();
        await this.beneficiaryRelationSelect.click();
        await this.beneficiaryEffectiveDate.fill(`${DateUtils.ddmmyyyStringDate()}`);
        await this.beneficiaryEffectiveDate.press('Tab');
        await this.beneficiaryPercentage.fill('100');
        await this.beneficiarySave.click();
        
        //Create account
        await this.createAccount.click();
        return this.memberGivenName;
    }

    async selectMember(memberName: string){
        await this.page.getByRole('cell', { name: memberName }).first().click();
    }
}