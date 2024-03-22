import { Locator, Page, expect, } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { DateUtils } from "../../utils/date_utils";
import { FUND } from "../../../constants";
import * as insurance from "../../../src/aol/data/insurance.json";


export class InsurancePage extends BasePage {

  readonly insuranceLink: Locator;
  readonly accumulationDropDown: Locator;
  readonly insuranceText: Locator;
  readonly filterTab: Locator;
  readonly categoryText: Locator;
  readonly category: Locator;
  readonly editCategoryButton: Locator;
  readonly effectiveDate: Locator;
  readonly minCoverage: Locator;
  readonly minCoverageField: Locator;
  readonly maxCoverage: Locator;
  readonly maxCoverageField: Locator;
  readonly coolingPeriod: Locator;
  readonly coolingPeriodField: Locator;
  readonly saveButton: Locator;
  readonly confirmationMessage: Locator;


  readonly categoryNameInputText: Locator;
  readonly applyButton: Locator;

  readonly providerDropDown: Locator;
  readonly hannoverRe: Locator;
  readonly hannoverReButton: Locator;
  readonly coverTypeDropDown: Locator;
  readonly deathText: Locator;
  readonly cSDefaultTpd: Locator;
  readonly downArrow: Locator;
  readonly metLife: Locator;
  readonly newCategory: Locator;
  readonly categoryNameField: Locator;
  readonly providerNameField: Locator;
  readonly saveCategoryButton: Locator;
  readonly validationError: Locator;
  readonly errorMessage: Locator;

  //add new category
  readonly addNewCategory: Locator;
  readonly categoryName: Locator;
  readonly provider: Locator;
  readonly provider_Option: Locator;
  readonly productType: Locator;
  readonly productType_Option: Locator;
  readonly categoryBasis: Locator;
  readonly categoryBasis_Option: Locator;
  readonly coverType: Locator;
  readonly coverType_Option: Locator;
  readonly gender: Locator;
  readonly minAge: Locator;
  readonly minAgeField: Locator;
  readonly maxAge: Locator;
  readonly maxAgeField: Locator;
  readonly gender_Male: Locator;
  readonly gender_Female: Locator;
  readonly gender_Intersex: Locator;
  readonly gender_NotStated: Locator;
  readonly occupation: Locator;
  readonly commencementConditions: Locator;
  readonly commencementCondition_FirstContribution: Locator;
  readonly annualReviewBasis: Locator;
  readonly annualReviewBasis_MemberBirthDate: Locator;
  readonly reinstatement_Period: Locator;
  readonly reinstatement_PeriodField: Locator;
  readonly saveCategory: Locator;
  readonly providerName: Locator;

