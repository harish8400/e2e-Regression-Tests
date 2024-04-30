import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { Navbar } from "../component/navbar";
import * as member from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { AssertionError } from "assert";
import { UtilsAOL } from "../../utils_aol";
import { ReviewCase } from "../component/review_case";
import { DashboardPage } from "../dashboard_page";
import { allure } from "allure-playwright";
import { GlobalPage } from "../component/global_page";

export class PensionShellAccount extends BasePage {

  readonly navbar: Navbar;
  readonly addMemberButton: Locator;
  readonly shellAccountCreationSuccess: Locator;
  readonly reviewCase: ReviewCase;

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
  readonly createdMemberCaseLink: Locator;
  readonly memberID: Locator;

  //Random members 

  readonly memberGivenName: string;
  readonly memberSurname: string;

  //Consolidation Details

  //Consolidation
  readonly addFund: Locator;
  readonly addFundSelect: Locator;
  readonly memberAccountNumber: Locator;
  readonly sourceAccountNumber: Locator;
  readonly slider: Locator;
  readonly addFundSelectOption: Locator;
  readonly enterAmount: Locator;
  readonly amount: Locator;
  readonly amountToBeEntered: Locator;
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
  readonly taxThreshold: Locator;
  readonly eligibilty: Locator;
  readonly select_eligibility: Locator;
  readonly annual_payment: Locator;
  readonly select_payment: Locator;
  readonly clipBoard_icon: Locator;

  //Pension Commencement
  readonly editButton: Locator;
  readonly Pro_rataYes: Locator;
  readonly eligibilityType: Locator;
  readonly eligibility_65orOlder: Locator;
  readonly firstPaymentDate: Locator;

  //Bank Acc

  readonly bsb: Locator;
  readonly banks: Locator;
  readonly accountName: Locator;
  readonly accountNo: Locator;
  readonly search_option: Locator;
  readonly pension_payment: Locator;
  readonly drop_down: Locator;
  readonly drop_down_select: Locator;

  //Edit Pension Payment Details
  readonly pensionTab: Locator;
  readonly editIcon: Locator;
  readonly frequency: Locator;
  readonly frequencyValue1: Locator;
  readonly frequencyValue2: Locator;
  readonly frequencyValue3: Locator;
  readonly nextPaymentDate: Locator;
  readonly annualPaymentMethod: Locator;
  readonly annualPaymentMethodValue: Locator;
  readonly buttonViewCase: Locator;
  readonly buttonLinkToCase: Locator;

  //Investments and Balances
  readonly investmentsAndBalancesTab: Locator;
  readonly investmentIDs: Locator
  readonly drawdownOrder: Locator;
  readonly drawdowanOption: Locator;
  readonly dradownOrderValues: Locator;
  readonly editDrawdown: Locator;
  readonly tableLocator: Locator;
  readonly dashboard_page: DashboardPage;

  //case

  readonly viewCase: Locator;
  readonly createCase: Locator;
  readonly linkCase: Locator;
  readonly approveProcessStep: Locator;
  readonly retryProcessStep: Locator;
  readonly successMessage: Locator;
  readonly verifyShellAccountCreation: Locator;
  readonly close_left: Locator;
  readonly acknowledgeCheckbox: Locator;
  readonly createAcc: Locator

  //Exceptions
  readonly processException: Locator;
  readonly abpScreen: Locator;

  //process link
  readonly processesLink: Locator;
  readonly shellaccount: Locator;
  readonly review: Locator;
  readonly transactionsTab: Locator;
  readonly abpScreenView: Locator;
  readonly ttrScreenView: Locator;
  readonly memberOverview: Locator;
  readonly addAccount: Locator;
  readonly abp: Locator;
  readonly ttr: Locator;
  readonly globalPage: GlobalPage;
  readonly pensionHistory: Locator;
  readonly regularPensionAmount: Locator;
  readonly caseHeading: Locator;

