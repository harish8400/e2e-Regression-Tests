import { ElementHandle, Locator, Page, expect } from "@playwright/test";
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
  private readonly caseId: Locator;
  private readonly referenceId: Locator;
  //casemanagemnet screen
  private readonly openCases_link: Locator;
  private readonly closedCases_link: Locator;
  private readonly onHoldCases_check: Locator;
  private readonly SLA: Locator;
  private readonly filter_option: Locator;
  private case: Locator;
  private readonly Member_ToAsigned: Locator;

  //Items
  private readonly memberAccountNumber: Locator;
  private readonly apply: Locator;
  private readonly textBox: Locator;
  private readonly items: Locator;
  private readonly assignedTo: Locator;
  private readonly close_left: Locator;
  //private readonly select_member: Locator;
  private readonly unassigned: Locator;
  //private readonly filter_dropdown:Locator;
  private readonly assigned_Other: Locator;
  //private readonly alert:Locator;
  private readonly select_process: Locator;
  private readonly member_entity: Locator;
  private readonly heading: Locator;
  readonly case_management: Locator;
  private readonly case_text: Locator;
  readonly closed_cases: Locator;
  readonly filter: Locator;
  readonly go_option: Locator;
  readonly memberAccNumber: Locator;
  private readonly text_Box: Locator;
  private readonly date_picker: Locator;
  readonly memberText: Locator;
  readonly effectiveDate: Locator;
  private readonly createdDate: Locator;
  private readonly notesComments: Locator;
  private readonly notes: Locator;
  private readonly done: Locator;
  private readonly arrow: Locator;
  private readonly attachment: Locator;
  private readonly write_note: Locator;
  private readonly file_upload: Locator;
  private readonly add_file: Locator;
  private readonly close: Locator;
  setInputFiles: any;
  private readonly select_member: Locator;
  private main_alert: Locator;
  


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
    this.SLA = page.getByText('SLA', { exact: true }).first();
    this.filter_option = page.getByText('FILTER', { exact: true });
    this.memberAccountNumber = page.locator('//div[text()="Member Account Number"]');
    this.apply = page.getByRole('button', { name: 'APPLY' });
    this.textBox = page.locator('//label[text()="Include on hold cases "]/following::input');
    this.items = page.locator('//div[contains(@class, "filter-list-item")]');
    this.Member_text = page.locator('span');
    this.select_member = page.getByRole('textbox', { name: 'Select' });
    //this.Member_close =page.locator('span').filter({ hasText: 'Member Account Number: MER-ACC-355657close icon' }).locator('path');
    //this.date =page.getByRole('main').getByLabel('close icon');
    this.assignedTo = page.locator('//label[text()="Case Party"]/following::input[1]');
    this.assigned_Other = page.locator('//input[@class="el-input__inner"]/following::span[text()="01_NO_WRITE_PERMISSION USER"]');
    //this.select_member = page.getByRole('textbox', { name: 'Select' });
    //this.filter_dropdown = page.locator('(//input[@class="el-input__inner"]/following::span[text()="Admin User"])[2]');
    this.activity_text = page.locator('(//div[contains(@class,"leading-snug break-words")]//p)[1]');
    ;
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.case = page.getByText('Case Type', { exact: true });
    //const alertSelector = 'xpath=//span[@class="filter-tag"]//span[1]';
    this.case_management = page.getByRole('heading', { name: 'Case Management' });
    this.closed_cases = page.getByRole('link', { name: 'Closed Cases' });
    this.filter = page.getByRole('button', { name: 'FILTER' });
    this.go_option = page.getByRole('button', { name: 'Go' });
    this.memberAccNumber = page.getByText('Member Account Number');
    this.apply = page.getByRole('button', { name: 'APPLY' });
    this.items = page.locator('//div[contains(@class,"filter-list-item")]');
    this.memberText = page.locator('span');
    this.Member_ToAsigned = page.locator('//div[text()="Assigned to"]');
    this.heading = page.getByRole('heading', { name: 'Case Type' });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.unassigned = page.locator('//input[@class="el-input__inner"]/following::span[text()="Unassigned"][2]');
    //const alertSelector = 'xpath=//span[@class="filter-tag"]//span[1]';
    this.case_management = page.getByRole('heading', { name: 'Case Management' });
    this.closed_cases = page.getByRole('link', { name: 'Closed Cases' });
    this.filter = page.getByRole('button', { name: 'FILTER' });
    this.go_option = page.getByRole('button', { name: 'Go' });
    this.memberAccNumber = page.getByText('Member Account Number');

    this.text_Box = page.getByRole('textbox').first();
    this.items = page.locator('//div[contains(@class,"filter-list-item")]');
    this.memberText = page.locator('span');
    //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
    this.select_process = page.locator('//li[@class="el-select-dropdown__item option_select_equals_1_0"]//span[text()="success"]');
    this.member_entity = page.locator('div').filter({ hasText: /^10 Day Follow-up$/ }).locator('div');
    this.case_text = page.getByRole('heading', { name: 'Case Type' });

    this.date_picker = page.getByText('Effective Date', { exact: true });
    this.effectiveDate = page.getByTitle('Equals').getByPlaceholder('dd/mm/yyyy');
    this.createdDate = page.locator('//div[text()=" Date Created "]/following-sibling::div');
    this.notesComments = page.getByRole('button', { name: 'Activity Notes add-circle icon', exact: true });
    this.notes = page.getByPlaceholder('Write note...');
    this.done = page.getByRole('button', { name: 'Done' });
    this.arrow = page.locator('//div[@class="close-filter-arrow"]');
    this.attachment = page.getByRole('button', { name: 'Attachments add-circle icon', exact: true });
    this.write_note = page.getByPlaceholder('Write note...');
    this.file_upload = page.getByRole('img', { name: 'file-upload' });
    this.add_file = page.locator('.el-upload');
    this.close = page.locator('//span[text()="Status: Deleted"]/following::span[@class="flex items-center cursor-pointer"]');
    this.caseId = page.getByText('Case Group ID');
    this.referenceId = page.locator('//span[contains(@class,"flex items-center")]/following::div[@class="filter-list-item"][text()="Reference"]');
    this.main_alert = page.getByRole('main').getByLabel('close icon');
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
    try {
      await this.highlightElementAndCheckVisibility(this.openCases_link);
      await this.highlightElementAndCheckVisibility(this.closedCases_link);
      await this.highlightElementAndCheckVisibility(this.onHoldCases_check);
      await this.highlightElementAndCheckVisibility(this.SLA);
    } catch (error) {
      console.error(`Error in verifyCaseManagementTabs: ${error}`);
      // Continue with the next step
    }
  }

  async highlightElementAndCheckVisibility(element: Locator) {
    const text = await element.textContent();
    console.log('Element Text:', text);

    // Highlight the background color of the current element
    await element.evaluate((node: HTMLElement) => {
      node.style.backgroundColor = 'yellow'; // Choose any color you prefer
      node.style.color = 'black'; // Choose any color you prefer for text
      // Add any other styles as needed
    });

    // Wait for a short duration for the highlighting effect
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Highlight duration

    try {
      // Check if the element is visible
      await expect(element).toBeVisible();
    } catch (error) {
      console.error(`Error in verifyCaseManagementTabs: ${error}`);
      // Continue with the next step
    }

    // Remove the highlight after the check
    await element.evaluate((node: HTMLElement) => {
      node.style.backgroundColor = ''; // Reset background color
      node.style.color = ''; // Reset text color
      // Remove any other styles as needed
    });
  }
  async close_arrow() {
    await this.arrow.click();
  }
  async close_main() {
    await this.main_alert.click();
  }

  async clickFilter() {
    await this.filter_option.click({ timeout: 50000 });
  }
  async getListItemsAndHighlight(): Promise<string[]> {
    const items: string[] = [];
    const els = await this.items.all();

    for (const e of els) {
      const text = await e.textContent();
      items.push(text || "");
      console.log("Element Text:", text);

      // Highlight the background color of the current element
      await e.evaluate((node: HTMLElement) => {
        node.style.backgroundColor = 'yellow'; // Choose any color you prefer
        node.style.color = 'black'; // Choose any color you prefer for text
        // Add any other styles as needed
      });
      // Remove the highlight after 1 second
      await e.evaluate(async (node: HTMLElement) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        node.style.backgroundColor = ''; // Reset background color
        node.style.color = ''; // Reset text color
        // Remove any other styles as needed
      });
    }
    return items;
  }


  async verifyMemberAccountNumber(_milliseconds: number) {

    try {
      await this.memberAccountNumber.click();
      await this.textBox.fill(caseManagement.accountNumber);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }
  async validateMemberAccountNumber({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verifyMemberAccountNumber(50000);

    const expectedAlertText = caseManagement.alert_account;
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);

    const expectedData = caseManagement.accountNumber;
    await this.verifyData(expectedData, dashboardPage);
    await this.close_main();
  }



  async verify_MemberTobeAssigned(_milliseconds: number) {

    try {
      await this.clickOnFilter();
      await this.Member_ToAsigned.click({ timeout: 50000 })
      await this.select_member.click({ timeout: 50000 });
      await this.waitForTimeout(5000);
      await this.unassigned.click();
      await this.waitForTimeout(5000);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }
  async validate_MemberTobeAssigned({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_MemberTobeAssigned(50000);

    const expectedAlertText = caseManagement.alert_assignedTo;
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.AssignedTo;
    await this.waitForTimeout(5000);
    await this.verifyData(expectedData, dashboardPage);
    await this.close_main();
  }

  async verify_case_type(_milliseconds: number) {

    try {
      await this.clickFilter();
      await this.case.click();
      await this.waitForTimeout(5000);
      await this.text_Box.click();
      await this.member_entity.click();
      await this.heading.click({ timeout: 5000 })
      await this.waitForTimeout(5000);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }
  async validate_case_type({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_case_type(50000);

    const expectedAlertText = caseManagement.case_type_selected;
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.case_type_selected;
    await this.verifyData(expectedData, dashboardPage);
    await this.close_main();
  }

  async verify_case_Id(_milliseconds: number) {

    try {
      await this.clickFilter();
      await this.caseId.click();
      await this.waitForTimeout(5000);
      await this.text_Box.click();
      await this.text_Box.fill(caseManagement.caseGroupid);
      await this.waitForTimeout(5000);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }
  async validate_case_Id({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_case_Id(50000);

    const expectedAlertText = caseManagement.caseGroupid;
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.caseGroupid;
    await this.waitForTimeout(5000)
    await this.verifyData(expectedData, dashboardPage);
    await this.close_main();
  }
  async verify_reference(_milliseconds: number) {

    try {
      await this.clickFilter();
      await this.referenceId.click();
      await this.waitForTimeout(5000);
      await this.text_Box.click();
      await this.text_Box.fill(caseManagement.reference_No);
      await this.waitForTimeout(5000);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }
  async validate_reference({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_reference(50000);

    const expectedAlertText = caseManagement.reference_No;
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.reference_No;
    await this.waitForTimeout(5000)
    await this.verifyData(expectedData, dashboardPage);
    await this.close_main();
  }

  async apply_button() {
    await this.apply.click({ force: true });
  }

  async go_Button() {
    await this.go_option.click();
  }

  async verify_Member_TobeAssigned() {
    await this.unassigned.click({ timeout: 5000 });

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
    const xpathExpression = '//div[contains(@class,"leading-snug break-words")]//p';

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
          await cell.evaluate(async (node: HTMLElement) => {
            // Highlight the text by changing its background color
            node.style.backgroundColor = 'yellow'; // You can choose any color
            node.style.color = 'bold'; // You can choose any color
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Revert back to the original style
            node.style.backgroundColor = '';
            node.style.color = '';
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


  async select_outcome() {
    await this.case_text.click({ timeout: 5000 });
  }
  async box_select() {
    await this.text_Box.click({ timeout: 5000 });

  }
  async select_status({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.status_selected;
    for (const status of selected) {
      await this.openCases_link.click();
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
  async select_status_closed({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.status_selected_close;
    for (const status of selected) {
      await this.closedCases_link.click();
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.status);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: status }).click();
      await this.apply_button();
      await this.go_Button();
      const actualAlertText = await this.alert_displayed();
      await this.validateAlert(status, actualAlertText);
      const expectedData = caseManagement.status_selected_close;
      for (const expecteddata of expectedData) {
        await this.verifyData(expecteddata, dashboardPage);
      }
    }
    await this.closed();
  }
  async getCreatedDate(): Promise<string> {
    const createdDateText = await this.createdDate.textContent();
    if (createdDateText) {
      return createdDateText.trim();
    } else {
      throw new Error('Created date element not found');
    }
  }

  async validateeffectivedate({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.clickOnFilter();
    await this.date_picker.click();
    await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
    await this.waitForTimeout(5000);
    await this.apply_button();
    await this.go_Button();
    await dashboardPage.go_Button();
    const expected_date = /Effective Date: \d{2} [A-Za-z]{3} \d{4}/;
    const actual_date = await dashboardPage.alert_displayed();
    if (typeof actual_date === 'string' && actual_date !== null) {
      const isMatch = expected_date.test(actual_date);
      expect(isMatch).toBeTruthy();
    } else {
      throw new Error('Actual date is not a valid string');
    }

    const expected = await dashboardPage.getLastColumnData();

    for (const data of expected) {
      await dashboardPage.verifyData(data, dashboardPage);
    }
    await this.close_main();
  }

  async getTableLastColumnXPath_(): Promise<string> {
    return `//td[contains(@class, 'el-table_1_column')][last()]/div`;
  }
  async getTableBeforeLastColumnXPath(): Promise<string> {

    const tableClass = '.table'; // Replace with your table's class or ID

    // Construct XPath to locate the last column within the table
    const lastColumnXPath = `${tableClass}//td[contains(@class, 'el-table_1_column')][last()]/div`;

    return lastColumnXPath;
  }

  async getLastAndBeforeLastColumnData(): Promise<{ lastColumn: ElementHandle[], beforeLastColumn: ElementHandle[] }> {
    const lastColumnXPath = await this.getTableLastColumnXPath_();
    const beforeLastColumnXPath = await this.getTableBeforeLastColumnXPath(); // Define a method to get XPath for the before last column

    // Get all elements matching the last column XPath
    const lastColumnElements = await this.page.$$(lastColumnXPath);
    const beforeLastColumnElements = await this.page.$$(beforeLastColumnXPath);

    const lastColumnTexts: string[] = [];
    const beforeLastColumnTexts: string[] = [];

    for (let i = 0; i < lastColumnElements.length; i++) {
      const lastColumnText = await lastColumnElements[i].textContent();
      const beforeLastColumnText = await beforeLastColumnElements[i].textContent();

      // Validate and collect data from the last column
      if (lastColumnText !== null) {
        const expectedPattern = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
        expect(lastColumnText).toMatch(expectedPattern);
        lastColumnTexts.push(lastColumnText);
      } else {
        throw new Error('Text content not found in one of the last column elements');
      }

      // Validate and collect data from the column before last
      if (beforeLastColumnText !== null) {
        const expectedPatternBefore = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
        expect(beforeLastColumnText).toMatch(expectedPatternBefore);
        beforeLastColumnTexts.push(beforeLastColumnText);
      } else {
        throw new Error('Text content not found in one of the before last column elements');
      }
    }

    return { lastColumn: lastColumnElements, beforeLastColumn: beforeLastColumnElements };
  }

  async notes_comments() {
    await this.notesComments.click();
    await this.notes.click();
    await this.notes.fill(caseManagement.Notes);
    await this.done.click();
  }
  async attachemnts() {
    await this.attachment.click();
    await this.write_note.click();
    await this.write_note.fill(caseManagement.Attachements);
    this.waitForSelector('.el-upload__text pt-5');
    await this.file_upload.click();


  }
  waitForSelector(_arg0: string) {
    throw new Error("Method not implemented.");
  }
  async uploadCsvFile(filePath: string) {
    const fileInput = await this.add_file.elementHandle(); // Retrieve the element handle
    if (fileInput) {
      await fileInput.setInputFiles(filePath);
    } else {
      throw new Error('File input element not found');
    } // Set the input files

  }
  async done_upload() {
    await this.done.click();
  }
  async selectOutcomeItems({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.Outcome_selected;
    for (const outcomes of selected) {
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.List_outcome);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: outcomes }).click();
      await this.apply_button();
      await this.go_Button();
      const actualAlertText = await this.alert_displayed();
      await this.validateAlert(outcomes, actualAlertText);
      const expectedData = caseManagement.Outcome_selected;
      for (const expecteddata of expectedData) {
        await this.verifyData(expecteddata, dashboardPage);
      }
    }
  }
  async closedCase({ dashboardPage }: { dashboardPage: DashboardPage }) {
    await this.closedCases_link.click();
    await this.clickOnFilter();
    await this.clickOnOutcomeItem(caseManagement.List_outcome);
    await this.box_select();
    await this.page.locator('li').filter({ hasText: 'Success' }).click();
    await this.apply_button();
    await this.go_Button();
    const expectedAlertText = caseManagement.alert_outcome; // Replace with your expected alert text
    const actualAlertText = await this.alert_displayed();
    await this.validateAlert(expectedAlertText, actualAlertText);
    //To validate wheteher Outcome is displayed in table  
    const expectedData = caseManagement.case_type_selected; // Replace with the data you want to verify
    await this.verifyData(expectedData, dashboardPage);

  }
  async closed() {
    await this.close.click();
  }
  async open() {
    await this.openCases_link.click();
  }

  async getActivityLogElement(): Promise<ElementHandle | null> {
    const activityLogElement = await this.page.$('//div[contains(@class,"leading-snug break-words")]//p');
    return activityLogElement;
  }
  async isElementHighlighted(elementHandle: any) {
    const isHighlighted = await this.page.evaluate((element) => {
      const computedStyle = getComputedStyle(element);
      return computedStyle.outlineColor === 'rgb(255, 0, 0)'; // Assuming red outline for highlighting
    }, elementHandle);
  
    return isHighlighted;
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


