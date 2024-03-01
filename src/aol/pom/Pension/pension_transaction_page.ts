import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { TFN } from "../data/tfn";
import * as pensions from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { Navbar } from "../component/navbar";
import { ReviewCase } from "../component/review_case";
import * as member from "../../data/member.json";
import { UtilsAOL } from "../../utils_aol";

export class PensionTransactionPage extends BasePage {

  readonly navbar: Navbar;

  //Rollover In
  readonly memberTransactionTab: Locator;
  readonly memberAddTransaction: Locator;
  readonly memberAddContribution: Locator;
  readonly USI: Locator;
  readonly account_number: Locator;
  readonly paymentReference: Locator;
  readonly paymentReceivedDate: Locator;
  readonly effectiveDate: Locator;
  readonly contributionAmount: Locator;
  readonly tax_component: Locator;
  readonly untaxed_component: Locator;
  readonly tax_free_component: Locator;
  readonly unrestricted_non_preserved: Locator;
  readonly restricted_preserved: Locator;
  readonly preserved_component: Locator;
  readonly rollIn: Locator;
  readonly rollIn_type: Locator;
  readonly eligible_serviceDate: Locator;
  readonly verifyContributionSuccess: Locator;
  readonly transactionsHistoryFilter: Locator;
  readonly filterCategory_Type: Locator;
  readonly selectFilterType: Locator;
  readonly filterType_PTB: Locator;
  readonly applyButton: Locator;
  readonly transactionType_PTB: Locator;

  //case

  readonly viewCase: Locator;
  readonly createCase: Locator;
  readonly linkCase: Locator;
  readonly approveProcessStep: Locator;
  readonly retryProcessStep: Locator;

  //Pension commutation roll-out

  readonly pensionCommutation: Locator;
  readonly commutation_type: Locator;
  readonly commutation_rollout: Locator;
  readonly payTo: Locator;
  readonly fund: Locator;
  readonly destinationAccountNumber: Locator;
  readonly payFullBalance: Locator;
  readonly partialBalance: Locator;
  readonly verifyRolloutProcessSuccess: Locator;
  readonly verifyUNPCommutationProcessSuccess: Locator;
  readonly verfiyRollInProcessSuccess: Locator;
  readonly communationUNPReject: Locator;
  readonly verifyRolloutErrorMessage: Locator;

  //close Icon
  readonly close_left: Locator;

  //Pension commencement
  readonly pensionTab: Locator;
  readonly check_box: Locator;
  readonly commence_pension_button: Locator;
  readonly pensionCommenceSuccessMessage: Locator;

  //Exceptions

  readonly processException: Locator;
  readonly reviewCase: ReviewCase;

  //Death Benefit transaction

  readonly BenefitPayment: Locator;
  readonly SearchOptionComboBox: Locator;
  readonly DeathBenifitsOption: Locator;
  readonly ShareOfBeneit: Locator;
  readonly ShareOfBeneitInput: Locator;
  readonly PaymentType: Locator;
  readonly PaymentTypeInput: Locator;
  readonly RelationShip: Locator;
  readonly RelationShipInput: Locator;
  readonly Title: Locator;
  readonly InputTitle: Locator;
  readonly FirstName: Locator;
  readonly LastName: Locator;
  readonly DateOfBirth: Locator;
  readonly DateOfBirthInput: Locator;
  readonly City_Town: Locator;
  readonly State: Locator;
  readonly StateInput: Locator;
  readonly ResidentialAddress: Locator;
  readonly CheckboxKYC: Locator;
  readonly PostCode: Locator;
  readonly TFN: Locator;
  readonly BSBNumber: Locator;
  readonly AccountName: Locator;
  readonly AccountNumber1: Locator;
  readonly OverviewTab: Locator;
  readonly OverViewEditButton: Locator;
  readonly DOD: Locator;
  readonly HESTAforMercyRetirementTab: Locator;
  readonly personalDetailsDODUpdateSuccess: Locator;
  readonly ButtonAddTransactions: Locator;
  readonly ButtonTransactions: Locator;
  readonly deathBenefitTransactionSuccess: Locator;

  //Transactions view 
  readonly TransactioReference: Locator;
  readonly BenefitPaymentId: Locator;


