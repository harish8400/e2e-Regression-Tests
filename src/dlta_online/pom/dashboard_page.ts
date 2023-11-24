import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/case_data.json";

export class DashboardPage extends BasePage {
    
    readonly addCaseLink: Locator;
    readonly addCase: AddCase;
    readonly casemanagement: Locator;
	  readonly Member_text :Locator;
	  readonly activity_text:Locator;
    //casemanagemnet screen
    private readonly openCases_link: Locator;
    private readonly closedCases_link: Locator;
    private readonly onHoldCases_check: Locator;
    private readonly go_button: Locator;
    private readonly filter_option: Locator;
    //Items
    private readonly memberAccountNumber: Locator;
    private readonly apply:Locator;
    private readonly textBox: Locator;
    private readonly items:Locator;
	  private readonly caseGroupId:Locator;
	  private readonly assignedTo:Locator;
    private readonly close_left: Locator;
    private readonly filter_dropdown: Locator;
    private readonly select_member:Locator;
    private readonly Member_ToAsigned:Locator;
    private readonly unassigned:Locator;
    
    constructor(page: Page) {
        super(page)
        this.addCaseLink = page.getByRole('button', { name: 'add-circle icon Add New Case' });
        this.addCase = new AddCase(page);
        this.casemanagement = page.getByRole('heading', { name: 'Case Management' });
		    this.openCases_link =  page.getByText('Open Cases', { exact: true });
        this.closedCases_link = page.getByText('Closed Cases', { exact: true });
        this.onHoldCases_check = page.getByText('Include on hold cases',{ exact: true }).nth(1);
        this.go_button = page.getByText('Go', { exact: true });
        this.filter_option = page.getByText('FILTER', { exact: true });
        this.memberAccountNumber = page.locator('//div[text()="Member Account Number"]');
        this.apply = page.getByRole('button', { name: 'APPLY' });
        this.textBox =  page.locator('//label[text()="Include on hold cases "]/following::input');
        this.items = page.locator('//div[contains(@class, "filter-list-item")]');
        this.Member_text = page.locator('span');
		    this.caseGroupId = page.getByText('Case Group ID');
		    this.assignedTo = page.getByPlaceholder('Select');
        //this.assigned_Other =page.locator('//input[@class="el-input__inner"]/following::span[text()="01_NO_WRITE_PERMISSION USER"]');
        this.select_member =page.getByRole('textbox', { name: 'Select' });
        this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.activity_text = page.getByText('Case Assigned to \'Admin User\'.').first();
        this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.close_left =  page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
        this.Member_ToAsigned = page.locator('//div[text()="Assigned to"]');
        this.unassigned = page.locator('(//input[@class="el-input__inner"]/following::span[text()="Admin User"])[2]');
    }
  
    async addNewCase(){
        await this.addCaseLink.click();  
        await this.addCase.submitCase();     
    }
  
    async maximizeWindow() {
      await this.page.setViewportSize({ width: 1920, height: 1080 });
    }
    async waitForTimeout(milliseconds: number) {
      await this.page.waitForTimeout(milliseconds); // Wait for the specified duration in milliseconds
    }

    async verifyCaseManagementTabs(){
      await this.openCases_link.isVisible();
      await this.closedCases_link.isVisible();
      await this.onHoldCases_check.isVisible();
      await this.go_button.isVisible();
      await this.filter_option.isVisible();
    }
    async clickFilter() {
      await this.filter_option.click({timeout:50000});
    }
    async getListItems() {
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
    async verifyMemberAccountNumber() {
      await this.memberAccountNumber.click({timeout:50000});
      await this.textBox.fill(caseManagement.accountNumber);

	}
    async apply_button(){
      await this.apply.click({timeout:50000});
    }
    async go_Button(){
      await this.go_button.click();
    }

	async verify_Member_TobeAssigned() {
      await this.Member_ToAsigned.click({timeout:50000})
      await this.select_member.click();
      await this.unassigned.click();
	}
	async addCaseToAssignee(){
	  await this.assignedTo.click();
    await this.filter_dropdown.click({timeout:50000})
	}
	async clickOnTableRow(rowNumber: number) {
	  const tableRows = await this.page.$$('table tbody tr');
      if (rowNumber >= 0 && rowNumber < tableRows.length) {
      await tableRows[rowNumber].click();
	  } else {
      throw new Error('Invalid row number or row does not exist.');
    }
  }
  async clickOnClosedIcon(){
    await this.close_left.click();
  }
  async basedOnCaseId(){
    await this.caseGroupId.click({timeout:50000});
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
}