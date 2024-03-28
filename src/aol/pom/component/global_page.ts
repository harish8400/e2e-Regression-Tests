import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { TFN } from "../data/tfn";
import { DateUtils } from "../../../utils/date_utils";
import { Navbar } from "./navbar";
import { ReviewCase } from "./review_case";
import { CASE_NOTE } from "../../../../constants";
import { allure } from "allure-playwright";

export class GlobalPage extends BasePage {

  readonly navbar: Navbar;
  readonly processException: Locator;
  readonly reviewCase: ReviewCase;

  //Transactions view 
  readonly TransactionReference: Locator;
  readonly BenefitPaymentId: Locator;
  readonly TransactioType: Locator;
  readonly paymentDate: Locator;
  readonly processedDate: Locator;
  readonly today: Date;
  readonly componentScreen: Locator;
  readonly taxableTaxed: Locator;
  readonly preserved: Locator;
  readonly paygAssessableIncome: Locator;
  readonly processType: Locator;
  readonly closePopUp: Locator;
  readonly investmentScreen: Locator;
  readonly summary: Locator;
  readonly activityData:Locator;
  readonly closeTheData:Locator;
  readonly adminFeeCase:Locator;
  readonly investmentBalanceScreen:Locator;
  readonly paymentDetails:Locator;

  constructor(page: Page) {
    super(page)

    this.reviewCase = new ReviewCase(page);
    this.navbar = new Navbar(page);
    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")

    //Transactions view 
    this.TransactionReference = page.getByRole('row', { name: 'Contribution' }).first();
    this.BenefitPaymentId = page.getByRole('cell', { name: 'Payment', exact: true }).first();
    this.TransactioType = page.locator('tr:nth-child(2) > .el-table_5_column_28');
    this.paymentDate = page.locator('td:nth-child(4) > .cell').first();
    this.processedDate = page.locator('td:nth-child(5) > .cell').first();
    this.today = new Date();
    this.componentScreen = page.getByRole('button', { name: 'Components' });
    this.taxableTaxed = page.locator("//p[text()=' Taxable - taxed ']/following-sibling::p");
    this.preserved = page.locator("//p[text()=' UNP ']/following-sibling::p");
    this.paygAssessableIncome = page.locator(" //p[text()=' PAYG Assessable Income ']/following-sibling::p");
    this.processType = page.locator("//table[@class='el-table__body']/tbody[1]/tr[2]/td[1]");
    this.closePopUp = page.locator("//span[@class='el-dialog__title']/following-sibling::button[1]");
    this.investmentScreen = page.getByRole('button', { name: 'Investments', exact: true });
    this.summary = page.getByRole('button', { name: 'Member Summary' });
    this.activityData = page.locator("(//p[text()='Process step completed with note: Member fee calculated.']/following::span[contains(@class,'flex items-center')])[1]");
    this.closeTheData = page.locator("//div[contains(@class, 'case-process-drawer') and contains(@class, 'show') and contains(@class, 'case-process-details')]//span[@class='flex items-center justify-center']//*[local-name()='svg']//*[contains(@fill,'currentCol')]//*[contains(@d,'m13.4062 1')]")
    this.adminFeeCase = page.locator("(//button[@type='button']/following-sibling::button)[2]");
    this.investmentBalanceScreen = page.locator("//button[text()='Investments and Balances']");
    this.paymentDetails = page.locator("//span[text()='Payment Details']");

  }

  async captureScreenshot(screenShotName: string = 'screenshot'){
    allure.attachment(screenShotName, await this.page.screenshot({ fullPage:true }), 'image/png');
  }

  async validateMoneyInTransactionDetail(transactionAmount: string = '') {
    await this.sleep(3000);
    await this.TransactionReference.scrollIntoViewIfNeeded();
    await this.TransactionReference.click();
    await this.page.getByRole('button', { name: 'Payment Details' }).click();
    //let moneyInAmount = await this.page.locator("(//td[contains(@class,'el-table__cell')])[13]").textContent();
    //moneyInAmount = moneyInAmount!.replace(',','');
    //expect(this.page.locator('p').filter({ hasText: transactionAmount })).toBeVisible();
    await this.captureScreenshot('Money In Transaction Details');
    
    //expect(moneyInAmount).toContain(transactionAmount);
    // let transID = this.page.locator("section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)");
    // let id = transID.textContent();
    // return id!;
    
  }

