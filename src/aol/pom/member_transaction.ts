import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { DateUtils } from "../../utils/date_utils";
import { InvalidResultAttributeException } from "@aws-sdk/client-ssm";
import { ReviewCase } from "./component/review_case";
import { MemberOverView } from "./member/member_overview";
import * as member from "../../aol/data/member.json"

export class MemberTransactionsPage extends BasePage {
  //Rollover In
  readonly memberHFMFundLink: Locator;
  readonly memberTransactionTab: Locator;
  readonly memberAddTransaction: Locator;
    readonly rollinOption: Locator;
    readonly memberAddContribution: Locator;
    readonly memberContributionType: Locator;
    readonly memberContributionType_personal: Locator;
    readonly memberContributionType_salarySacrifice: Locator;
    readonly paymentReference: Locator;
    readonly paymentReceivedDate: Locator;
    readonly effectiveDate: Locator;
    readonly contributionAmount: Locator;
    readonly governmentContribution: Locator;
    readonly governmentContribution_No: Locator;
    readonly governmentContribution_Yes: Locator;
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly verifyContributionSuccess: Locator;
    readonly transitionToRetirement: Locator;
    readonly memberContributionType_superGuarantee: Locator;
    readonly memberContributionType_Spouse: Locator;
    readonly memberContributionType_Retirement: Locator;
    readonly memberContributionErrorMessage: Locator;
    readonly childContributionErrorMessage: Locator;
    readonly memberContributionType_Child: Locator;
    readonly memberSummaryTab: Locator;
    readonly memberAge: Locator;
    readonly accountNumber: Locator;
    readonly paymentAmount: Locator;
    readonly paymentAmountInput: Locator;
    readonly untaxedComponent: Locator;
    readonly untaxedComponentInput: Locator;
    readonly taxedComponent: Locator;
    readonly taxedComponentInput: Locator;
    readonly taxFreeComponent: Locator;
    readonly taxFreeComponentInput: Locator;
    readonly unrestrictedAmount: Locator;
    readonly unrestrictedAmountInput: Locator;
    readonly restrictedAmount: Locator;
    readonly restrictedAmountInput: Locator;
    readonly preservedAmount: Locator;
    readonly preservedAmountInput: Locator;
    readonly rollinType_dropdown: Locator;
    readonly rollinType_option: Locator;
    readonly rollinSuccessMessage: Locator;
    readonly rollInTransaction: Locator;
    readonly rollOutTransaction: Locator;

  //Rollover Out
    readonly rollOutErrorMessage: Locator;
  readonly rolloverOut: Locator;
  readonly payTo: Locator;
  readonly payToOption: Locator;
  readonly fundUSI: Locator;
  readonly destinationAccountNumber: Locator;
  readonly payFullBalance: Locator;
  readonly supertickRetry: Locator;
  readonly verifyRolloutProcessSuccess: Locator;
  readonly memberOverview: Locator;
  readonly exitStatus: Locator;
  readonly trasitionMembers: Locator;
  readonly processException: Locator;
  // Member Termination
  readonly accumulationFirstMember: Locator;
  readonly relationshipBtn: Locator;
  readonly employementEditBtn: Locator;
  readonly employerEndDate: Locator;
  readonly viewCases: Locator;
  readonly reviewCase: ReviewCase;
  readonly memberOverViewPage: MemberOverView;
  readonly firstRowMember: Locator;
  readonly pensionComutation: Locator;
    readonly partialBalance: Locator;

    //Benefit Payment
    readonly benefitPaymentOption: Locator;
    readonly benefitType_dropdown: Locator;
    readonly benefitType_RetirementPreservationAge: Locator;
    readonly benefitType_CeasedEmploymentAgeAfter60: Locator;
    readonly benefitType_Age65orOlder: Locator;
    readonly benefitType_FinancialHardship: Locator;
    readonly benefitTyoe_UnrestrictedNonPreservedBenefit: Locator;
    readonly benefitType_CompassionateGroundsPartial: Locator;
    readonly benefitType_PermanentIncapacity: Locator;
    readonly benefitType_DeathBenefit: Locator;
    readonly paymentType_dropdown: Locator;
    readonly paymentTypeOption: Locator;
    readonly selectAccount_dropdown: Locator;
    readonly selectAccountOption: Locator;
    readonly benefitPayment_SuccessMessage: Locator;
    readonly benefitTransactionReference: Locator;
    readonly paymentTransactionReference: Locator;
    readonly investmentsReference: Locator;

