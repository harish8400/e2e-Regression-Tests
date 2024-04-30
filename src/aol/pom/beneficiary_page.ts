import { BasePage } from "../../common/pom/base_page";
import { Locator, Page, expect } from "@playwright/test";
import * as member from "../data/member.json";
import { DateUtils } from "../../utils/date_utils";
import { ReviewCase } from "./component/review_case";

export class BeneficiaryPage extends BasePage {

  readonly accumulationFirstMember: Locator;
  readonly relationshipBtn: Locator;
  readonly addButton: Locator;
  //Beneficiary Input Fields
  readonly editButton: Locator;
  readonly beneficiaryName: Locator;
  readonly beneficiaryType: Locator;
  readonly bindingLapsing: Locator;
  readonly beneficiaryRelationship: Locator;
  readonly beneficiaryStartDate: Locator;
  readonly beneficiaryEndDate: Locator;
  readonly beneficiaryShare: Locator;
  readonly beneficiaryShare1: Locator;
  readonly contactFirstName: Locator;
  readonly contactSurName: Locator;
  readonly phoneInputField: Locator;
  readonly emailInputField: Locator;
  readonly genderDropDown: Locator;
  readonly saveButton: Locator;
  readonly nonBinding: Locator;
  readonly childDropDown: Locator;
  readonly linkCase: Locator;
  readonly viewCase: Locator;
  readonly createCase: Locator;
  readonly reviewCase: ReviewCase;
  readonly beneficiaryUpdateSuccess: Locator;
  readonly beneficiaryUpdateError: Locator;

  constructor(page: Page) {
    super(page);
    this.reviewCase = new ReviewCase(page);
    this.beneficiaryUpdateSuccess = page.locator("//p[text()='Process step completed with note: New Member Beneficiary letter payload sent.']");
    this.beneficiaryUpdateError = page.getByText('Case linking unsuccessful.');
    this.accumulationFirstMember = page.locator('td > .cell').first();
    this.relationshipBtn = page.getByRole('button', { name: 'Relationships' });
    this.addButton = page.locator("(//span[@class='text-caption'])[3]");
    //Beneficiary Input Fields
    this.editButton = page.locator('button').filter({ hasText: 'Edit Content' });
    this.beneficiaryName = page.getByLabel('Beneficiary Name *');
    this.beneficiaryType = page.locator('#gs3__combobox').getByLabel('Select', { exact: true });
    this.beneficiaryRelationship = page.locator("(//div[@class='gs__actions'])[3]")
    this.bindingLapsing = page.getByText('Binding Lapsing');
    this.beneficiaryStartDate = page.locator('input[name="effectiveDate"]');
    this.beneficiaryEndDate = page.locator('input[name="endDate"]');
    this.beneficiaryShare = page.locator('//div[@class="input-number tracking-normal inline-block py-1 border-b w-full border-teal-100 hover:border-teal-300 font-bold"]');
    this.beneficiaryShare1 = page.locator("//input[@id='percent']");
    this.contactFirstName = page.getByLabel('Contact First Name');
    this.contactSurName = page.getByLabel('Contact Surname');
    this.phoneInputField = page.getByLabel('Phone');
    this.emailInputField = page.getByLabel('Email');
    this.genderDropDown = page.locator("(//div[@class='gs__selected-options']//input)[3]");
    this.saveButton = page.getByRole('button', { name: 'SAVE' });
    this.nonBinding = page.getByRole('option', { name: 'Non-Binding' });
    this.childDropDown = page.getByRole('option', { name: 'Child' });
    this.viewCase = page.getByRole('button', { name: 'View Cases' });
    this.linkCase = page.getByRole('button', { name: 'Link to Case' });
    this.createCase = page.getByRole('button', { name: 'Create Case' });
  }

  async addNewNonBindingNominationOnExistingAccount() {
    await this.sleep(3000);
    //await this.accumulationFirstMember.click();
    await this.relationshipBtn.click({ timeout: 5000 });
    await this.addButton.click({ timeout: 5000 });
  }

  async selectMemberRelationshipTab() {
    await this.relationshipBtn.click();
    await this.addButton.click();
  }

