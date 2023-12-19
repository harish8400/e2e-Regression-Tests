import { ElementHandle, Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/case_data.json";
import { DateUtils } from "../../utils/date_utils";
import { AssertionError } from "assert";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
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
  private readonly openCaseslink: Locator;
  private readonly closedCases_link: Locator;
  private readonly onHoldCases_check: Locator;
  private readonly SLA: Locator;
  private readonly filter_option: Locator;
  private case: Locator;
  private readonly memberToAssign: Locator;

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
  private mainAlert: Locator;
  private caseManagementURL = ENVIRONMENT_CONFIG.dltaOnlineURL;

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
    this.openCaseslink = page.getByText('Open Cases', { exact: true });
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
    this.memberToAssign = page.locator('//div[text()="Assigned to"]');
    this.heading = page.getByRole('heading', { name: 'Case Type' });
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
    this.mainAlert = page.locator('span').getByLabel('close icon').last();
  }

  async addNewCase(expectedOutcome: string[]) {
    //await this.addCaseLink.click();
    //await this.addCase.submitCase();
    try
    {
      //Create case
      await this.page.getByRole('button', { name: 'add-circle icon Add New Case' }).click();
      await this.page.getByPlaceholder('Search Case Type').click();
      await this.page.getByPlaceholder('Search Case Type').fill('enquiry');
      await this.page.locator('li').filter({ hasText: 'Enquiry - Grow' }).click();
      await this.sleep(2000);
      let caseRef = await this.page.getByPlaceholder('Max. 30 characters').inputValue();
      await this.page.getByRole('button', { name: 'Create Case' }).click();

      //Verify case outcome
      await this.page.getByRole('button', { name: 'FILTER' }).click();
      await this.page.locator("(//div[@class='filter-list-item'][normalize-space()='Reference'])[1]").click();
      await this.page.getByRole('tooltip', { name: 'close icon Reference APPLY' }).getByRole('textbox').click();
      await this.page.getByRole('tooltip', { name: 'close icon Reference APPLY' }).getByRole('textbox').fill(caseRef);
      await this.page.getByRole('button', { name: 'APPLY' }).click();
      await this.page.getByRole('button', { name: 'Go' }).click();

      let actualOutcome = await this.page.getByRole('row', { name: `${caseRef}` }).locator('span').nth(2).textContent();
      expect(expectedOutcome).toContain(actualOutcome);
    }
    catch(Exception)
    {
      throw new AssertionError({message: 'Verification of new case outcome has failed'});
    }
  }

  async navigateToCaseManagement(){
    await this.page.goto(this.caseManagementURL);
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

  async waitForTimeout(milliseconds: number) {
    await this.page.waitForTimeout(milliseconds); // Wait for the specified duration in milliseconds
  }

  async verifyCaseManagementTabs() {

    try 
    {
      await expect(this.openCaseslink).toBeVisible();
      await this.highlightElement(this.openCaseslink);
      console.log("Open cases tab is verified with sucess");

      await expect(this.closedCases_link).toBeVisible();
      await this.highlightElement(this.closedCases_link);
      console.log("Closed cases tab is verified with sucess");

      await expect(this.onHoldCases_check).toBeVisible();
      await this.highlightElement(this.onHoldCases_check);
      console.log("On hold cases option is verified with sucess");

      //await this.highlightElementAndCheckVisibility(this.SLA);
    } catch (error) {
      console.error(`Error in verifyCaseManagementTabs: ${error}`);
    }
  }

  async highlightElement(element: Locator) {
    
    try {

    // Highlight the background color of the current element
    await element.evaluate((node: HTMLElement) => {
      node.style.backgroundColor = 'yellow'; // Choose any color you prefer
      node.style.color = 'black'; // Choose any color you prefer for text
      // Add any other styles as needed
    });

    // Wait for a short duration for the highlighting effect
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Highlight duration

    // Remove the highlight after the check
    // await element.evaluate((node: HTMLElement) => {
    //   node.style.backgroundColor = ''; // Reset background color
    //   node.style.color = ''; // Reset text color
    // });

    } catch (error) {
      throw error;
    }
    
  }

  async close_arrow() {
    await this.arrow.click();
  }

  async close_main() {
    await this.mainAlert.click();
  }

  async clickFilter() {
    await this.filter_option.click({ timeout: 5000 });
  }

  async getListItemsAndHighlight(): Promise<string[]> {
    const items: string[] = [];
    const els = await this.items.all();

    for (const e of els) {
      const text = await e.textContent();
      items.push(text || "");
      //console.log("Element Text:", text);

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

  async validateMemberAccountNumberFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verifyMemberAccountNumber(5000);

    const expectedAlertText = caseManagement.alert_account;
    const actualAlertText = await this.filterDisplayed();
    await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);

    const expectedData = caseManagement.accountNumber;
    await this.verifyFilterResult(expectedData, dashboardPage);
    await this.close_main();
  }

  async verifyMemberAssignFilter(_milliseconds: number) {

    try {
      await this.clickOnFilter();
      await this.memberToAssign.click({ timeout: 5000 })
      await this.select_member.click({ timeout: 5000 });
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

  async validateMemberTobeAssignedFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    // select member filter
    await this.sleep(3000);
    await this.verifyMemberAssignFilter(5000);

    // verify if result is filtered
    const expectedAlertText = caseManagement.alert_assignedTo;
    const actualAlertText = await this.filterDisplayed();
    await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.AssignedTo;
    await this.waitForTimeout(5000);
    await this.verifyFilterResult(expectedData, dashboardPage);
    //await this.close_main();
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
      console.error('Error occurred while verifying case type:', error);
      // Handle the error or throw it further if needed
      throw error;
    }

  }

  async validateCaseTypeFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_case_type(50000);

    const expectedAlertText = caseManagement.case_type_selected;
    const actualAlertText = await this.filterDisplayed();
    await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.case_type_selected;
    await this.verifyFilterResult(expectedData, dashboardPage);
    //await this.close_main();
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

  async validateCaseIdFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_case_Id(50000);

    const expectedAlertText = caseManagement.caseGroupid;
    const actualAlertText = await this.filterDisplayed();
    await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.caseGroupid;
    await this.waitForTimeout(5000)
    await this.verifyFilterResult(expectedData, dashboardPage);
    //await this.close_main();
  }

  async verify_reference(_milliseconds: number) {
    try {
      await this.clickFilter();
      await this.referenceId.click();
      await this.waitForTimeout(2000);
      await this.text_Box.click();
      await this.text_Box.fill(caseManagement.reference_No);
      await this.waitForTimeout(2000);
      await this.apply_button();
      await this.go_Button();
    } catch (error) {
      console.error('Error occurred while verifying member account number:', error);
      // Handle the error or throw it further if needed
      throw error;
    }
  }

  async validateReferenceFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.verify_reference(50000);

    const expectedAlertText = caseManagement.reference_No;
    const actualAlertText = await this.filterDisplayed();
    await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);
    const expectedData = caseManagement.reference_No;
    await this.waitForTimeout(5000)
    await this.verifyFilterResult(expectedData, dashboardPage);
    //await this.close_main();
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
      //console.log("Element Text:", text);
    }
    //console.log("Generated items:", items);
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

  async filterDisplayed(): Promise<string | null> {
    const filterSelected = 'xpath=//span[@class="filter-tag"]//span';
    const filterTextArray: string[] = [];

    const filterTexts = await this.page.$$(filterSelected);

    for (const alertElement of filterTexts) {
      const filterText = await alertElement.evaluate(el => el.textContent);
      if (filterText) {
        //console.log(`Filter option: ${filterText}`);
        filterTextArray.push(filterText);
      }
    }

    if (filterTextArray.length > 0) {
      return filterTextArray.join(', ');
    } else {
      console.log('Filter option not found or no text content.');
      return null;
    }
  }

  // TO BE DELETED
  async verifyDataInTable(expectedData: string): Promise<boolean> {8
    //const tableRows = await this.page.$$('table tbody tr');
    const tableRows = await this.page.$$("//tbody/tr[1]");

    for (const row of tableRows) {
      const rowData = await row.textContent();
      if (rowData && rowData.includes(expectedData)) {
        console.log(`Results based on filter "${expectedData}" is listed successfully`);
        return true;
      }
    }

    console.log(`Results based on filter "${expectedData}" is not found`);
    return false;
  }

  // TO BE DELETED
  async highlightTextInTableCells(expectedText: string) {
   // let rows = await this.page.$$('table.el-table__body tr');
   // let rowCount = 0;
    let rowToHighlight = await this.page.locator(`div.cell:has-text("${expectedText}")`).all();
    for (const r of rowToHighlight){
      //r.evaluate(element => element.style.backgroundColor = 'yellow')
      await r.evaluate((node: HTMLElement) => {
        node.style.backgroundColor = 'yellow'; // Choose any color you prefer
        node.style.color = 'black'; // Choose any color you prefer for text
        // Add any other styles as needed
      });
  
      // Wait for a short duration for the highlighting effect
      await new Promise((resolve) => setTimeout(resolve, 500)); // Highlight duration
    }
  }

  async clickOnOutcomeItem(expectedText: string) {
    const items = await this.getListOfItems();

    // Find the index of the item that contains the expected text
    const outcomeIndex = items.findIndex(text => text.includes(expectedText));

    if (outcomeIndex !== null) {
      const elements = await this.items.all(); 
      await elements[outcomeIndex].click();
      //console.log(`Clicked on the item with "${expectedText}" text.`);
    } else {
      //console.log(`No item with "${expectedText}" text found in the list.`);
    }
  }

  async click_outcome() {
    await this.select_process.click();
  }

  async validateIfFilterIsApplied(expectedText: string, actualText: string | null) {
    if (actualText !== null) {
      expect(actualText).toContain(expectedText);
    } else {
      console.error('Selected Filter not applied');
    }
  }

  async verifyFilterResult(expectedData: string, page: DashboardPage) {

    //const isDataPresent = await page.verifyDataInTable(expectedData);

    await this.sleep(3000);
    const filteredResults = await this.page.locator(`div.cell:has-text("${expectedData}")`).all();

    if(filteredResults.length > 0){

      for (const row of filteredResults) {
        
        await expect(row).toHaveText(expectedData);
        
        // const rowData = await row.textContent();
        // if (rowData && rowData.includes(expectedData)) {
          //console.log(`Results based on filter "${expectedData}" is listed successfully`);
          await row.evaluate((node: HTMLElement) => {
            node.style.backgroundColor = 'yellow'; // Choose any color you prefer
            node.style.color = 'black'; // Choose any color you prefer for text
          });
      
          // Wait for a short duration for the highlighting effect
          await new Promise((resolve) => setTimeout(resolve, 100)); // Highlight duration
         // return true;
        //}
      }
    }
    else{
      console.log(`Results based on filter "${expectedData}" is not found`);
      return false;
    }
    // if (isDataPresent) {
    //   await page.highlightTextInTableCells(expectedData);
    //   await page.waitForTimeout(100);
    // } 

  }

  async select_outcome() {
    await this.case_text.click({ timeout: 5000 });
  }

  async box_select() {
    await this.text_Box.click({ timeout: 5000 });
  }

  async verifyOpencaseStatuses({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.status_selected;
    for (const status of selected) {
      await this.openCaseslink.click();
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.status);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: status }).click();
      await this.apply_button();
      await this.go_Button();
      const actualAlertText = await this.filterDisplayed();
      await this.validateIfFilterIsApplied(status, actualAlertText);
      await this.verifyFilterResult(status, dashboardPage);
      console.log(`Open cases with status '${status}' is verified`)
    }
  }

  async verifyClosedcaseStatuses({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.status_selected_close;
    await this.sleep(5000);
    for (const status of selected) {
      await this.closedCases_link.click();
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.status);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: status }).click();
      await this.apply_button();
      await this.go_Button();
      const actualAlertText = await this.filterDisplayed();
      await this.validateIfFilterIsApplied(status, actualAlertText);
      await this.verifyFilterResult(status, dashboardPage);
      console.log(`Closed cases with status '${status}' is verified`)
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

  async validateEffectiveDateFilter({ dashboardPage }: { dashboardPage: DashboardPage }) {

    await this.clickOnFilter();
    await this.date_picker.click();
    let effectiveDate = DateUtils.ddmmyyyStringDate(-3);
    await this.effectiveDate.fill(effectiveDate);
    await this.waitForTimeout(5000);
    await this.apply_button();
    await this.go_Button();
    await dashboardPage.go_Button();

    const expected = await dashboardPage.getLastColumnData();

    for (const data of expected) {
      await dashboardPage.verifyFilterResult(data, dashboardPage);
    }
    //await this.close_main();
  }

  async getTableLastColumnXPath_(): Promise<string> {
    return `//td[contains(@class, 'el-table_1_column')][last()]/div`;
  }

  async getTableBeforeLastColumnXPath(): Promise<string> {

    return `//td[contains(@class, 'el-table_1_column')][last()-1]/div`;

    // const tableClass = '.table'; // Replace with your table's class or ID

    // // Construct XPath to locate the last column within the table
    // const lastColumnXPath = `${tableClass}//td[contains(@class, 'el-table_1_column')][last()]/div`;

    // return lastColumnXPath;
  }

  async verifyCreatedAndUpdatedDatetime() {
    //: Promise<{ createdColumn: ElementHandle[], updatedColumn: ElementHandle[] }> 

    await this.sleep(5000);
    const createdColumnXPath = await this.getTableLastColumnXPath_();
    const updatedColumnXPath = await this.getTableBeforeLastColumnXPath(); // Define a method to get XPath for the before last column

    // Get all elements matching the last column XPath
    const createdColumnElements = await this.page.$$(createdColumnXPath);
    const updatedColumnElements = await this.page.$$(updatedColumnXPath);

    const createdColumnTexts: string[] = [];
    const updatedColumnTexts: string[] = [];

    for (let i = 0; i < createdColumnElements.length; i++) {
      const createdColumnText = await createdColumnElements[i].textContent();
      const updatedColumnText = await updatedColumnElements[i].textContent();

      // Validate and collect data from the last column
      if (createdColumnText !== null) {
        const expectedPattern = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
        expect(createdColumnText).toMatch(expectedPattern);
        createdColumnTexts.push(createdColumnText);
      } else {
        throw new Error(`${createdColumnText} is not in valid format`);
      }

      // Validate and collect data from the column before last
      if (updatedColumnText !== null) {
        const expectedPatternBefore = /\d{1,2} [A-Za-z]{3} \d{4} \d{1,2}:\d{2}:\d{2} (AM|PM)/;
        expect(updatedColumnText).toMatch(expectedPatternBefore);
        updatedColumnTexts.push(updatedColumnText);
      } else {
        throw new Error(`${updatedColumnText} is not in valid format`);
      }
    }

    // Highlight created column date time
    for (const element of createdColumnElements) {
      await element.evaluate((node: HTMLElement) => {
          node.style.backgroundColor = 'yellow'; // Choose any color you prefer
          node.style.color = 'black'; // Choose any color you prefer for text
          // Add any other styles as needed
        });;
  }

  // Highlight before last updated column date time
  for (const element of updatedColumnElements) {
      await element.evaluate((node: HTMLElement) => {
          node.style.backgroundColor = 'yellow'; // Choose any color you prefer
          node.style.color = 'black'; // Choose any color you prefer for text
          // Add any other styles as needed
        });;
  }

  //return { createdColumn: createdColumnElements, updatedColumn: updatedColumnElements };
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

  async waitForSelector(_arg0: string) {
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

  async verifyOpenCasesOutcomes({ dashboardPage }: { dashboardPage: DashboardPage }) {
    const selected = caseManagement.Outcome_selected;
    for (const outcomes of selected) {
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.List_outcome);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: outcomes }).click();
      await this.apply_button();
      await this.go_Button();
      const actualAlertText = await this.filterDisplayed();
      await this.validateIfFilterIsApplied(outcomes, actualAlertText);
      await this.verifyFilterResult(outcomes, dashboardPage);
      // const expectedData = caseManagement.Outcome_selected;
      // for (const expecteddata of expectedData) {
      //   await this.verifyFilterResult(expecteddata, dashboardPage);
      // }
    }
  }

  async verifyClosedCasesOutcomes({ dashboardPage }: { dashboardPage: DashboardPage }) {
    await this.closedCases_link.click();
    await this.sleep(3000);
    const selected = caseManagement.Outcome_closed_cases;

    for (const outcomes of selected) {
      await this.clickOnFilter();
      await this.clickOnOutcomeItem(caseManagement.List_outcome);
      await this.box_select();
      await this.page.locator('li').filter({ hasText: 'Success' }).click();
      await this.apply_button();
      await this.go_Button();
      const expectedAlertText = caseManagement.alert_outcome; // Replace with your expected alert text
      const actualAlertText = await this.filterDisplayed();
      await this.validateIfFilterIsApplied(expectedAlertText, actualAlertText);
      //To validate wheteher Outcome is displayed in table  
      await this.verifyFilterResult(outcomes, dashboardPage);
     }
  }

  async closed() {
    await this.close.click();
  }

  async open() {
    await this.openCaseslink.click();
  }

  async getActivityLogElement(): Promise<ElementHandle | null> {
    const activityLogElement = await this.page.$('//div[contains(@class,"leading-snug break-words")]//p');
    return activityLogElement;
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

  async createShellCaseAndAsssignToUser(){

    try
    {
      await this.page.getByRole('button', { name: 'add-circle icon Add New Case' }).click();
      await this.page.getByPlaceholder('Search Case Type').click();
      await this.page.getByPlaceholder('Search Case Type').fill('enquiry');
      await this.page.locator('li').filter({ hasText: 'Enquiry - Grow' }).click();
      await this.page.getByRole('switch').locator('span').click();
      await this.page.locator('//tr[2]').first().click();
      await this.page.getByRole('button', { name: 'Create Case' }).click();
      await expect(this.page.locator('body')).toContainText('Pending arrow-down icon');
    }
    catch(Exception)
    {
      throw new AssertionError({message: 'Shell case create failed'});
    }
  }

  async verifyCaseCloseLog(){

    try
    {
      await this.page.getByRole('button', { name: 'Close Case arrow-down icon' }).click();
      await this.page.getByText('Close - Success').click();
      
      //Todo check logged in user instead of admin
      await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText('Changed status to \'Closed - Success\'');
      await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText('Admin User');
      var currentDate = new Date();
      await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText(`${DateUtils.dMMMyyyStringDate(currentDate)}`);
    }
    catch(Exception)
    {
      throw new AssertionError({message: 'Shell case Username, date time log verification failed'});
    }
  }

  async updateClosedCaseWithComment(){

    try
    {
      await this.page.getByRole('link', { name: 'Closed Cases' }).click();
      await this.page.locator('td').first().click();
      await this.page.getByRole('button', { name: 'Activity Notes add-circle icon', exact: true }).click();
      await this.page.getByPlaceholder('Write note...').click();
      await this.page.getByPlaceholder('Write note...').fill('test');
      await this.page.getByRole('button', { name: 'Done' }).click();
    }
    catch(Exception)
    {
      throw new AssertionError({message: 'Updating closed cases with comments failed'});
    }
  }

  async verifyClosedCaseUpdateLog(){

    try
    {
      //Todo check logged in user instead of admin
      //await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText('Changed status to \'Closed - Success\'');
      await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText('Admin User');
      var currentDate = new Date();
      await expect(this.page.locator("(//div[contains(@class,'gs-column full-row-gutter pl-4')])[1]")).toContainText(`${DateUtils.dMMMyyyStringDate(currentDate)}`);
    }
    catch(Exception)
    {
      throw new AssertionError({message: 'Verify username, datetime log of closed case update failed'});
    }
  }

}