  readonly filterButton: Locator;
  readonly typeFilter: Locator;
  readonly selectOption: Locator;
  readonly afeOption: Locator;
  readonly applyButton: Locator;
  readonly fixedFee: Locator;
  readonly assetBasedFee: Locator;
  constructor(page: Page) {
    super(page);

    this.reviewCase = new ReviewCase(page);
    this.memberOverViewPage = new MemberOverView(page);
    this.processException = page.locator(
      "(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]"
    );

    //Rollover In
    this.memberHFMFundLink = page.getByRole("button", {
      name: "HESTA for Mercy Super",
    });
    this.memberTransactionTab = page.getByRole("button", {
      name: "Transactions",
    });
    this.memberAddTransaction = page.getByRole("button", {
      name: "ADD TRANSACTION",
    });
        this.rollinOption = page.getByText('Rollover In');
        this.accountNumber = page.getByLabel('Account number *');
        this.paymentAmount = page.locator("//input[@id='amount']/parent::div");
        this.paymentAmountInput = page.locator("//input[@id='amount']");
        this.untaxedComponent = page.locator("//input[@id='untaxed']/parent::div");
        this.untaxedComponentInput = page.locator("//input[@id='untaxed']");
        this.taxedComponent = page.locator("//input[@id='taxed']/parent::div");
        this.taxedComponentInput = page.locator("//input[@id='taxed']");
        this.taxFreeComponent = page.locator("//input[@id='taxFree']/parent::div");
        this.taxFreeComponentInput = page.locator("//input[@id='taxFree']");
        this.unrestrictedAmount = page.locator("//input[@id='unrestrictedNonPreserved']/parent::div");
        this.unrestrictedAmountInput = page.locator("//input[@id='unrestrictedNonPreserved']");
        this.restrictedAmount = page.locator("//input[@id='restrictedNonPreserved']/parent::div");
        this.restrictedAmountInput = page.locator("//input[@id='restrictedNonPreserved']");
        this.preservedAmount = page.locator("//input[@id='preserved']/parent::div");
        this.preservedAmountInput = page.locator("//input[@id='preserved']");
        this.rollinType_dropdown = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.rollinType_option = page.getByRole('option', { name: 'Client-RTR' });
        this.rollinSuccessMessage = page.getByText('Processed Roll In.');
        this.rollInTransaction = page.getByRole('row', { name: 'Roll In' }).first();
        this.rollOutTransaction = page.getByRole('row', { name: 'Rollover Out Payment' }).first();
        this.rollOutErrorMessage = page.getByText('Member TFN is required for SuperTick Verification');
        this.memberAddContribution = page.getByText('Contribution', { exact: true });
        this.memberContributionType = page.locator("(//div[@class='gs__selected-options'])[2]")
        this.memberContributionType_personal = page.getByRole('option', { name: 'Personal', exact: true }).locator('span');
        this.memberContributionType_salarySacrifice = page.getByRole('option', { name: 'Salary Sacrifice' });
        this.paymentReference = page.getByLabel('Payment Reference *');
        this.paymentReceivedDate = page.locator('input[name="paymentReceivedDate"]');
        this.effectiveDate = page.locator('input[name="effectiveDate"]');
        this.contributionAmount = page.getByPlaceholder('0');
        this.governmentContribution = page.locator("(//div[@class='gs__selected-options'])[3]");
        this.governmentContribution_No = page.getByRole('option', { name: 'No' });
        this.governmentContribution_Yes = page.getByRole('option', { name: 'Yes' });
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.verifyContributionSuccess = page.getByText("Processed contribution for member.");
        this.transitionToRetirement = page.getByRole('link', { name: 'Transition to Retirement' });
        this.trasitionMembers = page.getByRole('link', { name: 'Members' });
        this.memberContributionType_Spouse = page.getByRole('option', { name: 'Spouse' });
        this.memberContributionType_Retirement = page.getByRole('option', { name: 'CGT Retirement' });
        this.memberContributionType_superGuarantee = page.getByRole('option', { name: 'Super Guarantee' });
        this.memberContributionType_Child = page.getByRole('option', { name: 'Child' });
    this.memberContributionErrorMessage = page
      .getByText(
        "com.growadministration.common.TinaServerException: Validation failed: Member's TFN is required."
      )
      .first();
        this.childContributionErrorMessage = page.getByText("com.growadministration.common.TinaServerException: Validation failed: Member's age should be less than 18.");
        this.memberAge = page.locator("(//div[@class='ihgyFx'])[9]");
        this.memberSummaryTab = page.getByRole('button', { name: 'Investor Summary' });
        
    // Member Termination
    this.accumulationFirstMember = page.locator("td > .cell").first();
    this.relationshipBtn = page.getByRole("button", { name: "Relationships" });
    this.employementEditBtn = page.locator('button').filter({ hasText: 'Edit Content' }).nth(0);
    this.employerEndDate = page.locator('input[name="linkBroken"]');
    this.viewCases = page.getByRole("button", { name: "View Cases" });

    //Rollover out
    this.rolloverOut = page.getByText("Rollover Out");
    this.payTo = page
      .getByRole("combobox", { name: "Search for option" })
      .locator("div")
      .first();
    this.payToOption = page.getByRole("option", { name: "Fund" });
    this.fundUSI = page.getByLabel("Fund USI *");
    this.destinationAccountNumber = page.getByLabel(
      "Destination account number"
    );
    this.payFullBalance = page.locator(".switch-slider").first();
    this.viewCase = page.getByRole("button", { name: "View Cases" });
    this.createCase = page.getByRole("button", { name: "Create Case" });
    this.linkCase = page.getByRole("button", { name: "Link to Case" });
    this.approveProcessStep = page.getByRole("button", { name: "Approve" });
    this.supertickRetry = page.getByText(
      "SuperTick verification result is not ready, retry in a few minutes"
    );
    this.retryProcessStep = page
      .getByRole("button")
      .filter({ hasText: "Retry" })
      .first();
    this.verifyRolloutProcessSuccess = page.getByText(
      "Process step completed with note: Manual Super Stream rollout correspondence sent"
    );
    this.memberOverview = page.getByRole("button", { name: "Overview" });
    this.exitStatus = page.getByRole("cell", { name: "Exited", exact: true });
    this.firstRowMember = page.locator("td:nth-child(6) > .cell").first();
    this.pensionComutation = page.getByText("Pension Commutation");
    this.filterButton = page.getByRole("button", { name: " FILTER " });
    this.typeFilter = page.locator(
      "//div[text()='Type' and @class='filter-list-item']"
    );
    this.selectOption = page.getByRole("textbox", { name: "Select" });
    this.afeOption = page.locator("//li//span[text()='AFE']");
    this.applyButton = page.getByRole("button", { name: " APPLY " });
    expect(
      this.page
        .getByRole("cell", { name: "Fee", exact: true })
        .locator("div")
        .first().isVisible
    );
    this.fixedFee = page.getByRole("dialog").getByText("FIXED_FEE").first();
    this.assetBasedFee = page
      .getByRole("dialog")
      .getByText("ASSET_BASED_FEE")
      .first();
        //Benefit Payment
        this.benefitPaymentOption = page.getByText('Benefit Payment');
        this.benefitType_dropdown = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.benefitType_RetirementPreservationAge = page.getByRole('option', { name: 'Retirement - Preservation Age' });
        this.benefitType_CeasedEmploymentAgeAfter60 = page.getByRole('option', { name: 'Ceased Employment After Age' });
        this.benefitType_Age65orOlder = page.getByRole('option', { name: 'Age 65 or older' });
        this.benefitType_FinancialHardship = page.getByRole('option', { name: 'Financial Hardship' });
        this.benefitTyoe_UnrestrictedNonPreservedBenefit = page.getByRole('option', { name: 'Unrestricted Non-Preserved' });
        this.benefitType_CompassionateGroundsPartial = page.getByRole('option', { name: 'Compassionate Grounds' });
        this.benefitType_PermanentIncapacity = page.getByRole('option', { name: 'Permanent Incapacity' });
        this.benefitType_DeathBenefit = page.getByRole('option', { name: 'Death Benefit' });
        this.paymentType_dropdown = page.locator("(//div[@class='gs__dropdown-toggle'])[3]");
        this.paymentTypeOption = page.getByRole('option').first();
        this.selectAccount_dropdown = page.locator("(//div[@class='gs__dropdown-toggle'])[5]");
        this.selectAccountOption = page.getByRole('option').first();
        this.benefitPayment_SuccessMessage = page.getByText("Process step completed with note: Benefit payment correspondence sent.");
        this.benefitTransactionReference = page.getByRole('row', {name: 'Benefit'}).first();
        this.paymentTransactionReference = page.getByRole('row', {name: 'Payment'}).first();
        this.investmentsReference = page.locator("//span[@class='btn-heading' and contains(text(),'Investments')]");
        this.partialBalance = page.getByText('0.00', { exact: true });
  }

