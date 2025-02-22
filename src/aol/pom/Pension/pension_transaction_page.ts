import { APIRequestContext, Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { TFN } from "../data/tfn";
import * as pensions from "../../data/member.json";
import { DateUtils } from "../../../utils/date_utils";
import { Navbar } from "../component/navbar";
import { ReviewCase } from "../component/review_case";
import * as member from "../../data/member.json";
import { UtilsAOL } from "../../utils_aol";
import { CASE_NOTE, FUND } from "../../../../constants";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { MemberApiHandler } from "../../../aol_api/handler/member_api_handler";
import { PensionShellAccount } from "./pension_account_page";
import { RollinApiHandler } from "../../../aol_api/handler/rollin_api-handler";
import { TransactionsApiHandler } from "../../../aol_api/handler/transaction_api_handler";
import { allure } from "allure-playwright";
import { MemberOverView } from "../member/member_overview";
import { GlobalPage } from "./../component/global_page";


export class PensionTransactionPage extends BasePage {
  readonly navbar: Navbar;
  readonly memberOverView: MemberOverView;
  readonly globalPage: GlobalPage;
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
  readonly transactionType_Insurance: Locator;
  readonly filterType_INS: Locator;
  readonly commutationTypeDropDown: Locator;

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
  readonly verifyUNPErrorMessage: Locator;

  //close Icon
  readonly close_left: Locator;

  //Pension commencement
  readonly pensionTab: Locator;
  readonly check_box: Locator;
  readonly commence_pension_button: Locator;
  readonly pensionCommenceSuccessMessage: Locator;
  readonly pensionCommencementHistory: Locator;


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
  readonly accumulationTab: Locator;
  readonly personalDetailsDODUpdateSuccess: Locator;
  readonly ButtonAddTransactions: Locator;
  readonly ButtonTransactions: Locator;
  readonly deathBenefitTransactionSuccess: Locator;
  readonly commutationUNPBenefitButton: Locator;
  readonly UNPPayment: Locator;
  readonly bankOption: Locator;
  readonly radioButton: Locator;
  readonly paymentAmount: Locator;
  readonly bankAccountType: Locator;
  readonly memberUpdate_sucessMessage: Locator;
  //Transactions view 
  readonly TransactioReference: Locator;
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
  readonly activityData: Locator;
  readonly closeTheData: Locator;
  readonly adminFeeCase: Locator;
  readonly investmentBalanceScreen: Locator;
  readonly paymentDetails: Locator;
  readonly investmentSwitchTransaction: Locator;


  //Vanguard
  readonly unathorized: Locator;

  constructor(page: Page) {
    super(page);
    this.globalPage = new GlobalPage(page);
    this.reviewCase = new ReviewCase(page);
    this.navbar = new Navbar(page);
    this.memberOverView = new MemberOverView(page);
    this.today = new Date();
    this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")

    //Rollover In
    this.memberTransactionTab = page.getByRole("button", {
      name: "Transactions",
    });
    this.memberAddTransaction = page.getByRole("button", {
      name: "ADD TRANSACTION",
    });
    this.memberAddContribution = page.getByText("Rollover In", { exact: true });
    this.USI = page.getByLabel("USI *");
    this.account_number = page.getByLabel("Account number *");
    this.paymentReference = page.getByLabel("Payment Reference *");
    this.paymentReceivedDate = page.locator(
      'input[name="paymentReceivedDate"]'
    );
    this.effectiveDate = page.locator('input[name="effectiveDate"]');
    this.contributionAmount = page.getByLabel("Payment Amount *");
    this.tax_component = page.getByLabel("Taxed Component *", { exact: true });
    this.untaxed_component = page.getByLabel("Untaxed Component *", {
      exact: true,
    });
    this.tax_free_component = page.getByLabel("Tax Free Component *", {
      exact: true,
    });
    this.unrestricted_non_preserved = page.getByLabel(
      "Unrestricted Non-preserved"
    );
    this.restricted_preserved = page.getByLabel(
      "Restricted non-preserved amount *",
      { exact: true }
    );
    this.preserved_component = page.getByLabel("Preserved Amount *", {
      exact: true,
    });
    this.rollIn = page
      .getByRole("combobox", { name: "Search for option" })
      .locator("div")
      .first();
    this.rollIn_type = page.getByRole("option", { name: "Client-RTR" });
    this.eligible_serviceDate = page.locator(
      'input[name="eligibleServicePeriodStartDate"]'
    );
    this.verifyContributionSuccess = page.getByText(
      "Process step completed with note: Member roll in payload sent to Chandler."
    );
    this.commutationUNPBenefitButton = page.locator("(//li[@role='option'])[2]");

    //case
    this.viewCase = page.getByRole("button", { name: "View Cases" });
    this.createCase = page.getByRole("button", { name: "Create Case" });
    this.linkCase = page.getByRole("button", { name: "Link to Case" });
    this.approveProcessStep = page.getByRole("button", { name: "Approve" });
    this.retryProcessStep = page.getByRole("button", {
      name: "reset icon Retry",
    });

    //Pension commutation roll-out
    this.pensionCommutation = page.getByText('Pension Commutation');
    this.commutation_type = page
      .getByRole("combobox", { name: "Search for option" })
      .getByLabel("CloseSelect");
    this.commutation_rollout = page.getByRole("option", {
      name: "Commutation - Rollover Out",
    });
    this.payTo = page.locator(
      '//label[@for="payTo"]/following::div[@class="gs__selected-options"]'
    );
    this.fund = page.getByRole("option", { name: "Fund" });
    this.destinationAccountNumber = page.getByLabel(
      "Destination account number"
    );
    this.payFullBalance = page.locator(".switch-slider").first();
    this.partialBalance = page.getByText("$ 0.00");
    this.verifyRolloutProcessSuccess = page.getByText(
      "Process step completed with note: Commute rollout correspondence sent"
    );
    this.verifyUNPCommutationProcessSuccess = page.getByText(
      "Process step completed with note: Commute benefit payment correspondence sent"
    );
    this.verfiyRollInProcessSuccess = page.getByText("Processed Roll In.");
    this.communationUNPReject = page.getByText("Step 3 rejected.");
    this.verifyRolloutErrorMessage = page.getByText(
      "Process step Process Benefit did not meet conditions."
    );
    this.pensionCommenceSuccessMessage = page.getByText(
      "Process step completed with note: Pension account commencement correspondence sent."
    );
    this.verifyUNPErrorMessage = page.getByText(
      "java.lang.IllegalArgumentException: Member balance is not 100% UNP."
    );
    //close Icon
    this.close_left = page.getByRole("button", {
      name: "arrow-left icon clipboard-tick icon",
    });

    //Pension commencement
    this.pensionTab = page.getByRole('button', { name: 'Pension' })
    this.check_box = page.locator('.checkbox-indicator');
    this.commence_pension_button = page.getByRole('button', { name: 'COMMENCE PENSION' });
    this.transactionsHistoryFilter = page.getByRole('button', { name: 'FILTER' });
    this.filterCategory_Type = page.locator("//div[@class='filter-list-item'][normalize-space()='Type']");
    this.selectFilterType = page.getByRole('tooltip', { name: 'close icon Type Select APPLY' }).getByPlaceholder('Select')
    this.filterType_PTB = page.locator("//span[normalize-space()='PTB']").first();
    this.filterType_INS = page.locator("//span[normalize-space()='INS']");
    this.applyButton = page.getByRole('button', { name: 'APPLY' });
    this.transactionType_PTB = page.locator("//div[@class='cell' and contains(text(),'PTB')]").first();
    this.transactionType_Insurance = page.getByRole('row', { name: 'Insurance Premium' });
    this.pensionCommencementHistory = page.locator("//table[@class='el-table__body']/tbody[1]/tr[1]/td[3]/div[1]");

    ///Death Benifits

    this.BenefitPayment = page.getByText('Benefit Payment');
    this.SearchOptionComboBox = page
      .getByRole("combobox", { name: "Search for option" })
      .getByLabel("Select", { exact: true });
    this.DeathBenifitsOption = page.getByText("Death Benefit");
    //effectivedate missing add here
    this.ShareOfBeneit = page.getByText("0.00 %");
    this.ShareOfBeneitInput = page.getByPlaceholder("0");
    this.PaymentType = page.locator(
      "(//label[@title='Payment type']//following::div[@name='payeeType0']//div//div[2])"
    );
    this.PaymentTypeInput = page.getByText("Death Benefit Payment - Dependant");
    this.RelationShip = page.locator("(//label[@title='Relationship']//following::div[@name='relationship0']//div//div[2])");
    this.RelationShipInput = page.getByText("Spouse");
    this.Title = page.locator(
      "(//label[@title='Title']//following::div[@name='title0']//div//div[2])"
    );
    this.InputTitle = page.getByText("Mr", { exact: true });
    this.FirstName = page.getByLabel("First name *");
    this.LastName = page.getByLabel("Last name *");
    this.DateOfBirth = page.locator("(//input[@placeholder='dd/mm/yyyy'])[2]");
    this.DateOfBirthInput = page
      .getByRole("cell", { name: "23" })
      .locator("span");
    this.City_Town = page.getByLabel("City/Town *");
    // this.State = page.locator('#gs10__combobox div').first();
    this.State = page.locator("(//label[@title='State']//following::div[@name='state']//div//div[2])");

    this.StateInput = page.getByRole('option', { name: 'New South Wales' });
    this.ResidentialAddress = page.getByLabel('Residential address line 1 *');
    this.CheckboxKYC = page.locator("//label[@class='pointer']/following-sibling::div[1]");
    this.PostCode = page.locator("//label[@for='postCode0']/following::input[@id='postCode0']")
    this.TFN = page.getByLabel('TFN');
    this.BSBNumber = page.getByLabel('BSB number');
    this.AccountName = page.getByLabel('Name on account');
    this.AccountNumber1 = page.getByLabel('Account number');
    this.OverviewTab = page.getByRole('button', { name: 'Overview' });
    this.OverViewEditButton = page.locator('div').filter({ hasText: /^Personal DetailsEdit Content$/ }).getByRole('button');
    this.memberUpdate_sucessMessage = page.getByText('Updated member.');
    this.DOD = page.locator('input[name="dateOfDeath"]');
    this.HESTAforMercyRetirementTab = page.getByRole('button', { name: 'HESTA for Mercy Retirement' });
    this.accumulationTab = page.getByRole('button', { name: 'HESTA for Mercy Super' });
    this.personalDetailsDODUpdateSuccess = page.getByText('Updated member.');
    this.ButtonTransactions = page.getByRole('button', { name: 'Transactions' });
    this.ButtonAddTransactions = page.getByRole('button', { name: 'ADD TRANSACTION' });
    this.deathBenefitTransactionSuccess = page.getByText('Process step completed with note: Benefit payment correspondence sent.');
    this.commutationTypeDropDown = page.locator("(//div[@class='gs__selected-options']//input)[2]");
    this.UNPPayment = page.getByRole('option', { name: 'Commutation - UNP Payment' }).locator('span');
    this.bankOption = page.getByRole('option', { name: 'Bank' });
    this.radioButton = page.locator('.switch-slider');
    this.paymentAmount = page.locator('//div[@class="input-number tracking-normal inline-block py-1 border-b w-full border-teal-100 hover:border-teal-300 font-bold"]');
    this.bankAccountType = page.getByRole('option', { name: 'InTest - Pension Payment' });
    //Transactions view 
    this.TransactioReference = page.getByRole('cell', { name: 'Roll In' }).first();
    this.BenefitPaymentId = page.getByRole('cell', { name: 'Payment', exact: true }).first();
    this.TransactioType = page.locator('tr:nth-child(1)').nth(1);
    this.paymentDate = page.locator('td:nth-child(4) > .cell').first();
    this.processedDate = page.locator('td:nth-child(5) > .cell').first();
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
    this.adminFeeCase = page.locator("//div[@class='cell']/following::div[text()='AFE']").first();
    this.investmentBalanceScreen = page.locator("//button[text()='Investments and Balances']");
    this.paymentDetails = page.locator("//span[text()='Payment Details']");
    this.investmentSwitchTransaction = page.locator("//div[@class='cell']/following::div[text()='INVPC']").first();

    //vanguard
    this.unathorized = page.locator(CASE_NOTE.UNAUTHORISED);
  }

  /** Member Rollin, adds a contribution to member account */
  async rollInTransaction() {
    await this.sleep(3000);
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.memberAddContribution.click();

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
    await this.paymentReceivedDate.press("Tab");
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Tab");
    await this.contributionAmount.fill(pensions.Amount);
    await this.contributionAmount.press("Tab");
    await this.untaxed_component.press("Tab");
    await this.tax_component.fill(pensions.Amount);
    await this.tax_component.press("Tab");
    await this.tax_free_component.press("Tab");
    await this.unrestricted_non_preserved.press("Tab");
    await this.restricted_preserved.press("Tab");
    await this.preserved_component.scrollIntoViewIfNeeded();
    await this.preserved_component.fill(pensions.Amount);
    await this.sleep(2000);
    await this.rollIn.click();
    await this.rollIn_type.click();
    await this.eligible_serviceDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.eligible_serviceDate.press("Enter");

    await this.linkCase.click();
    await this.sleep(3000);

    await this.reviewCase.reviewCaseProcess(this.verfiyRollInProcessSuccess);
  }

  //Pension commutation roll-out
  async commutationRolloverOut(FullExit: boolean) {
    await this.memberTransactionTab.click();
    (await this.sleep(300).then(() => this.memberAddTransaction)).click({ force: true });
    (await this.page.waitForTimeout(3000).then(() => this.pensionCommutation)).click();
    await this.sleep(3000);
    await this.commutation_type.click();
    await this.reviewCase.captureScreenshot();
    await this.commutation_type.press("Enter");
    await this.sleep(3000);
    await this.commutation_rollout.click();
    await this.payTo.click();
    await this.fund.click();
    await this.USI.fill(pensions.USI);
    await this.destinationAccountNumber.fill(pensions.AccNumber);
    await this.destinationAccountNumber.press("Tab");
    await this.sleep(2000);
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.sleep(2000);
    await this.effectiveDate.press("Enter");

    if (FullExit) {
      await this.payFullBalance.click();
    } else {
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder("0").fill("2000");
    }

    (await this.sleep(300).then(() => this.viewCase)).click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);
    await this.linkCase.click();
    await this.sleep(3000);
    // if (
    //   ENVIRONMENT_CONFIG.name === "dev" &&
    //   process.env.PRODUCT != FUND.HESTA
    // ) {
    //   await this.reviewCase.reviewCaseProcess(this.unathorized);
    // } else {
    await this.reviewCase.reviewCaseProcess(this.verifyRolloutProcessSuccess);
    //}
    await this.sleep(3000);
  }

  async commutationUNPBenefit(FullExit: boolean) {
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();
    if (await this.commutation_type.isVisible()) {
      await this.sleep(3000);
    } else {
      while (!(await this.commutation_type.isVisible())) {
      await this.page.reload();
      await this.sleep(3000);
      await this.memberAddTransaction.click();
      await this.pensionCommutation.click();
      }
    }
    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);
    await this.commutation_type.click();
    await this.commutation_type.press("Enter");
    //await this.sleep(3000);
    await this.page
      .getByRole("option", { name: "Commutation - UNP Benefit" })
      .click();
    await this.sleep(3000);
    await this.page.locator('(//span[text()="*"])[2]/following::input').click();
    await this.page
      .getByRole("option", { name: "Commutation - UNP Payment" })
      .locator("span")
      .click();
    await this.page
      .locator(
        '//label[@for="bankAccount"]/following::div[@class="gs__selected-options"]'
      )
      .getByLabel("CloseSelect")
      .click();
    await this.page.getByRole("option").nth(0).click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Enter");

    if (!FullExit) {
      await this.page.locator(".switch-slider").click();
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder("0").fill("2000");
    }

    await this.linkCase.click();
    await this.sleep(3000);
    if (
      ENVIRONMENT_CONFIG.name === "dev" &&
      process.env.PRODUCT != FUND.HESTA
    ) {
      await this.reviewCase.reviewCaseProcess(this.unathorized);
    } else {
      await this.reviewCase.reviewCaseProcess(
        this.verifyUNPCommutationProcessSuccess
      );
    }
  }

  async commutationUNPBenefitReject(FullExit: boolean) {
    await this.page.waitForTimeout(3000);
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();
    if (await this.commutation_type.isVisible()) {
      await this.sleep(3000);
    } else {
      while (!(await this.commutation_type.isVisible())) {
        await this.page.reload();
        await this.sleep(3000);
        await this.memberAddTransaction.click();
        await this.pensionCommutation.click();
      }
    }
    await this.sleep(3000);
    await this.viewCase.click();
    await this.sleep(3000)
    await this.createCase.click();
    await this.sleep(3000);
    await this.commutation_type.click();
    await this.commutation_type.press("Enter");
    //await this.sleep(3000);
    await this.page.getByRole("option", { name: "Commutation - UNP Benefit" }).click();
    await this.sleep(3000);
    const payment = await this.page.locator("(//div[@class='gs__selected-options']//input)[3]");
    payment.click();
    await this.sleep(3000);
    payment.press('ArrowDown');
    payment.press('Enter');
    await this.sleep(3000);
    const bank = await this.page.locator("//div[@id='gs5__combobox']/div[1]/input[1]");
    bank.click();
    await this.sleep(3000);
    bank.press('ArrowDown');
    bank.press('Enter');
    await this.sleep(3000);
    await this.effectiveDate.click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Enter");
    if (!FullExit) {
      await this.page.locator(".switch-slider").click();
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder("0").fill("1000");
    }

    await this.linkCase.click();
    await this.sleep(3000);

    //Check commutation case and verify reject
    var textContent = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]").textContent();
    let text = textContent?.trim();
    if (text == 'Step 3 rejected.') {
      await this.reviewCase.reviewAndRejectCase(this.communationUNPReject);
    } else {
      await this.reviewCase.reviewAndRejectCase(this.page.getByText('Step 2 rejected.'));
    }
  }

  async deathBenefitTransaction(processType?: String) {
    await this.sleep(3000);
    await this.OverviewTab.focus();
    await this.OverviewTab.click();
    await this.sleep(3000);
    await this.OverViewEditButton.click();

    let isDODavilable = await this.DOD.textContent();
    if (isDODavilable == '') {
      await this.sleep(3000);
      await this.DOD.fill(DateUtils.ddmmyyyStringDate(-1));
      await this.sleep(5000);
      await this.viewCase.click();
      await this.createCase.click();
      await this.sleep(5000);
      await this.linkCase.click();
      await this.sleep(5000);
      const textContent = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]");
      const text = await textContent.textContent();
      if (text === 'Updated member.') {
        await this.reviewCase.reviewCaseProcess(this.memberUpdate_sucessMessage);
      } else {
        await this.reviewCase.reviewCaseProcess(this.page.getByText('Process step MER003 - Send Member Contact Details Update to Chandler did not meet conditions.'));
      }
    }

    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;

    if (processType == 'ABP') {
      switch (product) {
        case 'HESTA for Mercy':
          await this.sleep(3000);
          await this.page.getByRole('button', { name: 'HESTA for Mercy Retirement' }).click();
          break;
        case 'Vanguard Super':
          await this.page.getByRole('option', { name: 'Vanguard Super SpendSmart' }).click();
          break;
        default:
          throw new Error(`Unsupported product: ${product}`);
      }
    } else {

      switch (product) {
        case 'HESTA for Mercy':
          await this.page.getByRole('option', { name: 'HESTA for Mercy Super' }).click();
          break;
        case 'Vanguard Super':
          await this.page.locator('//li[text()="Vanguard Accumulation"]').click();
          break;
        default:
          throw new Error(`Unsupported product: ${product}`);
      }

    }
    await this.sleep(3000);
    await this.ButtonTransactions.click();
    await this.sleep(1000);
    await this.ButtonAddTransactions.click({ force: true });
    await this.sleep(1000);
    await this.BenefitPayment.click();
    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);

    if (await this.SearchOptionComboBox.isVisible()) {
      await this.SearchOptionComboBox.click();
    } else {
      await this.page.reload();
      await this.sleep(3000);
      await this.ButtonAddTransactions.click();
      await this.BenefitPayment.click();
      await this.sleep(3000);
      await this.viewCase.click();
      await this.sleep(3000);
      await this.createCase.click();
      await this.sleep(3000);
      await this.SearchOptionComboBox.click();

    }
    await this.DeathBenifitsOption.click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Enter");
    await this.PaymentType.click();
    await this.sleep(3000);
    await this.PaymentTypeInput.click();
    await this.sleep(3000);
    await this.RelationShip.click();
    await this.sleep(3000);
    await this.RelationShipInput.click();
    await this.ShareOfBeneit.click();
    await this.ShareOfBeneitInput.fill("100");
    await this.Title.click();
    await this.InputTitle.click();
    let beneficiaryName = UtilsAOL.randomName();
    await this.FirstName.click();
    await this.FirstName.fill(`${beneficiaryName}`);
    let randomSurname = UtilsAOL.randomSurname(5);
    await this.LastName.click();
    await this.LastName.fill(`${randomSurname}`);
    await this.LastName.press('Tab');
    // let otherName = await this.page.locator("(//label[text()='Other name ']/following::input)[1]");
    // otherName.fill('Test01');
    // otherName.press('Tab');
    await this.sleep(3000);
    await this.DateOfBirth.fill(`${DateUtils.ddmmyyyStringDate(0, 17)}`);
    await this.page.locator("(//label[text()='Gender ']/following::input)[1]").click();
    (await this.sleep(3000).then(() => this.page.locator("(//li[contains(@class,'gs__dropdown-option px-5')])[1]"))).click({ force: true });
    let phoneNumber = await this.page.locator("(//label[text()='Phone ']/following::input)[1]");
    phoneNumber.click();
    await this.sleep(3000).then(() => phoneNumber.fill(member.phone));
    let Email = await this.page.locator("(//label[text()='Email ']/following::input)[1]");
    Email.click();
    await this.sleep(3000).then(() => Email.fill(member.email))
    await this.ResidentialAddress.click();
    await this.ResidentialAddress.fill(member.address);
    // let address = await this.page.locator("(//label[text()='Residential address line 2 ']/following::input)[1]");
    // address.click();
    // address.fill(member.address2);
    await this.sleep(3000);
    await this.City_Town.click();
    await this.City_Town.fill(member.city);
    await this.sleep(3000);
    await this.State.click();
    await this.sleep(3000);
    await this.StateInput.click();
    await this.sleep(3000);
    await this.CheckboxKYC.click({ force: true });
    await this.sleep(3000);
    await this.PostCode.click();
    await this.PostCode.fill(member.postcode);
    await this.sleep(3000);
    await this.TFN.click();
    let tfn = UtilsAOL.generateValidTFN();
    await this.TFN.fill(`${tfn}`);
    await this.AccountName.click();
    await this.AccountName.fill(`${beneficiaryName}`);
    await this.sleep(1000);
    await this.BSBNumber.click();
    await this.BSBNumber.fill(member.BSBNumber);
    await this.BSBNumber.press('Enter');
    await this.sleep(3000);
    await this.AccountNumber1.fill(member.BeneficiaryAccountNumber);
    await this.AccountNumber1.press('Enter');
    await this.sleep(3000);
    await this.linkCase.click();
    await this.sleep(3000);
    const textArea = await this.page.locator("(//div[contains(@class,'leading-snug break-words')]//p)[1]").textContent();
    const text = textArea?.trim();
    if (text === 'Process step completed with note: Benefit payment correspondence sent.') {
      await this.sleep(3000);
      await this.reviewCase.reviewCaseProcess(this.deathBenefitTransactionSuccess);
    } else {
      await this.sleep(3000);
      await this.reviewCase.reviewCaseProcess(this.page.getByText('java.lang.IllegalArgumentException: Failed requirement: Provided address is incomplete and requires fields according to country.'));
    }
  }

  async pensionCommence() {
    await this.pensionTab.click();
    await this.sleep(5000);
    await this.viewCase.click();
    await this.sleep(5000);
    await this.createCase.click();
    await this.sleep(5000);
    await this.linkCase.click();
    await this.sleep(5000);
    await this.check_box.scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.check_box.click();
    await this.sleep(2000);
    await this.commence_pension_button.click();
    await this.sleep(5000);
    await this.reviewCase.reviewCaseProcess(await this.pensionCommenceSuccessMessage);
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();



  }

  //Pension commencement
  async pensionUpdate() {
    await this.pensionTab.click();
    await this.viewCase.click();
    await this.createCase.click();
    await this.linkCase.click();

    const popup = this.page.locator(
      "//*[@class='el-dialog__header']/span[contains(text(),'Review and Commence Pension')]"
    );
    if (await popup.isVisible()) {
      // Find and interact with the checkbox inside the popup
      const checkbox = popup.locator(
        '//*[@id ="checkbox_k5MjYyMjMz" and @type ="checkbox"]'
      ); // Change the locator
      await checkbox.click();

      // Wait for some time (adjust this delay as needed)
      await this.page.waitForTimeout(2000);

      // Find and click on the 'Create' button in the popup
      const createButton = popup.locator(""); // Change the locator
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
    await this.commutation_type.press("Enter");
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
    await this.destinationAccountNumber.press("Tab");
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Enter");

    if (FullExit) {
      await this.payFullBalance.click();
    } else {
      await this.partialBalance.click();
      await this.sleep(2000);
      await this.page.getByPlaceholder("0").fill("1000");
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
    await this.selectFilterType.fill("PTB");
    await this.filterType_PTB.click();
    await this.applyButton.click();
    await this.sleep(5000);
    if (PTB) {
      expect(this.transactionType_PTB).toBeVisible();
      await this.page.locator("//tr[contains(@class,'clickable')]//td[1]").first().click();
      await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
      await this.sleep(2000).then(() => { this.page.getByLabel('close', { exact: true }).click() });
    }
    await this.reviewCase.captureScreenshot();
  }

  async transactionView() {
    await this.sleep(3000);
    await this.TransactioReference.scrollIntoViewIfNeeded();
    await this.TransactioReference.click();
    let transID = this.page.locator(
      "section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)"
    );
    let id = transID.textContent();
    return id!;
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
      console.log(
        "Payment received date or processed payment date is null or undefined."
      );
    }

    await this.BenefitPaymentId.scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.BenefitPaymentId.click();

    let transID = await this.page
      .locator(
        "section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)"
      )
      .textContent();
    let status = await this.page
      .locator("//span[@class='font-semibold']/following-sibling::span[1]")
      .innerText();
    await this.reviewCase.captureScreenshot();
    if (status.trim() === "Finalised") {
      console.log(`${transID} is Finalised. payment has been  processed.`);
    } else if (status.trim() === "Pending") {
      console.log(`${transID}. payment is in pending state.`);
    } else {
      throw new Error(` ${transID} is not Finalised.`);
    }

    await this.componentScreen.click();
    let taxAmountValue = await this.taxableTaxed.textContent();
    const taxAmount = parseFloat(taxAmountValue!.replace(/[^0-9.-]+/g, ""));
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    console.log("Tax amount:", taxAmount);
    let preservedComponent = await this.preserved.textContent();
    const unpComponentValue = parseFloat(
      preservedComponent!.replace(/[^0-9.-]+/g, "")
    );
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
    // Click on the investment screen
    await this.investmentScreen.click();
    const unitPriceTable = await this.page.$(
      "//td[contains(@class,'el-table_12_column_59 ')]/following-sibling::td[1]"
    );
    const unitPricevalue = await unitPriceTable?.textContent();
    console.log(unitPricevalue);
    const value = unitPricevalue?.trim();
    console.log(value);
    const match = unitPricevalue?.match(/\$(\d+\.\d{4,})/);
    console.log(match ? parseFloat(match[1]) : null);
    await this.reviewCase.captureScreenshot();
    await this.sleep(3000);
    await this.closePopUp.click();

  }

  async adminFee() {
    await this.sleep(4000);
    await this.adminFeeCase.click();
    await this.sleep(5000);
    let view = await this.page.locator("//span[text()=' VIEW CASE ']");
    view.scrollIntoViewIfNeeded();
    await this.sleep(3000);
    view.click();

    await this.sleep(3000);
    await this.activityData.click();
    const fixedFeeTotal = await this.page.$(
      "(//span[@class='tree-view-item-key']/following::span[@class='tree-view-item-value tree-view-item-value-number'])[1]"
    );
    const total = await fixedFeeTotal?.textContent();
    expect(total).not.toBeNull();
    const assetBasedFeeTotal = await this.page.$(
      "(//span[@class='tree-view-item-key']/following::span[@class='tree-view-item-value tree-view-item-value-number'])[2]"
    );
    const feeTotal = await assetBasedFeeTotal?.textContent();
    expect(feeTotal).not.toBeNull();
    await this.sleep(3000);
    await this.closeTheData.scrollIntoViewIfNeeded();
    await this.closeTheData.click();
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
  }

  async investementBalances() {
    await this.sleep(3000);
    await this.investmentBalanceScreen.click();
    const investmentBalance = await this.page.$(
      "(//p[@class='mx-1']/following::p[@class='mx-1'])[5]"
    );
    const balance = investmentBalance?.textContent();
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    expect(balance).not.toBeNull();
    await this.sleep(3000);
    await this.page
      .locator("//h2[text()='Asset Allocation']")
      .scrollIntoViewIfNeeded();
    await this.reviewCase.captureScreenshot();
    await this.sleep(3000);
    await this.page.locator("//p[text()=' Target ']").scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
    await this.sleep(4000);
    await this.page
      .locator("(//div[text()='Market value'])[1]")
      .scrollIntoViewIfNeeded();
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot();
  }

  async memberStatus() {
    await this.sleep(3000);
    await this.summary.click();
    let accountStatus = await this.page.$(
      "//p[@class='gsTkwh']/following-sibling::div[@class='fVEMQP']/span[@class= 'fxIQyb']/following-sibling::p[1]"
    );
    console.log(accountStatus);
    if (accountStatus) {
      let memberStatus = await accountStatus.evaluate((node) =>
        node.textContent?.trim()
      );
      console.log("member status is:", memberStatus);
      if (memberStatus) {
        memberStatus = memberStatus.trim();
        if (memberStatus === "Exited") {
          console.log("Member has been Exited successfully");
        } else if (memberStatus === "Active") {
          console.log("Member is still in Active state only");
        } else if (memberStatus === "Pending") {
          console.log("Member status is in Pending state only");
        }
      } else {
        console.log("Member status not found or text content is null.");
      }
    } else {
      console.log("Account status element not found.");
    }
  }

  async componentsValidation() {
    await this.componentScreen.click();
    let taxAmountValue = await this.taxableTaxed.textContent();
    const taxAmount = parseFloat(taxAmountValue!.replace(/[^0-9.-]+/g, ""));
    await this.sleep(3000);
    await this.reviewCase.captureScreenshot("Payment Compnonents");
    console.log("Tax amount:", taxAmount);
    let preservedComponent = await this.preserved.textContent();
    const unpComponentValue = parseFloat(
      preservedComponent!.replace(/[^0-9.-]+/g, "")
    );
    console.log("Preserved Component:", unpComponentValue);
    let payGValue = await this.paygAssessableIncome.textContent();
    expect(payGValue).toMatch(/^(yes|no)$/i);
    await this.sleep(3000);
    await this.paymentDetails.click();
    const amountTransfer = await this.page.$(
      "(//p[text()='Amount']/following::p[@class='font-semibold'])[1]"
    );
    const amount = amountTransfer?.textContent();
    expect(amount).not.toBeNull();
    const conversationId = await this.page.$(
      "(//p[text()='Conversation ID']/following::p[@class='font-semibold'])[1]"
    );
    conversationId?.scrollIntoViewIfNeeded();
    if (conversationId) {
      const id = await conversationId.textContent();
      if (id) {
        const containsInternalTransfer = id.includes("InternalTransfer");
        if (!containsInternalTransfer) {
          console.log(
            "Error: conversationId does not contain 'InternalTransfer'"
          );
        }
      } else {
        console.error(
          "Error: The conversation ID text content is null or empty"
        );
      }
    } else {
      console.error("Error: Conversation ID element not found");
    }
    await this.reviewCase.captureScreenshot('Payment Details');
    await this.closePopUp.click();
  }

  async shellAccount(
    navBar: Navbar,
    pensionAccountPage: PensionShellAccount,
    apiRequestContext: APIRequestContext
  ) {
    const { memberNo, processId, surname } =
      await MemberApiHandler.createPensionShellAccount(apiRequestContext);

    // Perform necessary operations related to pension account creation
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await navBar.selectMember(memberNo);

    // Return relevant data
    return { memberNo, processId, surname };
  }

  async memberPensionShellAccountCreation(
    navBar: Navbar,
    pensionAccountPage: PensionShellAccount,
    apiRequestContext: APIRequestContext,
    commencePension: boolean = true
  ) {
    let { memberNo, surname } = await this.shellAccount(
      navBar,
      pensionAccountPage,
      apiRequestContext
    );

    // Fetch additional details and perform pension-related actions
    const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
    if (commencePension) {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await MemberApiHandler.commencePensionMember(apiRequestContext, linearId.id);
    }
    await new Promise((resolve) => setTimeout(resolve, 10000));
    await RollinApiHandler.createRollin(apiRequestContext, linearId.id);
    await TransactionsApiHandler.fetchRollInDetails(
      apiRequestContext,
      linearId.id
    );
    let { id, fundName, tfn, givenName, dob } =
      await MemberApiHandler.getMemberDetails(apiRequestContext, linearId.id);

    if (id) {
      await MemberApiHandler.memberIdentity(apiRequestContext, id, {
        tfn,
        dob,
        givenName,
        fundName,
      });
    }

    // Return relevant data
    return { memberNo, surname, linearId };
  }

  async memberWithPTBTransactions(navBar: Navbar, pensionAccountPage: PensionShellAccount, apiRequestContext: APIRequestContext) {
    let { linearId, memberNo } = await this.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
    await MemberApiHandler.ptbTransactions(apiRequestContext, linearId.id)
    return { linearId: linearId.id, memberNo };
  }

  async memberShellAccountCreation(
    navBar: Navbar,
    pensionAccountPage: PensionShellAccount,
    apiRequestContext: APIRequestContext,
    commencePension: boolean = true
  ) {
    // Process pension account and retrieve necessary data
    let { memberNo, surname } = await this.memberPensionShellAccountCreation(
      navBar,
      pensionAccountPage,
      apiRequestContext,
      commencePension
    );

    //await pensionAccountPage.reload();

    // Return relevant data
    return { memberNo, surname };
  }

  async transactions() {
    await this.sleep(3000);
    await this.TransactioType.scrollIntoViewIfNeeded();
    await this.TransactioType.click();
    let transID = this.page.locator(
      "section[class='gs-row flex padding-bottom-20 border-b border-neutral-100'] div:nth-child(1) p:nth-child(1)"
    );
    let id = transID.textContent();
    return id!;
  }

  async verifyErrorMessageForMemberBalanceNotHundredPercentUNP() {
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.pensionCommutation.click();
    await this.sleep(3000);
    await this.viewCase.click();
    await this.sleep(3000);
    await this.createCase.click();
    await this.sleep(3000);
    if (await this.commutation_type.isVisible()) {
      await this.commutation_type.click();
    } else {
      await this.linkCase.click();
      await this.sleep(3000);
    }
    await this.commutation_type.press("Enter");
    await this.commutationTypeDropDown.click();
    await this.commutationUNPBenefitButton.click();
    await this.sleep(3000);
    await this.page.locator("(//div[@class='gs__selected-options']//input)[3]").click();
    await this.UNPPayment.click();
    const bankAccount = await this.page.locator("//label[@for='bankAccount']/following::div[@class='gs__selected-options']");
    bankAccount.click();
    await this.sleep(3000);
    bankAccount.press('ArrowDown');
    await this.sleep(3000);
    bankAccount.press('Enter');
    await this.sleep(3000);
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Enter");
    await this.linkCase.click();
    await this.sleep(3000);
    await this.reviewCase.approveAndVerifyError(this.verifyUNPErrorMessage);
  }

  async memberNoCOR(membersAge: number) {
    await this.sleep(3000);
    await this.page.locator("//button[text()='Related Information']").click();
    await this.page.waitForTimeout(3000);
    await this.page.locator("//h2[text()=' Condition of Release ']").scrollIntoViewIfNeeded();
    await this.page.locator("//span[text()='Add Condition Of Release']").click();
    await this.page.waitForTimeout(3000);
    await this.page.locator("(//div[@class='gs__selected-options'])[2]").click();
    await this.sleep(2000);

    if (membersAge < 65) {
      await this.page.getByRole('option', { name: 'Cease Employment' }).click();
    } else {
      await this.page.getByRole('option', { name: 'or Older' }).click();
    }
    await this.page.waitForTimeout(3000).then(() => { this.viewCase.click() });
    await this.sleep(2000).then(() => { this.createCase.click() });
    await this.sleep(2000).then(() => { this.linkCase.click() });
    await this.sleep(3000).then(() => { this.reviewCase.captureScreenshot() });
    await this.reviewCase.reviewCaseProcess(this.page.getByText('Processed upsert dated meta data.'));
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });

  }

  async cohortProcess(memberNumber: string) {
    await this.page.waitForTimeout(3000).then(() => { this.page.getByRole('link', { name: 'Processes' }).click() });
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
    await this.sleep(3000).then(() => { this.page.locator("//a[contains(text(),'Manage Processes')]").click() });
    let processSearch = await this.page.locator("(//div[@aria-label='Search for option']//div)[3]");
    await processSearch.click().then(() => { this.sleep(3000) });
    await this.page.getByPlaceholder('Search').fill(pensions.processType);
    await this.page.getByRole('option', { name: 'Retirement Transition' }).click();
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
    await this.page.getByRole('main').locator('div').filter({ hasText: 'Retirement Transition Live' }).nth(2).click();
    await this.sleep(2000);
    await this.page.locator("//div[text()=' Set Cohort - Start Date and Frequency ']").click();
    await this.sleep(2000);
    const deleteIcon = await this.page.getByRole('button', { name: 'bin icon' });
    if (await deleteIcon.isVisible()) {
      deleteIcon.click();
    } else {
      await this.sleep(2000).then(() => {
        this.page.getByRole('button', { name: 'add-circle icon Add New Cohort' }).click()
      });
      await this.page.locator("//span[text()=' FILTER ']").click();
      await this.page.getByText('Member Number').click();
      await this.sleep(3000);
      const textArea = await this.page.locator("//textarea[@class='el-textarea__inner']");
      console.log(memberNumber);
      textArea.fill(memberNumber);
      await this.sleep(3000);
      await this.page.getByRole('button', { name: 'APPLY' }).click();
      let datePlaceHolder = await this.page.getByRole('textbox', { name: 'dd/mm/yyyy' });
      await this.sleep(5000);
      datePlaceHolder.scrollIntoViewIfNeeded();
      await this.sleep(3000);
      datePlaceHolder.click();
      let date = new Date();
      let today = DateUtils.ddmmyyyStringDate(0);
      datePlaceHolder.fill(today);
      await this.sleep(2000);
      datePlaceHolder.press('Enter');
      datePlaceHolder.press('Tab');
      await this.sleep(2000).then(() => { this.page.getByRole('option', { name: pensions.FrequencyType[0], exact: true }).click() });
      let monthSearch = await this.page.locator("(//label[text()='Start Month ']/following::input)[1]");
      monthSearch.click();
      await this.sleep(3000);
      let currentMonth = date.getMonth();
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let currentMonthName = months[currentMonth];
      monthSearch.fill(currentMonthName);
      await this.sleep(2000);
      await this.page.getByRole('option', { name: currentMonthName, exact: true }).click();
      date.setDate(date.getDate() - 15);
      let currentDayOfMonth = date.getDate();
      let dayOfMonth = await this.page.locator("(//label[text()='Day of Month ']/following::input)[1]");
      dayOfMonth.click();
      dayOfMonth.fill(currentDayOfMonth.toString());
      await this.sleep(2000);
      await this.page.getByRole('option', { name: currentDayOfMonth.toString(), exact: true }).click();
      let time = await this.page.locator("//input[@placeholder='00:00:00']");
      time.click();
      await this.sleep(2000).then(() => { this.page.locator("//button[text()='OK']").click() });
      await this.page.waitForTimeout(3000);
      let reference = await this.page.getByLabel('Cohort Reference *')
      reference.scrollIntoViewIfNeeded();
      let testName = UtilsAOL.randomName();
      reference.fill(`${testName} +Test`);
      await this.sleep(2000)
      await this.page.getByRole('button', { name: 'Add', exact: true }).focus().then(() => { this.page.getByRole('button', { name: 'Add', exact: true }).click({ force: true }) });
      await this.sleep(3000);
      await this.page.getByRole('button', { name: 'Done' }).click();
      await this.page.waitForTimeout(3000);
      const processIcon = await this.page.locator('div').filter({ hasText: /^more icon$/ }).getByRole('button');
      processIcon.click();
      await this.page.waitForTimeout(3000);
      const runProcess = await this.page.getByText('Run Process');
      runProcess.focus().then(() => runProcess.click())
      await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
      await this.sleep(3000);
      const processDate = await this.page.getByPlaceholder('dd/mm/yyyy');
      processDate.click().then(() => processDate.fill(today));
      await this.sleep(3000);
      processDate.press('Enter');
      await this.sleep(3000);
      await this.page.getByRole('button', { name: 'Run Process' }).click();
      await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
    }
  }

  async retirementToTransistionProcess() {
    await this.sleep(5000);
    let processSummary = await this.page.locator("//a[contains(text(),'Process Summary')]");
    processSummary.click();
    await this.page.locator("//button[@aria-label='Retirement Transition']").first().isVisible();
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });


  }

  async conditionOfRelease() {
    await this.sleep(3000);
    await this.page.locator("(//a[contains(@class,'gs-link text-teal-300')]//span)[1]").click();
    await this.sleep(3000);
    await this.page.locator("//button[text()='HESTA for Mercy Transition to Retirement']").click();
    await this.page.locator("//button[text()='Related Information']").click();
    await this.page.waitForTimeout(3000);
    await this.page.locator("//h2[text()=' Condition of Release ']").scrollIntoViewIfNeeded();

  }

  async investmentsRebalance(REB: boolean) {
    await this.sleep(3000);
    await this.page.getByRole('button', { name: 'Investments and Balances' }).click();
    let rebalanceButton = await this.page.getByRole('button', { name: 'REBALANCE' });
    await this.sleep(3000);
    rebalanceButton.scrollIntoViewIfNeeded();
    rebalanceButton.click().then(() => this.sleep(2000));
    await this.page.waitForTimeout(5000);
    await this.page.locator("//div[@class='el-message-box__header']/following::span[text()='YES, CONTINUE']").click();
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
    await this.page.getByRole('button', { name: 'OK' }).click();
    await this.sleep(3000);
    await this.page.getByRole('heading', { name: 'Costs From Investments' }).scrollIntoViewIfNeeded();
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
    await this.sleep(3000);
    await this.memberTransactionTab.click();
    await this.sleep(3000).then(() => this.transactionsHistoryFilter.scrollIntoViewIfNeeded()).then(() => this.transactionsHistoryFilter.click());
    await this.sleep(3000);
    await this.filterCategory_Type.click();
    await this.selectFilterType.click();
    await this.selectFilterType.fill('REB');
    await this.sleep(3000).then(() => this.page.locator('li').filter({ hasText: /^REB$/ }).click());
    await this.applyButton.click();
    await this.sleep(3000);
    if (REB) {

      await this.page.getByRole('cell', { name: 'Rebalance', exact: true }).first().click();
      await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
      await this.sleep(2000).then(() => { this.page.locator("//i[contains(@class,'el-icon el-dialog__close')]//*[name()='svg']").click() });
    }
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });

  }

  async investmentSwitch(INVPC: boolean) {
    await this.sleep(3000);
    await this.memberTransactionTab.click();
    await this.sleep(3000).then(() => this.transactionsHistoryFilter.scrollIntoViewIfNeeded()).then(() => this.transactionsHistoryFilter.click());
    await this.sleep(3000);
    await this.filterCategory_Type.click();
    await this.selectFilterType.click();
    await this.selectFilterType.fill('INVPC');
    await this.sleep(3000).then(() => this.page.locator("(//li[@class='el-select-dropdown__item option_select_equals_INVPC_32'])[1]").click());
    await this.applyButton.click();
    await this.sleep(3000);
    if (INVPC) {
      expect(this.page.locator("//div[@class='inline-flex']//div[contains(text(),'Investment Switch')]")).toBeVisible();
      await this.page.locator("//tr[contains(@class,'clickable')]//td[1]").first().click();
      await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });
      await this.sleep(2000).then(() => { this.page.locator("//i[contains(@class,'el-icon el-dialog__close')]//*[name()='svg']").click() });
    }
    await this.reviewCase.captureScreenshot();


  }


  async memberAge(membersAge: number) {
    await this.sleep(3000);
    await this.page.getByRole('button', { name: 'Member Summary' }).click();
    await this.sleep(3000);
    await this.page.locator("//p[normalize-space()='Contact details']").scrollIntoViewIfNeeded();
    await this.reviewCase.captureScreenshot();
    let memberAge = await this.page.locator("(//p[@data-cy='info-title']/following::p[@data-cy='info-value'])[15]");
    let age = await memberAge.textContent();
    let ageNumber = age ? parseInt(age.replace('years', '').trim()) : NaN;
    console.log("Age Number:", ageNumber);
    await this.page.waitForTimeout(3000);
    if (membersAge >= ageNumber) {
      await this.memberNoCOR(membersAge);
    } else {
      await this.memberNoCOR(membersAge);
    }

  }

  async accountBalance() {
    await this.sleep(3000);
    await this.page.getByRole('button', { name: 'Investments and Balances' }).click();
    await this.sleep(2000).then(() => { this.page.locator("(//div[contains(text(),'Total')])[5]").scrollIntoViewIfNeeded() });
    await this.sleep(2000).then(() => { this.reviewCase.captureScreenshot() });

  }

  async InvestmentSwitchTransactionStatus() {
    await this.memberTransactionTab.click();
    await this.sleep(3000);
    await this.investmentSwitchTransaction.scrollIntoViewIfNeeded();
    await this.investmentSwitchTransaction.click();
    await this.reviewCase.captureScreenshot();
  }

  async deathBenefit(NewMember?: boolean) {
    if (NewMember) {
      await this.sleep(3000);
    } else {
      (await this.sleep(3000).then(() => this.page.locator("//button[text()='Transactions']"))).click();
    }
    let sgcType = await this.page.locator("//div[@class='cell']/following::div[text()='DBE']").first();
    await sgcType.scrollIntoViewIfNeeded();
    await this.sleep(2000);
    await sgcType.click();
    await this.sleep(3000).then(() => this.globalPage.captureScreenshot('Transactions -Payment Details Screen'));
  }


}
