import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { TFN } from "../data/tfn";
import * as pensions from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { AssertionError } from "assert";
import { InvalidResultAttributeException } from "@aws-sdk/client-ssm";
import { Navbar } from "../component/navbar";

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
  readonly verifyRolloutProcessSuccess: Locator;
  readonly verfiyRollInProcessSuccess: Locator;

  //close Icon
  readonly close_left: Locator;

  //Pension commencement
  readonly pensionTab: Locator;
  readonly check_box: Locator;
  readonly commence_pension_button: Locator;

  //Exceptions

  readonly processException: Locator;


  constructor(page: Page) {
    super(page)

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
    this.verifyRolloutProcessSuccess = page.getByText('Process step completed with note: Manual Super Stream rollout correspondence sen');
    this.verfiyRollInProcessSuccess = page.getByText('Process step completed with note: Member roll in payload sent to Chandler');

    //close Icon
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });


    //Pension commencement
    this.pensionTab = page.getByRole('button', { name: 'Pension' })
    this.check_box = page.getByText('I acknowledge that by');
    this.commence_pension_button = page.locator('//*[@type="button"]/following::span[text()=" COMMENCE PENSION "]');
  }

  /** Member Rollin, adds a contribution to member account */
  async rollInTransaction() {
    // await this.navigateToPensionMemberPage();
    // await this.sleep(2000);
    // await this.memberTransactionTab.scrollIntoViewIfNeeded();
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

    await this.reviewCaseProcess(this.verfiyRollInProcessSuccess);

  }

  //Pension commutation roll-out
  async rollOutTransaction() {

    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();

    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    await this.commutation_type.click();
    await this.commutation_type.press('Enter');
    await this.sleep(3000);
    await this.commutation_rollout.click();
    await this.payTo.click();
    await this.fund.click();
    await this.USI.fill(pensions.USI);
    await this.destinationAccountNumber.fill(pensions.AccNumber);
    await this.destinationAccountNumber.press('Tab')
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press('Enter');
    await this.payFullBalance.click();
    
    await this.linkCase.click();
    await this.sleep(3000);

    await this.reviewCaseProcess(this.verifyRolloutProcessSuccess);

  }

  async reviewCaseProcess(successLocator: Locator){

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
        throw InvalidResultAttributeException;
      }

      await this.sleep(2000);
    } while (
      await successLocator.count() == 0
    );
  }

  async pensionCommence() {
    await this.viewCase.click();
    await this.sleep(5000);
    await this.createCase.click();
    await this.sleep(5000);
    await this.linkCase.click();
    await this.sleep(5000);

    await this.reviewCaseProcess(this.verfiyRollInProcessSuccess);

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

      //assert(await this.processException.count() < 0);
      //Break if there is an process exception
      if (await this.processException.count() > 0) {
        throw new AssertionError({ message: "Error in Processing Case" });
      }

    } while (await this.verifyContributionSuccess.count() == 0);

    await expect(this.verifyContributionSuccess).toBeVisible();
  }

}