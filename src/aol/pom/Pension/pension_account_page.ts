import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { Navbar } from "../component/navbar";
import * as member from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { AssertionError } from "assert";
import { UtilsAOL } from "../../utils_aol";

export class PensionShellAccount extends BasePage {


  readonly navbar: Navbar;
  readonly addMemberButton: Locator;

  //Add Member
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

  //Random members 

  readonly memberGivenName: string;
  readonly memberSurname: string;

  //Consolidation Details

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

  //Beneficiaries
  readonly beneficiaryName: Locator;
  readonly addNewBeneficiary: Locator;
  readonly beneficiaryRelation: Locator;
  readonly beneficiaryRelationSelect: Locator;
  readonly beneficiaryEffectiveDate: Locator;
  readonly gender_select: Locator;
  readonly select_gender: Locator;
  readonly beneficiaryContactName: Locator;
  readonly beneficiaryAddress1: Locator;
  readonly countrySelect: Locator;
  readonly selectCountry: Locator;
  readonly beneficiaryCity: Locator;
  readonly beneficiaryState: Locator;
  readonly beneficiaryStateSelect: Locator;
  readonly beneficiaryPostcode: Locator;
  readonly beneficiarySave: Locator;

  //pensions
  readonly payment_frequency_select: Locator;
  readonly payment_frequency: Locator;
  readonly PensionPaymentDate: Locator;
  readonly proRata: Locator;
  readonly eligibilty: Locator;
  readonly select_eligibility: Locator;
  readonly annual_payment: Locator;
  readonly select_payment: Locator;

  //Bank Acc

  readonly bsb: Locator;
  readonly banks: Locator;
  readonly accountName: Locator;
  readonly accountNo: Locator;
  readonly search_option: Locator;
  readonly pension_payment: Locator;
  readonly drop_down: Locator;
  readonly drop_down_select: Locator;

  //case

  readonly viewCase: Locator;
  readonly createCase: Locator;
  readonly linkCase: Locator;
  readonly approveProcessStep: Locator;
  readonly retryProcessStep: Locator;
  readonly verifyShellAccountCreation: Locator;
  readonly close_left: Locator;
  readonly acknowledgeCheckbox: Locator;
  readonly createAcc: Locator

  //Exceptions
  readonly processException: Locator;

