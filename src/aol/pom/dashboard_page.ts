import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/case_data.json";
import { DateUtils } from "../../utils/date_utils";

export class DashboardPage extends BasePage {

  readonly addCaseLink: Locator;
  readonly addCase: AddCase;
  readonly selectProduct: Locator;
  readonly selectHFM: Locator;
  readonly accumulationProduct: Locator;
  readonly accumulationMembersLink: Locator;
  readonly accumulationAddMember: Locator;
  readonly casemanagement: Locator;
  readonly Member_text: Locator;
  readonly activity_text: Locator;
  //casemanagemnet screen
  private readonly openCases_link: Locator;
  private readonly closedCases_link: Locator;
  private readonly onHoldCases_check: Locator;
  private readonly go_button: Locator;
  private readonly filter_option: Locator;

  //Items
  private readonly memberAccountNumber: Locator;
  private readonly apply: Locator;
  private readonly textBox: Locator;
  private readonly items: Locator;
  private readonly assignedTo: Locator;
  private readonly close_left: Locator;
  //private readonly filter_dropdown: Locator;
  //private readonly select_member: Locator;
  private readonly unassigned: Locator;
  private readonly assigned_Other: Locator;
  //private readonly alert:Locator;
  private readonly select_process: Locator;
  private readonly member_entity: Locator;
  private readonly select_ascending:Locator;
  readonly case_management: Locator;
  private readonly case_text: Locator;
  readonly closed_cases: Locator;
  readonly filter: Locator;
  readonly go_option: Locator;
  readonly memberAccNumber: Locator;
  private readonly text_Box:Locator;
  private readonly date_picker:Locator;
  readonly memberText: Locator;
  readonly effectiveDate: Locator;
  private readonly createdDate:Locator;

  constructor(page: Page) {
    super(page)

    this.addCaseLink = page.getByRole('button', { name: 'add-circle icon Add New Case' });
    this.addCase = new AddCase(page);
    this.selectProduct = page.locator("(//div[@class='eBloA'])[1]");
    this.selectHFM = page.getByText('HESTA for Mercy');
    this.accumulationProduct = page.getByRole('link', { name: 'Accumulation' });
    this.accumulationMembersLink = page.getByRole('link', { name: 'Members' });
    this.accumulationAddMember = page.getByRole('button', { name: 'add-circle icon Add Member' });

    //Case Mgmt
    this.casemanagement = page.getByRole('heading', { name: 'Case Management' });
    this.openCases_link = page.getByText('Open Cases', { exact: true });
    this.closedCases_link = page.getByText('Closed Cases', { exact: true });
    this.onHoldCases_check = page.getByText('Include on hold cases', { exact: true }).nth(1);
    this.go_button = page.getByText('Go', { exact: true });
    this.filter_option = page.getByText('FILTER', { exact: true });
    this.memberAccountNumber = page.locator('//div[text()="Member Account Number"]');
    this.apply = page.getByRole('button', { name: 'APPLY' });
    this.textBox = page.locator('//label[text()="Include on hold cases "]/following::input');
    this.items = page.locator('//div[contains(@class, "filter-list-item")]');
    this.Member_text = page.locator('span');
    
    this.assignedTo = page.getByPlaceholder('Select');
    this.assigned_Other = page.locator('//input[@class="el-input__inner"]/following::span[text()="01_NO_WRITE_PERMISSION USER"]');
    //this.select_member = page.getByRole('textbox', { name: 'Select' });
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.activity_text = page.locator('(//div[contains(@class,"leading-snug break-words")]//p)[1]');
    ;
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    //this.unassigned = page.locator('#el-popper-289 li').filter({ hasText: /^Admin User$/ });
    //const alertSelector = 'xpath=//span[@class="filter-tag"]//span[1]';
    this.case_management = page.getByRole('heading', { name: 'Case Management' });
    this.closed_cases = page.getByRole('link', { name: 'Closed Cases' });
    this.filter = page.getByRole('button', { name: 'FILTER' });
    this.go_option = page.getByRole('button', { name: 'Go' });
    this.memberAccNumber = page.getByText('Member Account Number');
    this.apply = page.getByRole('button', { name: 'APPLY' });
    this.items = page.locator('//div[contains(@class,"filter-list-item")]');
    this.memberText = page.locator('span');
    
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.unassigned = page.locator('(//input[@class="el-input__inner"]/following::span[text()="Admin User"])[2]');
    //const alertSelector = 'xpath=//span[@class="filter-tag"]//span[1]';
    this.case_management = page.getByRole('heading', { name: 'Case Management' });
    this.closed_cases = page.getByRole('link', { name: 'Closed Cases' });
    this.filter = page.getByRole('button', { name: 'FILTER' });
    this.go_option = page.getByRole('button', { name: 'Go' });
    this.memberAccNumber = page.getByText('Member Account Number');

    this.text_Box = page.getByRole('textbox', { name: 'Select' });
    this.items = page.locator('//div[contains(@class,"filter-list-item")]');
    this.memberText = page.locator('span');
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.select_process = page.locator('//li[@class="el-select-dropdown__item option_select_equals_1_0"]//span[text()="Processing"]');
    this.member_entity = page.locator('div').filter({ hasText: /^10 Day Follow-up$/ }).locator('div');
    this.case_text = page.getByRole('heading', { name: 'Case Type' });
    this.select_ascending =page.locator('//input[@class="el-select__input is-mini"]');    
    this.date_picker = page.getByText('Effective Date', { exact: true });
    this.effectiveDate = page.getByTitle('Equals').getByPlaceholder('dd/mm/yyyy');
    this.createdDate = page.locator('//div[text()=" Date Created "]/following-sibling::div')
    
  }

