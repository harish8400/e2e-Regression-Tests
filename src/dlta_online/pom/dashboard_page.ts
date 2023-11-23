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
    private readonly filter_dropdown: Locator;
    private readonly close_left: Locator;
    
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
        this.memberAccountNumber = page.getByText('Member Account Number',{ exact: true });
        this.apply = page.getByRole('button', { name: 'APPLY' });
        this.textBox =  page.locator('//label[text()="Include on hold cases "]/following::input');
        this.items = page.locator('//div[contains(@class,"filter-list-item")]');
        this.Member_text = page.locator('span');
		    this.caseGroupId = page.getByText('Case Group ID');
		    this.assignedTo = page.getByPlaceholder('Select');
        this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
        this.activity_text = page.getByText('Case Assigned to \'Admin User\'.').first();
        this.close_left =  page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
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
      await this.filter_option.click();
    }
    async getListItems() {
      let items: string[] = [];

      let els = await this.items.all();
      els[0].waitFor({state:"visible"});

      for (const e of els) {
        items.push(await e.textContent() || "");
      }

      return items
	}
    async verifyMemberAccountNumber() {
      await this.memberAccountNumber.click();
      await this.textBox.fill(caseManagement.accountNumber);
      await this.apply.click();
      await this.go_button.click();

	}
	async verifyAssignedTo() {
      await this.caseGroupId.click();
      await this.textBox.fill(caseManagement.caseGroupID);
      await this.apply.click();
      await this.go_button.click();
      //await this.exsistingCase.click();
      await this.assignedTo.click();
      await this.filter_dropdown.click({timeout:50000})
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

}