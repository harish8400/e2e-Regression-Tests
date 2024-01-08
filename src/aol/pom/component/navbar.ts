import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";

export class Navbar extends BasePage {

    readonly selectRetirementProduct: Locator;
    readonly membersLink: Locator;
    readonly addMemberButton: Locator; 
    readonly productOptionDropDown: Locator;
    readonly productSelection: Locator

    constructor(page: Page) {
        super(page);

        this.selectRetirementProduct = page.locator("(//a[@class='NxLAj'])[2]");
        this.membersLink = page.getByRole('link', { name: 'Members' });
        this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });
        this.productOptionDropDown = page.locator("(//div[@class='eBloA'])[1]");
        this.productSelection = page.getByText('HESTA for Mercy');
    }

    async navigateToDashboard(){
        await this.page.goto(ENVIRONMENT_CONFIG.aolURL);
    }

    async selectProduct() {
        await this.navigateToDashboard();
        await this.productOptionDropDown.click();
        await this.page.getByText(ENVIRONMENT_CONFIG.product).click();
    }

    async navigateToPensionMemberPage() {

        await this.selectRetirementProduct.click();
        await this.membersLink.click();
        
    }

    async selectMember(member: string){
        //await this.page.reload();
        await expect(this.page.getByRole('cell', { name: member }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: member }).first().click();
    }
}