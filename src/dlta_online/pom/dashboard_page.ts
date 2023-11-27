import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/closed_case_data.json";

export class DashboardPage extends BasePage { 

    readonly addCaseLink: Locator;
    readonly addCase: AddCase;
    readonly case_management: Locator;
    readonly closed_cases: Locator;
    readonly filter: Locator;
    readonly go_option: Locator;
     readonly memberAccNumber: Locator;
     readonly apply:Locator;
     readonly text_Box: Locator;
     readonly items:Locator;
	   readonly caseGroupId:Locator;
     readonly memberText:Locator;
     readonly filter_dropdown: Locator;
     readonly close_left: Locator;

    constructor(page: Page) {
        super(page)

        this.addCaseLink = page.getByRole('button', { name: 'add-circle icon Add New Case' });
        this.addCase = new AddCase(page);
        this.case_management= page.getByRole('heading', { name: 'Case Management' });
        this.closed_cases= page.getByRole('link', { name: 'Closed Cases' });
        this.filter= page.getByRole('button', { name: 'FILTER' });
        this.go_option= page.getByRole('button', { name: 'Go' });
        this.memberAccNumber = page.getByText('Member Account Number');
        this.apply = page.getByRole('button', { name: 'APPLY' });
        this.text_Box =  page.getByRole('textbox');
        this.items = page.locator('//div[contains(@class,"filter-list-item")]');
        this.memberText = page.locator('span');
        this.caseGroupId = page.getByText('Case Group ID');
        this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
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

    async verifyCaseManagementButtons(){
        await this.closed_cases.isVisible();
        await this.closed_cases.click();
        await this.filter.isVisible();
        await this.go_option.isVisible();
    }

    async clickOnFilter(){
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
  
      async verifyMemberAccNumber() {
        await this.memberAccNumber.click();
        await this.text_Box.fill(caseManagement.accountNumber);
        await this.apply.click();
        await this.go_option.click(); 
      }

      async clickOnClosedIcon(){
        await this.close_left.click();
    
      }
}