  async modifyMemberBeneficiary() {
    await this.relationshipBtn.click();
    await this.editButton.click();
    await this.viewCase.click();
    await this.createCase.click();
    await this.beneficiaryName.fill(member.beneficiary);
    await this.beneficiaryType.click();
    await this.nonBinding.click();
    await this.beneficiaryRelationship.click();
    await this.childDropDown.click();
    await this.beneficiaryShare.click();
    await this.beneficiaryShare1.fill(member.share);
    await this.contactFirstName.fill(member.FirstName);
    await this.contactSurName.fill(member.SurName);
    await this.phoneInputField.fill(member.phone);
    await this.emailInputField.fill(member.email);
    await this.linkCase.click();
    await this.reviewCase.reviewCaseProcess(this.beneficiaryUpdateSuccess);
    await this.emailInputField.scrollIntoViewIfNeeded();
  }

  async bindinglapsingInputFileds() {
    await this.sleep(3000);
    await this.relationshipBtn.click();
    await this.editButton.click();
    await this.viewCase.waitFor();
    await this.viewCase.click({ timeout: 15000 });
    await this.createCase.click({ timeout: 15000 });
    await this.beneficiaryName.fill(member.beneficiary);
    await this.beneficiaryType.click();
    await this.bindingLapsing.click();
    await this.beneficiaryRelationship.click();
    await this.childDropDown.click();
    await this.beneficiaryStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.beneficiaryEndDate.fill(`${DateUtils.ddmmyyyStringDate(365)}`);
    await this.beneficiaryShare.click({ timeout: 5000 });
    await this.beneficiaryShare1.fill(member.share);
    await this.contactFirstName.fill(member.FirstName);
    await this.contactSurName.fill(member.SurName);
    await this.phoneInputField.fill(member.phone);
    await this.emailInputField.fill(member.email);
    await this.saveButton.click();
    await this.linkCase.click();
    await this.reviewCase.reviewCaseProcess(this.beneficiaryUpdateSuccess);
  }

  async beneficiaryInputIsNotEqualToHundredPercent() {
    await this.sleep(3000);
    await this.relationshipBtn.click();
    await this.editButton.click();
    await this.viewCase.waitFor();
    await this.viewCase.click({ timeout: 15000 });
    await this.createCase.click({ timeout: 15000 });
    await this.beneficiaryName.fill(member.beneficiary);
    await this.beneficiaryType.click();
    await this.bindingLapsing.click();
    await this.beneficiaryRelationship.click();
    await this.childDropDown.click();
    await this.beneficiaryStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.beneficiaryEndDate.fill(`${DateUtils.ddmmyyyStringDate(365)}`);
    await this.beneficiaryShare.click({ timeout: 15000 });
    await this.beneficiaryShare1.fill(member.share1);
    await this.contactFirstName.fill(member.FirstName);
    await this.contactSurName.fill(member.SurName);
    await this.phoneInputField.fill(member.phone);
    await this.emailInputField.fill(member.email);
    await this.saveButton.click();
    await this.linkCase.click();
    await expect(this.beneficiaryUpdateError).toBeVisible();
  }

  async revisionaryBeneficiary() {
    await this.sleep(3000);
    await this.selectMemberRelationshipTab();
    await this.page.locator("(//label[@class='heading-sm']/following::span[@class='text-caption'])[1]").click();
    await this.beneficiaryName.fill(member.beneficiary);
    await this.beneficiaryRelationship.click();
    await this.sleep(3000)
    await this.page.getByRole('option', { name: 'Spouse' }).click();
    await this.contactFirstName.fill(member.FirstName);
    await this.contactSurName.fill(member.SurName);
    await this.phoneInputField.fill(member.phone);
    await this.emailInputField.fill(member.email);
    let memberDOB = await this.page.locator("(//input[@placeholder='dd/mm/yyyy'])[1]");
    memberDOB.click({ timeout: 5000 });
    memberDOB.fill(member.dob);
    memberDOB.press('Tab');
    await this.sleep(2000);
    await this.genderDropDown.click();
    await this.page.waitForTimeout(3000);
    await this.page.locator("(//div[@class='gs__selected-options']//input)[3]").click();
    let saveButton = await this.page.locator("(//span[text()=' SAVE '])[1]");
    saveButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(3000).then(() => { return saveButton.click() });
    await this.viewCase.click({ timeout: 5000 });
    await this.linkCase.click();
    await this.reviewCase.reviewCaseProcess(this.beneficiaryUpdateSuccess);







  }

} 
