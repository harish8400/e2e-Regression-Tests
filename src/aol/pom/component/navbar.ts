import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";

let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;

export class Navbar extends BasePage {
  readonly accumulationProduct: Locator;
  readonly accumulationMembersLink: Locator;
  readonly memberIdentities: Locator;
  readonly addEmployer: Locator;

  readonly selectRetirementProduct: Locator;
  readonly membersLink: Locator;
  readonly addMemberButton: Locator;
  readonly productOptionDropDown: Locator;
  readonly productSelection: Locator;
  readonly selectTTRProduct: Locator;
  readonly selectVGTTRProduct: Locator;

  readonly FilterClick: Locator;
  readonly FilterOption: Locator;
  readonly FilterOptionInput: Locator;
  readonly BtnApply: Locator;
  readonly FilterValue: Locator;
  readonly memberSurname: Locator;

  constructor(page: Page) {
    super(page);

    this.accumulationProduct = page.locator("(//div[@index='0']//a)[1]");
    // page.getByRole('link', { name: 'Accumulation' });
    this.accumulationMembersLink = page.getByRole('link', { name: 'Members' });

    this.memberIdentities = page.getByText('memberIdentities');
    this.addEmployer = page.getByText('Add new employer');

    this.selectRetirementProduct = page.locator("(//p[@type='label'])[3]");
    this.selectTTRProduct = page.locator("(//p[text()='Transition to Retirement'])[1]");
    this.selectVGTTRProduct = page.locator("(//p[text()='Vanguard TransitionSmart'])[1]");
    this.membersLink = page.getByRole('link', { name: 'Members' });
    this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });
    this.productOptionDropDown = page.locator("(//div[@class='bWJdlu']/following-sibling::div)[1]");
    // locator("(//div[@class='eBloA'])[1]");
    this.productSelection = page.getByText('HESTA for Mercy');

    this.FilterClick = page.getByRole('button', { name: 'FILTER' }).first();
    this.FilterOption = page.getByText('Member Number').nth(1);
    this.FilterOptionInput = page.locator('textarea');
    this.BtnApply = page.getByRole('button', { name: 'APPLY' });
    this.FilterValue = page.getByText('Name', { exact: true });
    this.memberSurname = page.locator('(//div[contains(@class,"el-input el-input--mini")]//input)[2]');
  }

  async navigateToDashboard() {
    await this.page.goto(ENVIRONMENT_CONFIG.aolURL);
  }

  async selectProduct() {
    //select product from command or environment config file
    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
    console.log(`Test running for product '${product}'`);
    process.env.PRODUCT = product;

    await this.navigateToDashboard();
    await this.productOptionDropDown.click();
    await this.page.locator("li").filter({ hasText: product }).click();
  }

  async navigateToAccumulationMembersPage() {
    await this.sleep(3000);
    await this.accumulationProduct.click();
    await this.accumulationMembersLink.click();
  }

  async navigateToEmployerIdentities() {
    await this.memberIdentities.click();
    await this.addEmployer.click();
  }

  async navigateToPensionMembersPage() {
    await this.selectRetirementProduct.click();
    await this.membersLink.click();
  }

  async selectMember(member: string) {
    await this.sleep(1500);
    await this.page.reload();

    //Filter member
    await this.FilterClick.click();
    await this.FilterOption.click();
    await this.sleep(1000);
    await this.FilterOptionInput.fill(member);
    await this.BtnApply.click();

    //Select and click on member details
    //await expect(this.page.getByRole("cell", { name: member }).first().toBeVisible());
    await this.page.getByRole("cell", { name: member }).first().click();
  }

  async selectMemberSurName(surname: string) {
    await this.page.reload();
    await this.sleep(2000);

    //Filter member
    await this.FilterClick.click();
    await this.FilterValue.click();
    await this.memberSurname.fill(surname);
    await this.BtnApply.click();

    //Select and click on member details
    await expect(
      this.page.getByRole("cell", { name: surname }).first()
    ).toBeVisible();
    await this.page.getByRole("cell", { name: surname }).first().click();
  }

  async navigateToTTRMembersPage() {
    switch (product) {
      case 'HESTA for Mercy':
        await this.selectTTRProduct.click();
        break;

      case 'Vanguard Super':
        await this.selectVGTTRProduct.click();
        break;
      default:
        throw new Error(`Unsupported product: ${product}`);
    }

    await this.membersLink.click();
  }
}