    /** Member Rollin, adds a contribution to member account */
    async memberRolloverIn(contributionType?: String, TFN?: Boolean, GovContribution?: Boolean) {
        let age;
        if(contributionType == 'Child'){
            await this.memberSummaryTab.click();
            await this.memberAge.scrollIntoViewIfNeeded();
            await this.reviewCase.captureScreenshot();
            const value = await this.memberAge.textContent();
            age = parseInt(value!.match(/\d+/)![0]);
        }
    await this.memberOverViewPage.memberAccumulationAccount_Tab.click();
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.memberAddContribution.click();

    await this.viewCase.click();
    await this.createCase.click();
    await this.sleep(3000);
    let contributionAmount = "10000";

        await this.memberContributionType.click();
        if(contributionType == 'Salary Sacrifice'){
            await this.memberContributionType_salarySacrifice.click();
        }
        else if(contributionType == 'Super Guarantee'){
            await this.memberContributionType_superGuarantee.click();
        }
        else if(contributionType == 'Retirement'){
            await this.memberContributionType_Retirement.click();
        }
        else if(contributionType == 'Spouse'){
            await this.memberContributionType_Spouse.click();
        }
        else if(contributionType == 'Child'){
            await this.memberContributionType_Child.click();
        }
        else{
            await this.memberContributionType_personal.click();
        }
        await this.paymentReference.fill('PA');
        await this.paymentReceivedDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.paymentReceivedDate.press('Tab');
        await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.effectiveDate.press('Tab');
        await this.contributionAmount.fill(contributionAmount);
        await this.governmentContribution.click();
        if(!GovContribution){
            await this.governmentContribution_No.click();
        }
        else{
            await this.governmentContribution_Yes.click();
        }
        await this.sleep(3000);

        await this.linkCase.click();
        await this.sleep(5000);
        if( TFN==true && contributionType != 'Child' ){
        await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);
        }
        else if(TFN == true && contributionType == 'Child'){
            if(age! > 18){
            await this.reviewCase.approveAndVerifyError(this.childContributionErrorMessage);
            }
            else{
                await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);
            }
        }
        else{
            await this.reviewCase.approveAndVerifyError(this.memberContributionErrorMessage);
        }
        return contributionAmount;
    }

    /** Member Termination for Current Date */
    async employmentTerminationForCurrentDate() {
        //await this.sleep(5000);
        await this.relationshipBtn.waitFor();
        await this.relationshipBtn.click();
        //await this.employementEditBtn.waitFor();
        await this.sleep(5000);
        await this.employementEditBtn.click();
        await this.viewCases.waitFor();
        await this.viewCases.click();
        await this.createCase.click();
        await this.sleep(3000);
        await this.employerEndDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.linkCase.click();
    }
    /** Member Termination for Earlier Date */
    async employmentTerminationForEarlierDate() {
        await this.sleep(3000);
        await this.relationshipBtn.click();
        await this.sleep(5000)
        await this.employementEditBtn.click();
        await this.sleep(2000);
        await this.viewCases.click();
        await this.createCase.click();
        await this.sleep(3000);
        await this.employerEndDate.fill(`${DateUtils.ddmmyyyStringDate(-2)}`);
        await this.linkCase.click();
    }

  /** Member Rollout, perform rollout and exits member */
  async memberRolloverOut(TFN: boolean) {
    await this.memberHFMFundLink.click();
    await this.memberTransactionTab.click();
    await this.memberAddTransaction.click();
    await this.rolloverOut.click();

    await this.viewCase.click();
    await this.createCase.click();
    this.sleep(3000);

    await this.payTo.click();
    await this.payToOption.click();
    await this.fundUSI.fill("STA0100AU");
    await this.fundUSI.press("Tab");
    await this.destinationAccountNumber.fill("MER-ACC-355657");
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.effectiveDate.press("Tab");
    await this.payFullBalance.click();

        await this.linkCase.click();
        await this.sleep(5000);
        if(TFN == true){
            await this.reviewCase.reviewCaseProcess(this.verifyRolloutProcessSuccess);
        }
        else{
            await this.reviewCase.approveAndVerifyError(this.rollOutErrorMessage);
        }

    }

    //Money_out Benefit Payment
    async benefitPayment(benefitType: string, FullExit: Boolean) {

        //await this.memberHFMFundLink.click();
        await this.memberTransactionTab.click();
        await this.memberAddTransaction.click();
        await this.benefitPaymentOption.click();

        await this.viewCase.click();
        await this.createCase.click();
        this.sleep(3000);

        await this.benefitType_dropdown.click();
        if(benefitType == 'Retirement - Preservation Age'){
            await this.benefitType_RetirementPreservationAge.click();
        }
        else if(benefitType == 'Ceased employment age after 60'){
            await this.benefitType_CeasedEmploymentAgeAfter60.click();
        }
        else if(benefitType == 'Age 65 or older'){
            await this.benefitType_Age65orOlder.click();
        }
        else if(benefitType == 'Financial Hardship'){
            await this.benefitType_FinancialHardship.click();
        }
        else if(benefitType == 'Unrestricted non-preserved benefit'){
            await this.benefitTyoe_UnrestrictedNonPreservedBenefit.click();

        }
        else if(benefitType == 'Compassionate Grounds - Partial'){
            await this.benefitType_CompassionateGroundsPartial.click();
        }
        else if(benefitType == 'Permanent Incapacity'){
            await this.benefitType_PermanentIncapacity.click();
        }
        else if(benefitType == 'Death benefit'){
            await this.benefitType_DeathBenefit.click();
        }
        
        await this.paymentType_dropdown.click();
        await this.paymentTypeOption.click();
        await this.selectAccount_dropdown.click();
        await this.selectAccountOption.click();
        await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.effectiveDate.press('Tab');
        //await this.payFullBalance.click();
        if (!FullExit) {
            await this.page.locator('.switch-slider').click();
            await this.partialBalance.click();
            await this.sleep(2000);
            await this.page.getByPlaceholder('0').fill('2000');
          }

        await this.linkCase.click();
        await this.sleep(5000);
        await this.reviewCase.reviewCaseProcess(this.benefitPayment_SuccessMessage);

    }

    async investmentsComponents(paymentCategory: string){
        if(paymentCategory == 'Payment-BPAP'){
            this.paymentTransactionReference.scrollIntoViewIfNeeded();
            this.paymentTransactionReference.click();
        }
        else if(paymentCategory == 'Benefit Payment-BPA'){
            this.benefitTransactionReference.scrollIntoViewIfNeeded();
            this.benefitTransactionReference.click();
        }
        await this.investmentsReference.click();
        await this.reviewCase.captureScreenshot();
        await this.sleep(2000);
    }

    async RolloverIn() {
        
        await this.memberTransactionTab.click();
        await this.memberAddTransaction.click();
        await this.rollinOption.click();
        await this.sleep(3000);
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(3000);
        await this.fundUSI.fill(member.USI);
        await this.accountNumber.fill(member.AccountNumber);
        await this.paymentReference.fill("personal");
        await this.paymentReceivedDate.fill(DateUtils.ddmmyyyStringDate(0));
        await this.effectiveDate.fill(DateUtils.ddmmyyyStringDate(0));
        await this.paymentAmount.click();
        await this.paymentAmountInput.fill('5000');
        await this.untaxedComponent.click();
        await this.untaxedComponentInput.fill('2000');
        await this.taxedComponent.click();
        await this.taxedComponentInput.fill('2000');
        await this.taxFreeComponent.click();
        await this.taxFreeComponentInput.fill('1000');
        await this.unrestrictedAmount.click();
        await this.unrestrictedAmountInput.fill('2000');
        await this.restrictedAmount.click();
        await this.restrictedAmountInput.fill('1000');
        await this.preservedAmount.click();
        await this.preservedAmountInput.fill('2000');
        await this.rollinType_dropdown.click();
        await this.rollinType_option.click();
        await this.linkCase.click();

        await this.reviewCase.reviewCaseProcess(this.rollinSuccessMessage);
        
    }

    async checkAdminFeeTransactionForPensionCommute() {
      //below step can removed if we are already on transaction page
      await this.memberTransactionTab.click();
      await this.sleep(1000);
      await this.filterButton.click();
      await this.sleep(1000);
      await this.typeFilter.click();
      await this.sleep(1000);
      await this.selectOption.click();
      await this.sleep(1000);
      await this.afeOption.click();
      await this.applyButton.click();
      let dateExpected: string = DateUtils.ddMMMyyyStringDate(new Date());
      // console.log(" the date is " + dateExpected);
      //await this.page..locator("//td//div[text()='AFE']//following::td[2]//div[text()='"+dateExpected+"']");
      dateExpected = "26 Mar 2024";
      await this.page
        .locator(
          "//td//div[text()='AFE']//following::td[2]//div[text()='26 Mar 2024']"
        )
        .click();
      await expect(this.fixedFee).toBeVisible();
      await expect(this.assetBasedFee).toBeVisible();
    }
}
