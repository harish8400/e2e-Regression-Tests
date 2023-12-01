import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/case_data.json";

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
    private readonly caseGroupId: Locator;
    private readonly assignedTo: Locator;
    private readonly close_left: Locator;
    //private readonly filter_dropdown: Locator;
    private readonly select_member: Locator;
    private readonly Member_ToAsigned: Locator;
    private readonly unassigned: Locator;
    private readonly assigned_Other:Locator;
    //private readonly alert:Locator;
    readonly case_management: Locator;
    readonly closed_cases: Locator;
    readonly filter: Locator;
    readonly go_option: Locator;
    readonly memberAccNumber: Locator;
    readonly text_Box: Locator;
    readonly memberText: Locator;

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
        this.caseGroupId = page.getByText('Case Group ID');
        this.assignedTo = page.getByPlaceholder('Select');
        this.assigned_Other =page.locator('//input[@class="el-input__inner"]/following::span[text()="01_NO_WRITE_PERMISSION USER"]');
        this.select_member = page.getByRole('textbox', { name: 'Select' });
        //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.activity_text = page.locator('(//div[contains(@class,"leading-snug break-words")]//p)[1]');
;
        //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
        this.Member_ToAsigned = page.locator('//div[text()="Assigned to"]');
        this.unassigned = page.locator('(//input[@class="el-input__inner"]/following::span[text()="Admin User"])[2]');
        //const alertSelector = 'xpath=//span[@class="filter-tag"]//span[1]';
        this.case_management = page.getByRole('heading', { name: 'Case Management' });
        this.closed_cases = page.getByRole('link', { name: 'Closed Cases' });
        this.filter = page.getByRole('button', { name: 'FILTER' });
        this.go_option = page.getByRole('button', { name: 'Go' });
        this.memberAccNumber = page.getByText('Member Account Number');
        this.apply = page.getByRole('button', { name: 'APPLY' });
        this.text_Box = page.getByRole('textbox');
        this.items = page.locator('//div[contains(@class,"filter-list-item")]');
        this.memberText = page.locator('span');
        this.caseGroupId = page.getByText('Case Group ID');
        //this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });

    }

    async addNewCase() {
        await this.addCaseLink.click();
        await this.addCase.submitCase();
    }

    async navigateToAccumulationAddMember(){
        await this.selectProduct.click();
        await this.selectHFM.click();
        await this.accumulationProduct.isVisible();
        await this.accumulationProduct.click();
        await this.accumulationMembersLink.click();
        await this.accumulationAddMember.click();
    }

    async navigateToMembers(){
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
        await this.apply.click({ timeout: 50000 });
      }
      async go_Button() {
        await this.go_button.click();
      }
    
      async verify_Member_TobeAssigned() {
        await this.Member_ToAsigned.click({ timeout: 50000 })
        await this.select_member.click();
        await this.unassigned.click();
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
      async basedOnCaseId() {
        await this.caseGroupId.click({ timeout: 50000 });
        await this.textBox.fill(caseManagement.caseGroupid);
        await this.caseGroupId.click();
      }
      async takeScreenshot(path: string): Promise<void> {
        try {
          await this.page.screenshot({ path, fullPage: true });
          console.log('Screenshot taken successfully.');
        } catch (error) {
          console.error('Failed to take screenshot:', error);
        }
      }
    
      async verifyMemberAccNumber() {
        await this.memberAccNumber.click();
        await this.text_Box.fill(caseManagement.accountNumber);
        await this.apply.click();
        await this.go_option.click();
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
    
    
    
}