  constructor(page: Page) {
    super(page)

    this.insuranceLink = page.getByRole('link', { name: 'Insurance' });
    this.accumulationDropDown = page.getByRole('link', { name: 'Accumulation' });
    this.insuranceText = page.getByRole('heading', { name: 'Insurance' });
    this.filterTab = page.getByRole('button', { name: 'FILTER' });
    this.categoryText = page.getByText('Category', { exact: true });
    this.category = page.getByRole('button').nth(4);
    this.editCategoryButton = page.locator('button').filter({ hasText: 'Edit Content' });
    this.effectiveDate = page.getByPlaceholder('dd/mm/yyyy');
    this.minCoverage = page.locator("//input[@id='minCoverLimit']/preceding-sibling::div");
    this.minCoverageField = page.locator("//input[@id='minCoverLimit']");
    this.coolingPeriod = page.locator("//input[@id='coolingPeriod']/parent::div");
    this.coolingPeriodField = page.locator("//input[@id='coolingPeriod']");
    this.maxCoverage = page.locator("//input[@id='maximumCoverLimit']/preceding-sibling::div")
    this.maxCoverageField = page.locator("//input[@id='maximumCoverLimit']");
    this.saveButton = page.getByRole('button', { name: 'SAVE' });
    this.confirmationMessage = page.locator("//p[contains(text(),'Insurance Category has been updated')]");

    //add new category
    this.addNewCategory = page.getByLabel('Add new category');
    this.categoryName = page.getByPlaceholder('Category Name');
    this.provider = page.locator('#gs2__combobox div').first();
    this.provider_Option = page.getByRole('option').first();
    this.productType = page.locator('#gs3__combobox div').first();
    this.productType_Option = page.getByRole('option').first();
    this.categoryBasis = page.locator('#gs3__combobox div').first();
    this.categoryBasis_Option = page.getByRole('option').first();
    this.coverType = page.locator('#gs5__combobox div').first();
    this.coverType_Option = page.getByRole('option').first();
    this.minAge = page.locator("//input[@id='minimumAge']/parent::div");
    this.minAgeField = page.locator("//input[@id='minimumAge']");
    this.maxAge = page.locator("//input[@id='maximumAge']/parent::div");
    this.maxAgeField = page.locator("//input[@id='maximumAge']");
    this.gender = page.locator("//input[@id='gender']");
    this.gender_Male = page.getByText('MaleMale');
    this.gender_Female = page.getByText('FemaleFemale');
    this.gender_Intersex = page.getByText('IntersexIntersex');
    this.gender_NotStated = page.getByText('Not StatedNot Stated');
    this.occupation = page.getByPlaceholder('Occupation', { exact: true });
    this.commencementConditions = page.getByLabel('Commencement conditions *');
    this.commencementCondition_FirstContribution = page.getByText('First contributionFirst');
    this.reinstatement_Period = page.locator("//input[@id='reinstatementPeriod']/preceding-sibling::div");
    this.reinstatement_PeriodField = page.locator("//input[@id='reinstatementPeriod']");
    this.annualReviewBasis = page.locator('#gs7__combobox div').first();
    this.annualReviewBasis_MemberBirthDate = page.getByRole('option', { name: 'Member\'s birthdate' });
    this.saveCategory = page.getByRole('button', { name: 'Save Category' });

    this.insuranceLink = page.getByRole('link', { name: 'Insurance' });
    this.accumulationDropDown = page.getByRole('link', { name: 'Accumulation' });
    this.insuranceText = page.getByRole('heading', { name: 'Insurance' });
    this.filterTab = page.getByRole('button', { name: 'FILTER' });
    this.categoryText = page.getByText('Category', { exact: true });
    this.categoryNameInputText = page.getByRole('textbox');
    this.applyButton = page.getByRole('button', { name: 'APPLY' });
    this.provider = page.locator("(//div[@class='filter-list-item'])[2]");
    this.providerDropDown = page.getByRole('tooltip', { name: 'close icon Provider Provider' }).getByRole('img');
    this.hannoverRe = page.locator('#el-popper-6446').getByText('Hannover Re');
    this.hannoverReButton = page.locator('li').filter({ hasText: /^Hannover Re$/ });
    this.coverType = page.getByText('Cover Type', { exact: true });
    this.coverTypeDropDown = page.getByRole('tooltip', { name: 'close icon Cover Type Cover' }).locator('i');
    this.deathText = page.locator('li').filter({ hasText: /^Death$/ });
    this.cSDefaultTpd = page.getByLabel('CS Default unit based TPD');
    this.downArrow = page.getByRole('button', { name: 'arrow-down icon' });
    this.metLife = page.getByRole('tooltip', { name: 'MetLife' }).getByRole('listitem');
    this.newCategory = page.getByLabel('Add new category');
    this.categoryNameField = page.getByText('Category Name *');
    this.providerNameField = page.getByText('Provider *');
    this.saveCategoryButton = page.getByRole('button', { name: 'Save Category' });
    this.validationError = page.locator('div:nth-child(3) > .input-select-container > .inline-block > .block');
    this.errorMessage = page.getByText('Maximum cover limit must be');
    this.providerName = page.locator('li').filter({ hasText: /^Zurich$/ });
  }
  
  async clickOnInsuranceLink() {
    await this.accumulationDropDown.click();;
    await this.insuranceLink.click();;
    await expect(this.insuranceText).toBeVisible();
  }

  async clickOnFilter() {
    await this.filterTab.click();
    await expect(this.categoryText).toBeVisible();
  }

  async editInsurance() {
    await this.insuranceLink.click();
    await this.sleep(3000);
    await this.category.scrollIntoViewIfNeeded();
    await this.category.click();
    await this.editCategoryButton.click();
    await this.sleep(3000);
    await this.minCoverage.click();
    await this.minCoverageField.fill('10000');
    await this.maxCoverage.click();
    await this.maxCoverageField.fill('100000');
    await this.effectiveDate.fill(DateUtils.ddmmyyyStringDate(0));
    await this.coolingPeriod.click();
    await this.coolingPeriodField.fill('30');
    await this.saveButton.click();
    await expect(this.confirmationMessage).toBeVisible();
  }

