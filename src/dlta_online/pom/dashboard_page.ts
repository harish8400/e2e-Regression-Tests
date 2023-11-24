import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";

export class DashboardPage extends BasePage { 

    readonly addCaseLink: Locator;
    readonly addCase: AddCase;
    readonly case_management: Locator;
    readonly closed_cases: Locator;
    readonly filter: Locator;
    readonly go_option: Locator;

    constructor(page: Page) {
        super(page)

        this.addCaseLink = page.getByRole('button', { name: 'add-circle icon Add New Case' });
        this.addCase = new AddCase(page);
        this.case_management= page.getByRole('heading', { name: 'Case Management' });
        this.closed_cases= page.getByRole('link', { name: 'Closed Cases' });
        this.filter= page.getByRole('button', { name: 'FILTER' });
        this.go_option= page.getByRole('button', { name: 'Go' });
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
}