  constructor(page: Page) {
    super(page)

    this.reviewCase = new ReviewCase(page);
    this.navbar = new Navbar(page);
    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")

    //Rollover In
    this.memberTransactionTab = page.getByRole('button', { name: 'Transactions' });
    this.memberAddTransaction = page.getByRole('button', { name: 'ADD TRANSACTION' });
    this.memberAddContribution = page.getByText('Rollover In', { exact: true });
    this.USI = page.getByLabel('USI *');
    this.account_number = page.getByLabel('Account number *');
    this.paymentReference = page.getByLabel('Payment Reference *');
    this.paymentReceivedDate = page.locator('input[name="paymentReceivedDate"]');
    this.effectiveDate = page.locator('input[name="effectiveDate"]');
    this.contributionAmount = page.getByLabel('Payment Amount *')
    this.tax_component = page.getByLabel('Taxed Component *', { exact: true });
    this.untaxed_component = page.getByLabel('Untaxed Component *', { exact: true });
    this.tax_free_component = page.getByLabel('Tax Free Component *', { exact: true })
    this.unrestricted_non_preserved = page.getByLabel('Unrestricted Non-preserved');
    this.restricted_preserved = page.getByLabel('Restricted non-preserved amount *', { exact: true });
    this.preserved_component = page.getByLabel('Preserved Amount *', { exact: true })
    this.rollIn = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
    this.rollIn_type = page.getByRole('option', { name: 'Client-RTR' });
    this.eligible_serviceDate = page.locator('input[name="eligibleServicePeriodStartDate"]');
    this.verifyContributionSuccess = page.getByText('Process step completed with note: Member roll in payload sent to Chandler.');

    //case
    this.viewCase = page.getByRole('button', { name: 'View Cases' });
    this.createCase = page.getByRole('button', { name: 'Create Case' });
    this.linkCase = page.getByRole('button', { name: 'Link to Case' });
    this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
    this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });

    //Pension commutation roll-out
    this.pensionCommutation = page.getByText('Pension Commutation', { exact: true });
    this.commutation_type = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('CloseSelect');
    this.commutation_rollout = page.getByRole('option', { name: 'Commutation - Rollover Out' });
    this.payTo = page.locator('//label[@for="payTo"]/following::div[@class="gs__selected-options"]');
    this.fund = page.getByRole('option', { name: 'Fund' });
    this.destinationAccountNumber = page.getByLabel('Destination account number');
    this.payFullBalance = page.locator('.switch-slider').first();
    this.partialBalance = page.getByText('$ 0.00');
    this.verifyRolloutProcessSuccess = page.getByText('Process step completed with note: Commute rollout correspondence sent');
    this.verifyUNPCommutationProcessSuccess = page.getByText('Process step completed with note: Commute benefit payment correspondence sent');
    this.verfiyRollInProcessSuccess = page.getByText('Processed Roll In.');
    this.communationUNPReject = page.getByText('Step 3 rejected.');
    this.verifyRolloutErrorMessage = page.getByText('Process step Process Benefit did not meet conditions.');
    this.pensionCommenceSuccessMessage = page.getByText('Process step completed with note: Pension account commencement correspondence sent.');
    //close Icon
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });


    //Pension commencement
    this.pensionTab = page.getByRole('button', { name: 'Pension' })
    this.check_box = page.locator('.checkbox-indicator');
    this.commence_pension_button = page.getByRole('button', { name: 'COMMENCE PENSION' });
    this.transactionsHistoryFilter = page.getByRole('button', { name: 'FILTER' });
    this.filterCategory_Type = page.locator("//div[@class='filter-list-item'][normalize-space()='Type']");
    this.selectFilterType = page.getByRole('textbox', { name: 'Select' });
    this.filterType_PTB = page.locator("//span[normalize-space()='PTB']");
    this.applyButton = page.getByRole('button', { name: 'APPLY' });
    this.transactionType_PTB = page.locator("//div[@class='cell' and contains(text(),'PTB')]");

    ///Death Benifits

    this.BenefitPayment = page.getByText('Benefit Payment');
    this.SearchOptionComboBox = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
    this.DeathBenifitsOption = page.getByText('Death Benefit');
    //effectivedate missing add here 
    this.ShareOfBeneit = page.getByText('0.00 %');
    this.ShareOfBeneitInput = page.getByPlaceholder('0');
    this.PaymentType = page.locator("(//label[@title='Payment type']//following::div[@name='payeeType0']//div//div[2])");
    this.PaymentTypeInput = page.getByText('Death Benefit Payment - Dependant');
    this.RelationShip = page.locator("(//label[@title='Relationship']//following::div[@name='relationship0']//div//div[2])");
    this.RelationShipInput = page.getByText('Spouse');
    this.Title = page.locator("(//label[@title='Title']//following::div[@name='title0']//div//div[2])");
    this.InputTitle = page.getByText('Mr', { exact: true });
    this.FirstName = page.getByLabel('First name *');
    this.LastName = page.getByLabel('Last name *');
    this.DateOfBirth = page.locator('input[name="dob0"]');
    this.DateOfBirthInput = page.getByRole('cell', { name: '23' }).locator('span');
    this.City_Town = page.getByLabel('City/Town *');
    // this.State = page.locator('#gs10__combobox div').first();
    this.State = page.locator("(//label[@title='State']//following::div[@name='state']//div//div[2])");
    this.StateInput = page.getByText('Australian Antarctic Territory');
    this.ResidentialAddress = page.getByLabel('Residential address line 1 *');
    this.CheckboxKYC = page.locator('.top-0');
    this.PostCode = page.getByLabel('Postcode *');
    this.TFN = page.getByLabel('TFN');
    this.BSBNumber = page.getByLabel('BSB number');
    this.AccountName = page.getByLabel('Name on account');
    this.AccountNumber1 = page.getByLabel('Account number');
    this.OverviewTab = page.getByRole('button', { name: 'Overview' });
    this.OverViewEditButton = page.locator('div').filter({ hasText: /^Personal detailsEdit Content$/ }).getByRole('button');
    this.DOD = page.locator('input[name="dateOfDeath"]');
    this.HESTAforMercyRetirementTab = page.getByRole('button', { name: 'HESTA for Mercy Retirement' });
    this.personalDetailsDODUpdateSuccess = page.getByText('Updated member.');
    this.ButtonTransactions = page.getByRole('button', { name: 'Transactions' });
    this.ButtonAddTransactions = page.getByRole('button', { name: 'ADD TRANSACTION' });
    this.deathBenefitTransactionSuccess = page.getByText('Process step completed with note: Death');


    //Transactions view 
    this.TransactioReference = page.getByRole('cell', { name: 'Roll In' }).first();
    this.BenefitPaymentId = page.getByRole('cell', { name: 'Payment', exact: true }).first();

  }

  /** Member Rollin, adds a contribution to member account */
  async rollInTransaction() {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.memberAddContribution.click()

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.USI.fill(pensions.USI);
    await this.account_number.click();
    await this.account_number.fill(pensions.AccNumber);
    await this.paymentReference.click();
    await this.paymentReference.fill(pensions.PaymentReference);
    await this.paymentReceivedDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.paymentReceivedDate.press('Tab');
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Tab');
    await this.contributionAmount.fill(pensions.Amount);
    await this.contributionAmount.press('Tab');
    await this.untaxed_component.press('Tab');
    await this.tax_component.fill(pensions.Amount);
    await this.tax_component.press('Tab');
    await this.tax_free_component.press('Tab');
    await this.unrestricted_non_preserved.press('Tab');
    await this.restricted_preserved.press('Tab');
    await this.preserved_component.scrollIntoViewIfNeeded();
    await this.preserved_component.fill(pensions.Amount);
    await this.sleep(2000);
    await this.rollIn.click();
    await this.rollIn_type.click();
    await this.eligible_serviceDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.eligible_serviceDate.press('Enter');

    await this.linkCase.click();
    await this.sleep(3000);

    await this.reviewCase.reviewCaseProcess(this.verfiyRollInProcessSuccess);

  }

  //Pension commutation roll-out
  async commutationRolloverOut(FullExit: boolean) {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();

    await this.commutation_type.click();
    await this.commutation_type.press('Enter');
    await this.sleep(3000);
    await this.commutation_rollout.click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.payTo.click();
    await this.fund.click();
    await this.USI.fill(pensions.USI);
    await this.destinationAccountNumber.fill(pensions.AccNumber);
    await this.destinationAccountNumber.press('Tab')
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');

    if (FullExit) {
      await this.payFullBalance.click();
    } else {
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('2000');
    }

    await this.linkCase.click();
    await this.sleep(3000);

    await this.reviewCase.reviewCaseProcess(this.verifyRolloutProcessSuccess);

  }

  async commutationUNPBenefit(FullExit: boolean) {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();

    await this.commutation_type.click();
    await this.commutation_type.press('Enter');
    //await this.sleep(3000);
    await this.page.getByRole('option', { name: 'Commutation - UNP Benefit' }).click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.page.locator('(//span[text()="*"])[2]/following::input').click();
    await this.page.getByRole('option', { name: 'Commutation - UNP Payment' }).locator('span').click();
    await this.page.locator('//label[@for="bankAccount"]/following::div[@class="gs__selected-options"]').getByLabel('CloseSelect').click();
    await this.page.getByRole('option').nth(0).click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');

    if (!FullExit) {
      await this.page.locator('.switch-slider').click();
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('2000');
    }

    await this.linkCase.click();
    await this.sleep(3000);

    await this.reviewCase.reviewCaseProcess(this.verifyUNPCommutationProcessSuccess);

  }

  async commutationUNPBenefitReject(FullExit: boolean) {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();

    await this.commutation_type.click();
    await this.commutation_type.press('Enter');
    //await this.sleep(3000);
    await this.page.getByRole('option', { name: 'Commutation - UNP Benefit' }).click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.page.locator('#gs4__combobox div').first().click();
    await this.page.getByRole('option', { name: 'Commutation - UNP Payment' }).click();
    await this.page.locator('#gs6__combobox').getByLabel('CloseSelect').click();
    await this.page.getByRole('option').nth(0).click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');

    if (!FullExit) {
      await this.page.locator('.switch-slider').click();
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('1000');
    }

    await this.linkCase.click();
    await this.sleep(3000);

    //Check commutation case and verify reject
    await this.reviewCase.reviewAndRejectCase(this.communationUNPReject);

  }

  async deathBenefitTransaction() {

    await this.sleep(3000);
    await this.OverviewTab.click();
    await this.OverViewEditButton.click();

    let isDODavilable = await this.DOD.textContent();
    if (isDODavilable == '') {
      await this.viewCase.click();
      await this.sleep(3000);
      await this.createCase.click();
      await this.sleep(3000);
      await this.DOD.click();
      await this.DOD.fill(`${DateUtils.ddmmyyyStringDate(-1)}`);
      await this.DOD.press('Tab');
      await this.linkCase.click();
      await this.sleep(3000);
      await this.reviewCase.reviewCaseProcess(this.personalDetailsDODUpdateSuccess);
    }

    // locator update todo for vanguard and AE
    await this.HESTAforMercyRetirementTab.click();
    await this.ButtonTransactions.click();
    await this.sleep(1000);
    await this.ButtonAddTransactions.click();
    await this.BenefitPayment.click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.SearchOptionComboBox.click();
    await this.DeathBenifitsOption.click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Tab');
    await this.ShareOfBeneit.click();
    await this.ShareOfBeneitInput.fill('100');
    await this.PaymentType.click();
    await this.PaymentTypeInput.click();
    await this.RelationShip.click();
    await this.RelationShipInput.click();
    await this.Title.click();
    await this.InputTitle.click();
    let beneficiaryName = UtilsAOL.randomName();
    await this.FirstName.click();
    await this.FirstName.fill(`${beneficiaryName}`);
    let randomSurname = UtilsAOL.randomSurname(5);
    await this.LastName.click();
    await this.LastName.fill(`${randomSurname}`);
    await this.DateOfBirth.click();
    await this.DateOfBirth.fill(`${DateUtils.ddmmyyyStringDate(0, 50)}`);
    await this.City_Town.click();
    await this.City_Town.fill(member.city);
    await this.ResidentialAddress.click();
    await this.ResidentialAddress.fill(member.address);
    await this.State.click();
    await this.StateInput.click();
    await this.CheckboxKYC.click();
    await this.PostCode.click();
    await this.PostCode.fill(member.postcode);
    await this.TFN.click();
    let tfn = UtilsAOL.generateValidTFN();
    await this.TFN.fill(`${tfn}`);
    await this.AccountName.click();
    await this.AccountName.fill(`${beneficiaryName}`);
    await this.sleep(1000);
    await this.BSBNumber.click();
    await this.BSBNumber.fill(member.BSBNumber);
    await this.BSBNumber.press('Enter');
    await this.sleep(2000);
    await this.AccountNumber1.fill(member.AccountNumber);
    await this.sleep(3000);
    await this.linkCase.click();
    await this.sleep(3000);
    await this.reviewCase.reviewCaseProcess(this.deathBenefitTransactionSuccess);
  }


  async pensionCommence() {
    await this.pensionTab.click();
    this.sleep(5000);
    await this.viewCase.click();
    await this.sleep(5000);
    await this.createCase.click();
    await this.sleep(5000);
    await this.linkCase.click();
    await this.sleep(5000);
    await this.check_box.scrollIntoViewIfNeeded();
    await this.check_box.click();
    await this.commence_pension_button.click();
    this.sleep(3000);
    await this.reviewCase.reviewCaseProcess(this.pensionCommenceSuccessMessage);

  }

  //Pension commencement
  async pensionUpdate() {
    await this.pensionTab.click();
    await this.viewCase.click();
    await this.createCase.click();
    await this.linkCase.click();

    const popup = this.page.locator("//*[@class='el-dialog__header']/span[contains(text(),'Review and Commence Pension')]");
    if (await popup.isVisible()) {
      // Find and interact with the checkbox inside the popup
      const checkbox = popup.locator('//*[@id ="checkbox_k5MjYyMjMz" and @type ="checkbox"]'); // Change the locator
      await checkbox.click();

      // Wait for some time (adjust this delay as needed)
      await this.page.waitForTimeout(2000);

      // Find and click on the 'Create' button in the popup
      const createButton = popup.locator(''); // Change the locator
      await createButton.click();
    }

    await this.check_box.click();
    await this.sleep(5000);
    await this.commence_pension_button.click();

    await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);

  }

  async commutationRolloverOutTTR(FullExit: boolean) {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();

    await this.commutation_type.click();
    await this.commutation_type.press('Enter');
    await this.sleep(3000);
    await this.commutation_rollout.click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.payTo.click();
    await this.fund.click();
    await this.USI.fill(pensions.USI);
    await this.destinationAccountNumber.fill(pensions.AccountNumber);
    await this.destinationAccountNumber.press('Tab')
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');

    if (FullExit) {
      await this.payFullBalance.click();
    } else {
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('1000');
    }

    await this.linkCase.click();
    await this.sleep(3000);
    await this.reviewCase.reviewCaseProcess(this.verifyRolloutErrorMessage);

  }

  async verifyPTBtransaction(PTB: boolean) {
    await this.memberTransactionTab.click();
    await this.transactionsHistoryFilter.click();
    await this.sleep(3000);
    await this.filterCategory_Type.click();
    await this.selectFilterType.click();
    await this.selectFilterType.fill('PTB');
    await this.filterType_PTB.click();
    await this.applyButton.click();
    await this.sleep(3000);
    if (PTB) {
      await this.transactionType_PTB.scrollIntoViewIfNeeded();
      expect(this.transactionType_PTB).toBeVisible();
    }
    await this.reviewCase.captureScreenshot();

  }

  async transactionView() {
    await this.sleep(3000);
    await this.TransactioReference.scrollIntoViewIfNeeded();
    await this.TransactioReference.click();
    let transID = this.page.locator("section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)");
    let id = transID.textContent();
    return id!;
  }

  async paymentView() {
    await this.sleep(3000);
    await this.BenefitPaymentId.scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.BenefitPaymentId.click();

    let transID = await this.page.locator("section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)").textContent();
    let status = await this.page.locator("//span[@class='font-semibold']/following-sibling::span[1]").innerText();
    if (status.trim() === "Finalised") {
      console.log(`Payment ID: ${transID} is Finalised. payment has been  processed.`);
    } else {
      throw new Error(`Payment ID ${transID} is not Finalised.`);
    }

    return transID;
  }


}