  async newInsurance() {
    await this.insuranceLink.click();
    await this.sleep(3000);
    await this.addNewCategory.scrollIntoViewIfNeeded();
    await this.addNewCategory.click();
    await this.categoryName.fill('Test Category');
    await this.provider.click();
    await this.provider_Option.click();
    await this.productType.click();
    await this.productType_Option.click();
    await this.categoryBasis.click();
    await this.categoryBasis_Option.click();
    await this.coverType.click();
    await this.coverType_Option.click();
    await this.minCoverage.click();
    await this.minCoverageField.fill('1000');
    await this.maxCoverage.click();
    await this.maxCoverageField.fill('100000');
    await this.minAge.click();
    await this.minAgeField.fill('25');
    await this.maxAge.click();
    await this.maxAgeField.fill('66')
    await this.gender.click();
    await this.gender_Male.click();
    await this.gender_Female.click();
    await this.gender_Intersex.click();
    await this.gender_NotStated.click();
    await this.coolingPeriod.click();
    await this.coolingPeriodField.fill('30');
    await this.occupation.fill('Professional');
    await this.commencementConditions.click();
    await this.commencementCondition_FirstContribution.click();
    await this.effectiveDate.fill(DateUtils.ddmmyyyStringDate(0));
    await this.reinstatement_Period.click();
    await this.reinstatement_PeriodField.fill('1');
    await this.annualReviewBasis.click();
    await this.annualReviewBasis_MemberBirthDate.click();
    await this.saveCategory.click();
  }

  async clickOnCsDefaultTPD() {
    await this.cSDefaultTpd.click();;
    await this.downArrow.click();
  }

  async verifyDefaultDeathCoverCanBeBasedOnCategory() {
    await this.categoryText.click();
    let categoryName = insurance.australianEthicalCategoryName;
    switch (process.env.PRODUCT!) {
      case FUND.VANGUARD:
        categoryName = insurance.vanguardSuperCategoryName;
        break;
      case FUND.AE:
        categoryName = insurance.australianEthicalCategoryName;
        break;
      case FUND.HESTA:
        categoryName = insurance.hestaCategoryName;
        break;
    }
    await this.categoryNameInputText.fill(categoryName);
    await this.applyButton.click();
    await expect(this.page.getByText('Category: VOL Death (Units)')).toContainText('Category: VOL Death (Units)');
  }

  async verifyDefaultDeathCoverCanBeBasedOnProvider() {
    await this.provider.click();
    await this.providerDropDown.click();
    await this.providerName.click();
    await this.sleep(3000);
    await this.applyButton.click();
    await expect(this.page.getByLabel('STD Death')).toBeVisible();

  }
  async verifyDefaultDeathCoverCanBeBasedOnCoverType() {
    await this.coverType.click();
    await this.coverTypeDropDown.click();
    await this.deathText.click();
    await this.applyButton.click();
    await expect(this.page.getByText('Cover Type: Death')).toBeVisible();
  }


  async clickOnNewCategory() {
    await this.newCategory.click();

  }

  async verifyMandtoryFiledsNewCategory() {
    await this.saveCategoryButton.click();
    expect(this.page.getByTitle('Category Name').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Provider').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Minimum age').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Maximum age').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Gender').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Cooling period').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Occupation').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Effective date').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Unit Divisor').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Multiplier').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Period Divisor').locator('span')).toBeVisible();
    await expect(this.validationError).toContainText('This field is required');
  }

  async validateErrorMessageWithoutAllMandatoryFields() {
    await this.saveCategoryButton.click();
    await expect(this.validationError).toContainText('This field is required');
    await expect(this.errorMessage).toContainText('Maximum cover limit must be greater than the minimum cover limit');

  }

  async verifyFiledsAreDisplayedOnNewCategory() {
    await this.saveCategoryButton.click();
    await expect(this.page.getByPlaceholder('Occupation', { exact: true })).toBeVisible;
    await expect(this.page.locator('#gs2__combobox div').first()).toBeVisible;
    await expect(this.page.getByPlaceholder('Category Name')).toBeVisible;
    expect(this.page.getByTitle('Category Name').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Provider').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Minimum age').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Maximum age').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Gender').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Cooling period').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Occupation').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Effective date').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Unit Divisor').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Multiplier').locator('span')).toBeVisible();
    expect(this.page.getByTitle('Period Divisor').locator('span')).toBeVisible();
    await expect(this.validationError).toContainText('This field is required');
  }


}