  async addNewCase() {
    await this.addCaseLink.click();
    await this.addCase.submitCase();
  }

  async navigateToAccumulationAddMember() {
    await this.selectProduct.click();
    await this.selectHFM.click();
    await this.accumulationProduct.isVisible();
    await this.accumulationProduct.click();
    await this.accumulationMembersLink.click();
    await this.accumulationAddMember.click();
  }

  async navigateToMembers() {
    await this.selectProduct.click();
    await this.selectHFM.click();
    await this.accumulationProduct.isVisible();
    await this.accumulationProduct.click();
    await this.accumulationMembersLink.click();
  }

  async maximizeWindow() {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async waitForTimeout(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds); // Wait for the specified duration in milliseconds
  }
  async verifyCaseManagementTabs() {
    await expect(this.openCases_link).toBeVisible();
    await expect(this.closedCases_link).toBeVisible();
    await expect(this.onHoldCases_check).toBeVisible();
    await expect(this.go_button).toBeVisible();
    await expect(this.filter_option).toBeVisible();
  }
  async clickFilter() {
    await this.filter_option.click({ timeout: 50000 });
  }
  async getListItems() {
    let items: string[] = [];

    let els = await this.items.all();
    for (const e of els) {
      const text = await e.textContent();
      items.push(text || "");
      console.log("Element Text:", text);
    }
    return items
  }
  async verifyMemberAccountNumber() {
    await this.memberAccountNumber.click({ timeout: 50000 });
    await this.textBox.fill(caseManagement.accountNumber);

  }
  async apply_button() {
    await this.apply.click({ force: true });
  }

  async go_Button() {
    await this.go_button.click();
  }

  async verify_Member_TobeAssigned() {
    await this.unassigned.click({ timeout: 50000 });
  }
  async addCaseToAssignee() {
    await this.assignedTo.click();
    //await this.filter_dropdown.click({ timeout: 50000 })
    await this.assigned_Other.click({ timeout: 50000 })
  }
  async clickOnTableRow(rowNumber: number) {
    const tableRows = await this.page.$$('table tbody tr');
    if (rowNumber >= 0 && rowNumber < tableRows.length) {
      await tableRows[rowNumber].click();
    } else {
      throw new Error('Invalid row number or row does not exist.');
    }
  }
  async clickOnClosedIcon() {
    await this.close_left.click();
  }
  
