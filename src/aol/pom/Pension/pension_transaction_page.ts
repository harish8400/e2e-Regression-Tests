import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { TFN } from "../data/tfn";
import * as pensions from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { Navbar } from "../component/navbar";
import { ReviewCase } from "../component/review_case";

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
    this.payTo = page.locator('#gs4__combobox div').first();
    this.fund = page.getByRole('option', { name: 'Fund' });
    this.destinationAccountNumber = page.getByLabel('Destination account number');
    this.payFullBalance = page.locator('.switch-slider').first();
    this.partialBalance = page.getByText('$ 0.00');
    this.verifyRolloutProcessSuccess = page.getByText('Process step completed with note: Commute rollout correspondence sent');
    this.verifyUNPCommutationProcessSuccess = page.getByText('Process step completed with note: Commute benefit payment correspondence sent');
    this.verfiyRollInProcessSuccess = page.getByText('Process step completed with note: Member roll in payload sent to Chandler');
    this.communationUNPReject = page.getByText('Step 3 rejected.');
    this.verifyRolloutErrorMessage = page.getByText('Process step Process Benefit did not meet conditions.');
    this.pensionCommenceSuccessMessage = page.getByText('Process step completed with note: Pension account commencement correspondence sent.');
    //close Icon
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });


    //Pension commencement
    this.pensionTab = page.getByRole('button', { name: 'Pension' })
    this.check_box = page.locator('.checkbox-indicator');
    this.commence_pension_button = page.getByRole('button', { name: 'COMMENCE PENSION' });
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

    if(FullExit){
      await this.payFullBalance.click();
    }else{
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

    await this.page.locator('#gs4__combobox div').first().click();
    await this.page.getByRole('option', { name: 'Commutation - UNP Payment' }).locator('span').click();
    await this.page.locator('#gs6__combobox').getByLabel('CloseSelect').click();
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
    await this.page.getByText('Commutation - UNP Payment').click();
    await this.page.locator('#gs6__combobox').getByLabel('CloseSelect').click();
    await this.page.getByRole('option').nth(0).click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');

    if (!FullExit) {
      await this.page.locator('.switch-slider').click();
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('10000');
    }
    
    await this.linkCase.click();
    await this.sleep(3000);

    //Check commutation case and verify reject
    await this.reviewCase.reviewAndRejectCase(this.communationUNPReject);

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

    await  this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);
    
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

    if(FullExit){
      await this.payFullBalance.click();
    }else{
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder('0').fill('1000');
    }
    
    await this.linkCase.click();
    await this.sleep(3000);
    await  this.reviewCase.reviewCaseProcess(this.verifyRolloutErrorMessage);

  }

}