  constructor(page: Page) {
    super(page)

    this.navbar = new Navbar(page);
    this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });

    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")
    //Add member
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
    this.nextStep = page.getByRole('button', { name: 'Next Step arrow-right icon' });

    //Consolidate step
    this.addFund = page.getByRole('button', { name: 'add-circle icon Add Fund' });
    this.addFundSelect = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.addFundSelectOption = page.getByText('External fund account');
    this.memberAccountNumber = page.getByLabel('Member account number *');
    this.USI = page.getByLabel('USI *');
    this.enterAmount = page.getByPlaceholder('0');
    this.saveFundDetails = page.getByRole('button', { name: 'SAVE' });

    //Investment step
    this.invSelect = page.getByRole('textbox', { name: 'Select' });
    this.invSelection = page.locator("(//ul[@class='el-scrollbar__view el-select-dropdown__list'])[2]/li[1]");
    //this.invSelection = page.getByText('Australian Shares', { exact: true });
    this.invPercentage = page.getByRole('textbox').nth(1);
    this.saveInv = page.getByRole('button', { name: 'Add' });

    //Beneficiaries step
    this.addNewBeneficiary = page.locator('(//h2[@class="heading-md mb-5"]/following::span[@class="text-caption"])[1]');
    this.beneficiaryName = page.getByLabel('Beneficiary Name *');
    this.beneficiaryRelation = page.locator('#gs6__combobox div').first();
    this.beneficiaryRelationSelect = page.getByText('Spouse');
    this.beneficiaryEffectiveDate = page.getByPlaceholder('dd/mm/yyyy');
    this.select_gender = page.getByText('Male', { exact: true });
    this.gender_select = page.locator('#gs7__combobox div').first();
    this.beneficiaryContactName = page.getByLabel('Contact First Name');
    this.countrySelect = page.locator('#gs8__combobox div').first();
    this.selectCountry = page.getByRole('option', { name: 'Australia' });
    this.beneficiaryAddress1 = page.getByLabel('Residential Address 1 *');
    this.beneficiaryCity = page.getByLabel('City/Town *');
    this.beneficiaryState = page.locator('#gs9__combobox div').first();
    this.beneficiaryStateSelect = page.getByText('Australian Antarctic Territory');
    this.beneficiaryPostcode = page.getByLabel('Postcode *');
    this.beneficiarySave = page.getByRole('button', { name: 'SAVE' }).first()

    //pension step
    this.payment_frequency_select = page.getByTitle('Payment Frequency').getByPlaceholder('Select');
    this.payment_frequency = page.locator('li').filter({ hasText: 'Fortnightly' });
    this.PensionPaymentDate = page.getByPlaceholder('dd/mm/yyyy');
    this.proRata = page.getByText('Yes').first();
    this.eligibilty = page.getByTitle('Eligibilty Type').getByPlaceholder('Select');
    this.select_eligibility = page.locator('li').filter({ hasText: '65 or older' });
    this.annual_payment = page.getByTitle('Annual Payment Amount').getByPlaceholder('Select');
    this.select_payment = page.locator('li').filter({ hasText: 'Minimum Amount' });

    //Bank Acc

    this.bsb = page.getByLabel('BSB Number *');
    this.banks = page.locator('div').filter({ hasText: /^Bank$/ }).locator('div');
    this.accountName = page.getByLabel('Account Name *');
    this.accountNo = page.getByLabel('Account Number *');
    this.search_option = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.pension_payment = page.getByText('Pension Payment', { exact: true });
    this.drop_down = page.getByTitle('Drawdown Option').getByPlaceholder('Select');
    this.drop_down_select = page.locator('li').filter({ hasText: 'Proportional' });

    //case
    this.viewCase = page.getByRole('button', { name: 'View Cases' });
    this.createCase = page.getByRole('button', { name: 'Create Case' });
    this.linkCase = page.getByRole('button', { name: 'Link to Case' });
    this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
    this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
    this.verifyShellAccountCreation = page.locator('//*[@class = "gs-column full-row-gutter font-semibold"]/following::div[@class="text-neutral-600" and text()= "SuperStream - Initiated Roll In"]');
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.acknowledgeCheckbox = page.locator('.checkbox-indicator');
    this.createAcc = page.getByRole('button', { name: 'Create Account' });
  }

  async navigateToPensionMemberPage() {
    await this.navbar.navigateToPensionMembersPage();
  }

  async addMemberPersonalDetails(uniqueSurname: string) {

    //let tfns = TFN.getValidTFN();
    await this.title.click();
    await this.selectTitle.click();
    await this.givenName.fill(this.memberGivenName);
    await this.surname.fill(uniqueSurname);
    await this.dob.fill(member.dob);
    await this.gender.click();
    await this.genderSelect.click();
    await this.emailAddress.fill(member.email);
    await this.primaryPhone.fill(member.phone);
    await this.preferredContactMethod.click();
    await this.preferredContactMethodSelect.click();
    //await this.tfn.click();
    //await this.tfn.fill(tfns.tfn);
    await this.address1.fill(member.address);
    await this.city.click();
    await this.city.fill(member.city);
    await this.state.click();
    await this.stateSelect.click();
    await this.postcode.fill(member.postcode);
    await this.preferredContactName.fill(this.memberGivenName);
    await this.residencyStatus.click();
    await this.residencyStatusSelect.click();
    await this.nextStep.click();
    //return this.memberSurname;
  }

  async addMemberConsolidation() {
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
  }

  async addMemberInvestments() {
    await this.invSelect.click();
    await this.invSelection.click();
    await this.invPercentage.fill('100');
    await this.saveInv.click();
    await this.nextStep.click();
  }

  async addMemberBeneficiaries() {
    await this.addNewBeneficiary.click();
    await this.beneficiaryName.fill(member.beneficiary);
    await this.beneficiaryRelation.click();
    await this.beneficiaryRelationSelect.click();
    await this.beneficiaryEffectiveDate.fill(member.beneficiaryDOB);
    await this.beneficiaryEffectiveDate.press('Tab');
    await this.gender_select.click();
    await this.select_gender.click();
    await this.countrySelect.click();
    await this.selectCountry.click();
    await this.beneficiaryAddress1.fill(member.address);
    await this.beneficiaryCity.fill(member.city);
    await this.beneficiaryState.click();
    await this.beneficiaryStateSelect.click();
    await this.beneficiaryPostcode.fill(member.postcode);
    await this.beneficiarySave.click();
    await this.nextStep.click();
  }

  async addMemberPensionDetails() {
    await this.payment_frequency_select.click();
    await this.payment_frequency.click();
    await this.PensionPaymentDate.click();
    await this.PensionPaymentDate.fill(`${DateUtils.ddmmyyyStringDate(10)}`);
    await this.PensionPaymentDate.press('Enter');
    await this.proRata.hover();
    await this.proRata.click();
    await this.eligibilty.click();
    await this.select_eligibility.click();
    await this.annual_payment.click();
    await this.select_payment.click();
    await this.sleep(5000);
    await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await this.bsb.scrollIntoViewIfNeeded();
    await this.bsb.click();
    await this.bsb.fill(member.BSBNumber);
    await this.banks.click();
    await this.accountName.click();
    await this.accountName.fill(member.AccountName);
    await this.accountNo.click();
    await this.accountNo.fill(member.AccountNumber);
    await this.search_option.click();
    await this.pension_payment.click();
    await this.drop_down.click();
    await this.drop_down_select.click();

  }

  async initCreateCase() {
    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);
    await this.acknowledgeCheckbox.click();
  }

  async createAccount() {

    await this.createAcc.click();

    //Review case process steps, approve/retry or exit on exception
    do {
      //Approve step
      if (await this.approveProcessStep.count() > 0) {
        try {
          await this.approveProcessStep.click({ timeout: 5000 });
        }
        catch (TimeoutException) {
        }
      }

      //Retry step
      if (await this.retryProcessStep.count() > 0) {
        try {
          await this.retryProcessStep.click({ timeout: 5000 });
        }
        catch (TimeoutException) {
        }
      }

      //Break if there is an process exception
      if (await this.processException.count() > 0) {
        throw new AssertionError({ message: "Error in Processing Case" });
      }

    } while (await this.verifyShellAccountCreation.count() == 0);

    await expect(this.verifyShellAccountCreation).toBeVisible();
  }

  async createShellAccount(uniqueSurname: string) {

    await this.addMemberButton.click();
    await this.addMemberPersonalDetails(uniqueSurname);
    await this.addMemberConsolidation();
    await this.addMemberInvestments();
    await this.addMemberBeneficiaries();
    await this.addMemberPensionDetails();
    await this.initCreateCase();
    await this.createAccount();

  }
}