  constructor(page: Page) {
    super(page)
    this.dashboard_page = new DashboardPage(page);
    this.globalPage = new GlobalPage(page);
    this.reviewCase = new ReviewCase(page);
    this.navbar = new Navbar(page);
    this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });

    this.shellAccountCreationSuccess = page.getByText('Roll-ins are complete.');
    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")
    //Add member
    this.memberGivenName = UtilsAOL.randomName();
    this.memberSurname = UtilsAOL.randomSurname(5);
    this.title = page.getByTitle('Title').getByRole('img');
    this.selectTitle = page.locator('li').filter({ hasText: /^Mr$/ });
    this.givenName = page.getByTitle('Given Name').getByRole('textbox');
    this.surname = page.getByTitle('Surname').getByRole('textbox');
    this.dob = page.getByTitle('DOB').getByPlaceholder('dd/mm/yyyy');
    this.gender = page.locator('.gs__actions').nth(2);
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
    this.createdMemberCaseLink = page.locator("//a[@class='gs-link text-teal-300 cursor-pointer relative no-underline font-bold']");
    this.memberID = page.locator("(//p[@data-cy='info-value'])[2]");
    //Consolidate step
    this.addFund = page.getByRole('button', { name: 'add-circle icon Add Fund' });
    this.addFundSelect = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.addFundSelectOption = page.getByText('Internal fund account');
    this.memberAccountNumber = page.locator("(//input[@class='gs__search'])[3]");

    this.sourceAccountNumber = page.locator('.gs__actions').nth(2);
    this.slider = page.locator('.switch-slider');
    this.enterAmount = page.locator('//input[@id="transferAmount"]/parent::div');
    this.amount = page.locator('//input[@id="transferAmount"]');
    this.amountToBeEntered = page.getByPlaceholder('0');
    this.saveFundDetails = page.getByRole('button', { name: 'SAVE' });

    //Investment step
    this.invSelect = page.getByRole('main').getByPlaceholder('Select');
    this.invSelection = page.locator("(//ul[@class='el-scrollbar__view el-select-dropdown__list'])[2]/li[1]");
    //this.invSelection = page.getByText('Australian Shares', { exact: true });
    this.invPercentage = page.getByRole('textbox').nth(2);
    this.saveInv = page.getByRole('button', { name: 'Add', exact: true })

    //Beneficiaries step
    this.addNewBeneficiary = page.locator('(//h2[@class="heading-md mb-5"]/following::span[@class="text-caption"])[1]');
    this.beneficiaryName = page.getByLabel('Beneficiary Name *');
    this.beneficiaryRelation = page.locator('.gs__actions').nth(1);
    this.beneficiaryRelationSelect = page.getByRole('option', { name: 'Spouse' })
    this.beneficiaryEffectiveDate = page.getByPlaceholder('dd/mm/yyyy');
    this.select_gender = page.getByRole('option', { name: 'Male', exact: true })
    this.gender_select = page.locator('.gs__actions').nth(2);
    this.beneficiaryContactName = page.getByLabel('Contact First Name');
    this.countrySelect = page.locator('.gs__actions').nth(3);
    this.selectCountry = page.getByRole('option', { name: 'Australia' });
    this.beneficiaryAddress1 = page.getByLabel('Residential Address 1 *');
    this.beneficiaryCity = page.getByLabel('City/Town *');
    this.beneficiaryState = page.locator('.gs__actions').nth(4);
    this.beneficiaryStateSelect = page.getByText('Australian Antarctic Territory');
    this.beneficiaryPostcode = page.getByLabel('Postcode *');
    this.beneficiarySave = page.getByRole('button', { name: 'SAVE' }).first()

    //pension step
    this.payment_frequency_select = page.getByTitle('Payment Frequency').getByPlaceholder('Select');
    this.payment_frequency = page.locator('li').filter({ hasText: 'Monthly' })
    this.PensionPaymentDate = page.getByPlaceholder('dd/mm/yyyy');
    this.proRata = page.locator("(//label[text()='Yes'])[1]");
    this.taxThreshold = page.locator("(//label[text()='Yes'])[2]");
    this.eligibilty = page.getByTitle('Eligibilty Type').getByPlaceholder('Select');
    this.select_eligibility = page.locator('li').filter({ hasText: 'Reached Preservation Age' })
    this.annual_payment = page.getByTitle('Annual Payment Amount').getByPlaceholder('Select');
    this.select_payment = page.locator('li').filter({ hasText: 'Minimum Amount' });
    this.clipBoard_icon = page.getByRole('button', { name: 'arrow-left icon clipboard-' });

    //Bank Acc

    this.bsb = page.getByLabel('BSB Number *');
    this.banks = page.locator('div').filter({ hasText: /^Bank$/ }).locator('div');
    this.accountName = page.getByLabel('Account Name *');
    this.accountNo = page.getByLabel('Account Number *');
    this.search_option = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.pension_payment = page.getByText('Pension Payment', { exact: true });
    this.drop_down = page.getByTitle('Drawdown Option').getByPlaceholder('Select');
    this.drop_down_select = page.locator('li').filter({ hasText: 'Proportional' });

    // Edit Pension Peyment Details for existing member
    this.pensionTab = page.getByRole('button', { name: 'Pension' });
    this.editIcon = page.locator('button').filter({ hasText: 'Edit Content' }).nth(1);
    this.frequency = page.locator('#gs2__combobox').getByLabel('Select', { exact: true });
    this.frequencyValue1 = page.getByRole('option', { name: 'Monthly' });
    this.frequencyValue2 = page.getByRole('option', { name: 'Quarterly' });
    this.frequencyValue3 = page.getByRole('option', { name: 'Bi-Annually', exact: true });
    this.nextPaymentDate = page.locator("//input[@name='nextPaymentDate']");
    this.annualPaymentMethod = page.locator('#gs3__combobox').getByLabel('Select', { exact: true });
    this.annualPaymentMethodValue = page.getByRole('option', { name: 'Minimum Amount' });

    this.buttonViewCase = page.getByRole('button', { name: 'View Cases' }).nth(1);
    this.buttonLinkToCase = page.getByRole('button', { name: 'Link to Case', exact: true });

    //Investments & Drawdown Order
    this.tableLocator = page.locator("(//div[@class='el-table__body-wrapper is-scrolling-none']/table)[5]");
    this.investmentsAndBalancesTab = page.getByRole('button', { name: 'Investments and Balances' });
    this.investmentIDs = page.locator("(//tbody)[4]/tr/td[2]");
    this.dradownOrderValues = page.locator("//input[@class='el-input__inner']");
    this.drawdownOrder = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
    this.drawdowanOption = page.getByText('Specified Order');
    this.editDrawdown = page.getByRole('main').locator('section').filter({ hasText: 'Pension Drawdown Details Edit' }).getByRole('button');

    //pension commencement
    this.editButton = page.locator('button').filter({ hasText: 'Edit Content' }).first();
    this.Pro_rataYes = page.locator('label').filter({ hasText: 'Yes' }).locator('span').first();
    this.eligibilityType = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
    this.eligibility_65orOlder = page.getByRole('option', { name: 'or older' });
    this.firstPaymentDate = page.getByPlaceholder('dd/mm/yyyy');

    //case
    this.viewCase = page.getByRole('button', { name: 'View Cases' });
    this.createCase = page.getByRole('button', { name: 'Create Case' });
    this.linkCase = page.getByRole('button', { name: 'Link to Case' });
    this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
    this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
    this.successMessage = page.getByText('Processed insert pension history');
    this.verifyShellAccountCreation = page.locator('//*[@class = "gs-column full-row-gutter font-semibold"]/following::div[@class="text-neutral-600" and text()= "SuperStream - Initiated Roll In"]');
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.acknowledgeCheckbox = page.locator('.checkbox-indicator');
    this.createAcc = page.getByRole('button', { name: 'Create Account' });
    //process link
    this.processesLink = page.getByRole('link', { name: 'Processes' });
    this.shellaccount = page.locator('//div[text()="Pension Shell Account - Create"][1]').first();
    this.review = page.locator('//span[text()="In Review"]');
    this.abpScreen = page.locator('//button[@data-cy-value="DltaIdentity"]/following-sibling::button[1]');
    this.transactionsTab = page.locator('//button[text()="Transactions"]');
    this.abpScreenView = page.getByRole('button', { name: 'HESTA for Mercy Retirement' });
    this.ttrScreenView = page.locator("//button[text()='HESTA for Mercy Transition to Retirement']");
    this.memberOverview = page.locator("//*[@data-cy-value='DltaIdentity' and text()='Overview']");
    this.addAccount = page.getByRole('button', { name: 'Add new account' });
    this.abp = page.locator('//li[text()="HESTA for Mercy Retirement Income Stream"]');
    this.ttr = page.locator('//li[text()="HESTA for Mercy Transition to Retirement"]')
    const date = DateUtils.ddMMMyyyStringDate(new Date());
    this.pensionHistory = page.getByRole('row', { name: date+' Pension Payment Details Update' }).first();
    this.regularPensionAmount = page.locator('div').filter({ hasText: /^Regular Pension Payment Amount\$0\.00$/ }).first();
    this.caseHeading = page.getByRole('heading', { name: 'Pension - Update Payment' });
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

  async addMemberConsolidation(transferPartialBalance: boolean = false, memberNo: string = '') {
    await this.addFund.click();
    await this.addFundSelect.click();
    await this.addFundSelectOption.click();
    await this.sourceAccountNumber.click();
    await this.page.getByRole('option', { name: memberNo }).click();
    if (transferPartialBalance) {
      await this.slider.click();
      await this.enterAmount.click();
      await this.sleep(1000);
      await this.amount.fill(member.Amount);
      await this.sleep(1000);
    } else {
      await this.slider.click();
    }
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
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    await this.nextStep.click();
  }

  async addMemberPensionDetails() {
    await this.payment_frequency_select.click();
    await this.payment_frequency.click();
    await this.clipBoard_icon.click();
    await this.PensionPaymentDate.click();
    await this.PensionPaymentDate.fill(`${DateUtils.ddmmyyyStringDate(10)}`);
    await this.PensionPaymentDate.press('Enter');
    await this.sleep(2000);
    await this.proRata.click();
    await this.sleep(2000);
    //await this.taxThreshold.click();
    await this.sleep(2000);
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

  //To be deleted
  async createAccountCaseProcess() {

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

  async createShellAccount(uniqueSurname: string, addBeneficiary: boolean = false) {

    await this.addMemberButton.click();
    await this.addMemberPersonalDetails(uniqueSurname);
    await this.addMemberConsolidation(false);
    await this.addMemberInvestments();
    if (addBeneficiary) {
      await this.addMemberBeneficiaries();
    } else {
      await this.nextStep.click();
    }
    await this.addMemberPensionDetails();
    await this.initCreateCase();
    await this.createAcc.click();
    await this.reviewCase.reviewCaseProcess(this.shellAccountCreationSuccess);

  }

  async editPaymentDetails(frequency?: string) {
    await this.pensionTab.click();
    await this.sleep(8000);
    await this.editIcon.click();
    await this.sleep(3000)
    await this.frequency.click();
    if (frequency == 'Bi-Annualy') {
      await this.frequencyValue3.click();
    }
    else if (frequency == 'Quarterly') {
      await this.frequencyValue2.click();
    }
    else {
      await this.frequencyValue1.click();
    }
    await this.nextPaymentDate.fill(`${DateUtils.ddmmyyyStringDate(15)}`);
    await this.annualPaymentMethod.click();
    await this.annualPaymentMethodValue.click();
    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);
    await this.linkCase.click();
    await this.sleep(5000);
    await this.reviewCase.reviewCaseProcess(this.successMessage);

    await allure.step("Validate Correspondence is sent with success", async () => {
      allure.logStep("Verify Correspondence sent success is displayed")
      expect(this.successMessage).toBeVisible();
      await this.caseHeading.focus();
      await this.successMessage.scrollIntoViewIfNeeded();
      await this.globalPage.captureScreenshot("Correspondence triggered");
    });

    await allure.step("Validate Case is processed without error", async () => {
      await this.caseHeading.focus();
      await this.caseHeading.scrollIntoViewIfNeeded();
      await this.globalPage.captureScreenshot("Pension - Update case");
    });

    await allure.step("Validate New Pension History record", async () => {
      await expect(this.pensionHistory).toBeVisible();
      await this.pensionHistory.scrollIntoViewIfNeeded();
      await this.sleep(1000);
      await this.pensionHistory.click();
      await this.globalPage.captureScreenshot("New Pension History record");
    });

    this.regularPensionAmount.scrollIntoViewIfNeeded();
    //this.regularPensionAmount.focus();
    
  }

  async ProcessTab() {
    await this.processesLink.click();
    await this.sleep(3000);
    await this.shellaccount.click();
    await this.review.click();
    await this.sleep(3000)
  }

  async selectABPTab() {
    await this.sleep(3000)
    await this.abpScreenView.first().waitFor();
    await this.abpScreenView.first().click();
    await this.sleep(3000);
    await this.transactionsTab.click();

  }

  async getMemberId(account: string){
    await this.createdMemberCaseLink.click();
    await this.sleep(3000)
    if(account == 'ABP'){
    await this.abpScreenView.waitFor();
    await this.abpScreenView.click();
    }
    if(account == 'TTR'){
      await this.ttrScreenView.waitFor();
      await this.ttrScreenView.click();
    }
    if(account == 'Accumulation'){
      await this.page.getByRole('button', { name: 'HESTA for Mercy Super' }).waitFor();
      await this.page.getByRole('button', { name: 'HESTA for Mercy Super' }).click();
    }
    await this.sleep(3000);
    let memberNumber = await this.memberID.textContent();
    return memberNumber;
  }

  async selectTTRRetirement() {
    await this.sleep(3000)
    await this.ttrScreenView.first().waitFor();
    await this.ttrScreenView.first().click();
    await this.sleep(3000);
    await this.transactionsTab.click();

  }

  async createShellAccountExistingMember(addBeneficiary: boolean = false, memberNo: string = '') {

    await this.sleep(3000);
    await this.memberOverview.waitFor();
    await this.memberOverview.click();
    await this.addAccount.click();
    await this.abp.click();
    await this.preferredContactMethod.click();
    await this.preferredContactMethodSelect.click();
    await this.residencyStatus.click();
    await this.residencyStatusSelect.click();
    await this.nextStep.click();
    await this.addMemberConsolidation(true, memberNo);
    await this.addMemberInvestments();
    if (addBeneficiary) {
      await this.addMemberBeneficiaries();
    } else {

      await this.nextStep.click();
    }
    await this.addMemberPensionDetails();
    await this.sleep(3000);
    await this.initCreateCase();
    await this.createAcc.click();
    await this.reviewCase.reviewCaseProcess(this.shellAccountCreationSuccess);
    await this.reviewCase.captureScreenshot("Shell account creation");

  }

  async ttrAccountCreation(addBeneficiary: boolean = false) {
    await this.sleep(3000);
    await this.memberOverview.waitFor();
    await this.memberOverview.click();
    await this.addAccount.click();
    await this.ttr.click();
    await this.preferredContactMethod.click();
    await this.preferredContactMethodSelect.click();
    await this.residencyStatus.click();
    await this.residencyStatusSelect.click();
    await this.nextStep.click();
    await this.addMemberConsolidation();
    await this.addMemberInvestments();
    if (addBeneficiary) {
      await this.addMemberBeneficiaries();
    } else {

      await this.nextStep.click();
    }
    await this.addMemberPensionDetails();
    await this.sleep(3000);
    await this.initCreateCase();
    await this.createAcc.click();
    await this.reviewCase.reviewCaseProcess(this.shellAccountCreationSuccess);

  }



}