  async takeScreenshot(path: string): Promise<void> {
    try {
      await this.page.screenshot({ path, fullPage: true });
      console.log('Screenshot taken successfully.');
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }

  async verifyCaseManagementButtons() {
    await this.closed_cases.isVisible();
    await this.closed_cases.click();
    await this.filter.isVisible();
    await this.go_option.isVisible();
  }

  async clickOnFilter() {
    await this.filter.click();
  }

  async getListOfItems() {
    let items: string[] = [];
    let els = await this.items.all();
    for (const e of els) {
      const text = await e.textContent();
      items.push(text || "");
      console.log("Element Text:", text);
    }
    console.log("Generated items:", items);
    return items
  }
  async activity_notes(): Promise<string> {
    const xpathExpression = '//div[contains(@class,"leading-snug break-words")]//p[1]';

    try {
      await this.page.waitForSelector(xpathExpression);
      const activityElement = await this.page.$(xpathExpression);

      if (activityElement) {
        const activityText = await activityElement.textContent();
        return activityText || '';
      } else {
        throw new Error('Activity element not found.');
      }
    } catch (error) {
      throw new Error(`Error while retrieving activity notes: ${error}`);
    }
  }
  async alert_displayed(): Promise<string | null> {
    const alertSelector = 'xpath=//span[@class="filter-tag"]//span';
    const alertTextArray: string[] = [];

    const alertElements = await this.page.$$(alertSelector);

    for (const alertElement of alertElements) {
      const alertText = await alertElement.evaluate(el => el.textContent);
      if (alertText) {
        console.log(`Alert message: ${alertText}`);
        alertTextArray.push(alertText);
      }
    }

    if (alertTextArray.length > 0) {
      return alertTextArray.join(', ');
    } else {
      console.log('Alert elements not found or no text content.');
      return null;
    }
  }
  async verifyDataInTable(expectedData: string): Promise<boolean> {
    const tableRows = await this.page.$$('table tbody tr');

    for (const row of tableRows) {
      const rowData = await row.textContent();
      if (rowData && rowData.includes(expectedData)) {
        console.log(`Expected data "${expectedData}" found in the table.`);
        return true;
      }
    }

    console.log(`Expected data "${expectedData}" not found in the table.`);
    return false;
  }
  async highlightTextInTableCells(expectedText: string) {
    const rows = await this.page.$$('table.el-table__body tr');
    let rowCount = 0;

    for (const row of rows) {
      const cells = await row.$$('div.cell');

      for (const cell of cells) {
        const cellText = await cell.textContent();
        if (cellText && cellText.includes(expectedText)) {
          rowCount++;
          await cell.evaluate((node: HTMLElement) => {
            // Highlight the text by changing its background color
            node.style.backgroundColor = 'yellow'; // You can choose any color
            node.style.color = 'bold'; // You can choose any color
            // Add any other styles as needed
          });
          console.log(`Text "${expectedText}" highlighted in a table cell.`);
          break; // Move to the next row once the text is found in the current row
        }
      }
    }
    console.log(`"${expectedText}" found in ${rowCount} rows.`);
  }

  async clickOnOutcomeItem(expectedText: string) {
    const items = await this.getListOfItems();

    // Find the index of the item that contains the expected text
    const outcomeIndex = items.findIndex(text => text.includes(expectedText));

    if (outcomeIndex !== null) {
      const elements = await this.items.all(); // Assuming this.items represents your list elements
      await elements[outcomeIndex].click();
      console.log(`Clicked on the item with "${expectedText}" text.`);
    } else {
      console.log(`No item with "${expectedText}" text found in the list.`);
    }
  }
  async click_outcome() {
    await this.select_process.click();

  }
  async validateAlert(expectedText: string, actualText: string | null) {
    if (actualText !== null) {
      expect(actualText).toContain(expectedText);
    } else {
      console.error('No alert was displayed.');
    }
  }
  async verifyData(expectedData: string, page: DashboardPage) {
    const isDataPresent = await page.verifyDataInTable(expectedData);
  
    if (isDataPresent) {
      console.log('Data verification passed!');
      await page.highlightTextInTableCells(expectedData);
      await page.waitForTimeout(2000);
    } else {
      console.log('Data verification failed!');
    }
  }
  async click_caseType() {
    await this.select_ascending.click();
    await this.member_entity.click();

  }
  async select_outcome() {
    await this.case_text.click({ timeout: 5000 });
  }
async box_select(){
  await this.text_Box.click({timeout:5000});

}
async select_status({ dashboardPage }: { dashboardPage: DashboardPage }){
  const selected = caseManagement.status_selected;
  for (const status of selected) {
    await this.clickOnFilter();
    await this.clickOnOutcomeItem(caseManagement.status);
    await this.box_select();
    await this.page.locator('li').filter({ hasText: status }).click();
    await this.apply_button();
    await this.go_Button();
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(status, actualAlertText);
    const expectedData = caseManagement.status_selected;
    for (const expecteddata of expectedData) {
      await this.verifyData(expecteddata, dashboardPage);
    }
  }
}
async getCreatedDate(): Promise<string> {
  const createdDateText = await this.createdDate.textContent();
  if (createdDateText) {
    return createdDateText.trim();
  } else {
    throw new Error('Created date element not found');
  }
}
async effectivedate(){
  await this.date_picker.click();
  await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
}
async getTableLastColumnXPath(): Promise<string> {
  return `//td[contains(@class, 'el-table_1_column')][last()]/div`;
}
async getLastColumnData(): Promise<string[]> {
  const dynamicXPath = await this.getTableLastColumnXPath();
  
  // Get all elements matching the last column XPath
  const lastColumnElements = await this.page.$$(dynamicXPath);
  const lastColumnTexts: string[] = [];

  for (const element of lastColumnElements) {
    const lastColumnText = await element.textContent();

    // Add text content to the array and perform assertions if needed
    if (lastColumnText !== null) {
      const expectedPattern = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
      expect(lastColumnText).toMatch(expectedPattern);
      lastColumnTexts.push(lastColumnText);
    } else {
      throw new Error('Text content not found in one of the last column elements');
    }
  }

  return lastColumnTexts;
}

}