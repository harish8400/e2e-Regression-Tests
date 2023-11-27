import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { AddCase } from "./component/addcase";

export class DashboardPage extends BasePage { 

    readonly addCaseLink: Locator;
    readonly addCase: AddCase;
    readonly selectProduct: Locator;
    readonly selectHFM: Locator;
    readonly accumulationProduct: Locator;
    readonly accumulationMembersLink: Locator;
    readonly accumulationAddMember: Locator;


    constructor(page: Page) {
        super(page)

        this.addCaseLink = page.getByRole('button', { name: 'add-circle icon Add New Case' });
        this.addCase = new AddCase(page);
        this.selectProduct = page.locator("(//div[@class='eBloA'])[1]");
        this.selectHFM = page.getByText('HESTA for Mercy');
        this.accumulationProduct = page.getByRole('link', { name: 'Accumulation' });
        this.accumulationMembersLink = page.getByRole('link', { name: 'Members' });
        this.accumulationAddMember = page.getByRole('button', { name: 'add-circle icon Add Member' });
    }

    async addNewCase(){
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
}