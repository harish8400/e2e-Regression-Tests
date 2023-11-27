import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";
import * as caseManagement from "../data/case_data.json";

export class DashboardPage extends BasePage {
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
  private readonly filter_dropdown: Locator;
  private readonly select_member: Locator;
  private readonly Member_ToAsigned: Locator;
  private readonly unassigned: Locator;
  //private readonly alert:Locator;
  readonly case_management: Locator;
  readonly closed_cases: Locator;
  readonly filter: Locator;
  readonly go_option: Locator;
  readonly memberAccNumber: Locator;
  readonly apply: Locator;
  readonly text_Box: Locator;
  readonly items: Locator;
  readonly caseGroupId: Locator;
  readonly memberText: Locator;
  readonly filter_dropdown: Locator;
  readonly close_left: Locator;

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
    //this.assigned_Other =page.locator('//input[@class="el-input__inner"]/following::span[text()="01_NO_WRITE_PERMISSION USER"]');
    this.select_member = page.getByRole('textbox', { name: 'Select' });
    this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.activity_text = page.getByText('Case Assigned to \'Admin User\'.').first();
    this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
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
    this.filter_dropdown = page.locator('li').filter({ hasText: /^Admin User$/ });
    this.close_left = page.getByRole('button', { name: 'arrow-left icon clipboard-tick icon' });
  
    }

    async addNewCase(){
        await this.addCaseLink.click();  
        await this.addCase.submitCase();     
    }
}