  async paymentView() {
    await this.sleep(3000);
    // Assuming this.today, this.paymentDate, and this.processedDate are Playwright ElementHandles or similar objects

    let paymentReceivedDate = await this.paymentDate.textContent();
    let processedPaymentDate = await this.processedDate.textContent();

    if (paymentReceivedDate && processedPaymentDate) {
      const date = DateUtils.ddMMMyyyStringDate(new Date());

      if (date === paymentReceivedDate) {
        console.log("Today's date and payment received date are equal.");
      } else {
        console.log("Today's date and payment received date are not equal.");
      }

      if (date === processedPaymentDate) {
        console.log("Today's date and processed payment date are equal.");
      } else {
        console.log("Today's date and processed payment date are not equal.");
      }
    } else {
      console.log("Payment received date or processed payment date is null or undefined.");
    }

    await this.BenefitPaymentId.scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.BenefitPaymentId.click();

    let transID = await this.page.locator("section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)").textContent();
    let status = await this.page.locator("//span[@class='font-semibold']/following-sibling::span[1]").innerText();
    await this.reviewCase.captureScreenshot();
    // if (status.trim() === "Finalised") {
    //   console.log(`${transID} is Finalised. payment has been  processed.`);
    // } else if(status.trim() === "Pending") {
    //   console.log(`${transID}. payment is in pending state.`);
    // }

    await this.componentScreen.click();
    let taxAmountValue = await this.taxableTaxed.textContent();
    const taxAmount = parseFloat(taxAmountValue!.replace(/[^0-9.-]+/g, ""));
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    console.log("Tax amount:", taxAmount);
    let preservedComponent = await this.preserved.textContent();
    const unpComponentValue = parseFloat(preservedComponent!.replace(/[^0-9.-]+/g, ""));
    console.log("Preserved Component:", unpComponentValue);
    let payGValue = await this.paygAssessableIncome.textContent();
    expect(payGValue).toMatch(/^(yes|no)$/i);
    await this.sleep(3000);
    await this.closePopUp.click();
    return transID;
  }

  async unitPriceValidation() {
    await this.sleep(3000);
    await this.processType.click();
    await this.sleep(3000);
    await this.investmentScreen.click();
    const unitPriceTable = await this.page.$("(//tr[2]/td[6]/div)[2]");
    const unitPricevalue = await unitPriceTable?.textContent();
    expect(unitPricevalue).toMatch(/\$\d+\.\d{4,}/);
    await this.reviewCase.captureScreenshot();
    await this.sleep(3000);
    await this.adminFeeCase.focus();
    await this.adminFeeCase.click();
    await this.sleep(3000);
    await this.activityData.scrollIntoViewIfNeeded();
    await this.activityData.click();
    const fixedFeeTotal = await this.page.$("(//span[@class='tree-view-item-key']/following::span[@class='tree-view-item-value tree-view-item-value-number'])[1]");
    const total  = await fixedFeeTotal?.textContent();
    expect(total).not.toBeNull();
    const assetBasedFeeTotal = await this.page.$("(//span[@class='tree-view-item-key']/following::span[@class='tree-view-item-value tree-view-item-value-number'])[2]");
    const feeTotal  = await assetBasedFeeTotal?.textContent();
    expect(feeTotal).not.toBeNull();
    await this.sleep(3000);
    await this. closeTheData.scrollIntoViewIfNeeded();
    await this. closeTheData.click();
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
  }

  async investementBalances(){
    await this.sleep(3000);
    await this.investmentBalanceScreen.click();
    const investmentBalance = await this.page.$("(//p[@class='mx-1']/following::p[@class='mx-1'])[5]");
    const balance = investmentBalance?.textContent();
    await this.sleep (3000);
    await this.reviewCase.captureScreenshot();
    expect(balance).not.toBeNull();
    
  }

  async memberStatus() {
    await this.sleep(3000);
    await this.summary.click();
    let accountStatus = await this.page.$("(//p[@data-cy='info-title']/following::p[@data-cy='info-value'])[3]");
      let memberStatus = await accountStatus?.textContent();
      if (memberStatus === 'Exited') {
        console.log("Member has been Exited successfully");
      } else if (memberStatus === 'Active') {
        console.log('Member is still in Active state only');
      } else {
        console.log('Member status is in Pending state only');
      }
  }

  async componentsValidation(){
    await this.componentScreen.click();
    let taxAmountValue = await this.taxableTaxed.textContent();
    const taxAmount = parseFloat(taxAmountValue!.replace(/[^0-9.-]+/g, ""));
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    console.log("Tax amount:", taxAmount);
    let preservedComponent = await this.preserved.textContent();
    const unpComponentValue = parseFloat(preservedComponent!.replace(/[^0-9.-]+/g, ""));
    console.log("Preserved Component:", unpComponentValue);
    let payGValue = await this.paygAssessableIncome.textContent();
    expect(payGValue).toMatch(/^(yes|no)$/i);
    await this.sleep(3000);
    await this.paymentDetails.click();
    const amountTransfer = await this.page.$("(//p[text()='Amount']/following::p[@class='font-semibold'])[1]");
    const amount = amountTransfer?.textContent();
    expect(amount).not.toBeNull();
    const conversationId = await this.page.$("(//p[text()='Conversation ID']/following::p[@class='font-semibold'])[1]");
    conversationId?.scrollIntoViewIfNeeded();
    if (conversationId) {
      const id = await conversationId.textContent();
      if (id) {
          const containsInternalTransfer = id.includes("InternalTransfer");
          if (!containsInternalTransfer) {
              console.error("Error: conversationId does not contain 'InternalTransfer'");
          }
      } else {
          console.error("Error: The conversation ID text content is null or empty");
      }
  } else {
      console.error("Error: Conversation ID element not found");
  }
    await this.reviewCase.captureScreenshot();
    await this.closePopUp.click();
  }

  async transactions() {
    await this.sleep(3000);
    await this.TransactioType.scrollIntoViewIfNeeded();
    await this.TransactioType.click();
    let transID = this.page.locator("section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)");
    let id = transID.textContent();
    return id!;
  }


}