import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";

export class Navbar extends BasePage {

    readonly accumulationProduct: Locator;
    readonly accumulationMembersLink: Locator;

    readonly selectRetirementProduct: Locator;
    readonly membersLink: Locator;
    readonly addMemberButton: Locator; 
    readonly productOptionDropDown: Locator;
    readonly productSelection: Locator;

    readonly FilterClick: Locator;
    readonly FilterOption: Locator;
    readonly FilterOptionInput: Locator;
    readonly BtnApply: Locator;

    constructor(page: Page) {
        super(page);

        this.accumulationProduct = page.locator("(//a[@class='NxLAj'])[1]");
        this.accumulationMembersLink = page.getByRole('link', { name: 'Members' });

        this.selectRetirementProduct = page.locator("(//a[@class='NxLAj'])[2]");
        this.membersLink = page.getByRole('link', { name: 'Members' });
        this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });
        this.productOptionDropDown = page.locator("(//div[@class='eBloA'])[1]");
        this.productSelection = page.getByText('HESTA for Mercy');

        this.FilterClick = page.getByRole('button', { name: 'FILTER' });
        this.FilterOption = page.getByText('Member Number', { exact: true });
        this.FilterOptionInput = page.getByRole('textbox').first();
        this.BtnApply = page.getByRole('button', { name: 'APPLY' });
    }

    async navigateToDashboard(){
        await this.page.goto(ENVIRONMENT_CONFIG.aolURL);
    }

    async selectProduct() {
        await this.navigateToDashboard();
        await this.productOptionDropDown.click();
        await this.page.locator('li').filter({ hasText: ENVIRONMENT_CONFIG.product }).click();
    }

    async navigateToAccumulationMembersPage() {

        await this.accumulationProduct.click();
        await this.accumulationMembersLink.click();
      }

    async navigateToPensionMembersPage() {

        await this.selectRetirementProduct.click();
        await this.membersLink.click();
        
    }

    async selectMember(member: string){
        //await this.page.reload();
        await this.sleep(2000);

        //Filter member
        await this.FilterClick.click();
        await this.FilterOption.click();
        await this.FilterOptionInput.fill(member);
        await this.BtnApply.click();

        //Select and click on member details
        await expect(this.page.getByRole('cell', { name: member }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: member }).first().click();
    }
}