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
    readonly selectTTRProduct: Locator;

    readonly FilterClick: Locator;
    readonly FilterOption: Locator;
    readonly FilterOptionInput: Locator;
    readonly BtnApply: Locator;
    readonly FilterValue:Locator;
    readonly memberSurname:Locator;

    constructor(page: Page) {
        super(page);

        this.accumulationProduct = page.getByRole('link', { name: 'Accumulation' });
        this.accumulationMembersLink = page.getByRole('link', { name: 'Members' });

        this.selectRetirementProduct = page.locator("(//a[@class='NxLAj'])[2]");
        //this.selectTTRProduct = page.getByRole('link', { name: 'Transition to Retirement' });
        this.selectTTRProduct = page.locator("(//a[@class='NxLAj'])[3]");
        this.membersLink = page.getByRole('link', { name: 'Members' });
        this.addMemberButton = page.getByRole('button', { name: 'add-circle icon Add Member' });
        this.productOptionDropDown = page.locator("(//div[@class='eBloA'])[1]");
        this.productSelection = page.getByText('HESTA for Mercy');

        this.FilterClick = page.getByRole('button', { name: 'FILTER' });
        this.FilterOption = page.getByText('Member Number', { exact: true });
        this.FilterOptionInput = page.locator('textarea');
        this.BtnApply = page.getByRole('button', { name: 'APPLY' });
        this.FilterValue = page.getByText('Name', { exact: true });
        this.memberSurname = page.getByRole('textbox').nth(2);
    }

    async navigateToDashboard(){
        await this.page.goto(ENVIRONMENT_CONFIG.aolURL);
    }

    async selectProduct() {
        //select product from command or environment config file
        let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
        console.log(`Test running for product '${product}'`)
        process.env.PRODUCT = product;

        await this.navigateToDashboard();
        await this.productOptionDropDown.click();
        await this.page.locator('li').filter({ hasText: product }).click();
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
        await this.sleep(3000);
        await this.page.reload();
        
        //Filter member
        await this.FilterClick.click();
        await this.FilterOption.click();
        await this.FilterOptionInput.fill(member);
        await this.BtnApply.click();

        //Select and click on member details
        await expect(this.page.getByRole('cell', { name: member }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: member }).first().click();
    }

    async selectMemberSurName(surname: string){
        //await this.page.reload();
        await this.sleep(2000);

        //Filter member
        await this.FilterClick.click();
        await this.FilterValue.click();
        await this.memberSurname.fill(surname);
        await this.BtnApply.click();

        //Select and click on member details
        await expect(this.page.getByRole('cell', { name: surname }).first()).toBeVisible();
        await this.page.getByRole('cell', { name: surname }).first().click();
    }

    async navigateToTTRMembersPage() {

        await this.selectTTRProduct.click();
        await this.membersLink.click();

    }

}