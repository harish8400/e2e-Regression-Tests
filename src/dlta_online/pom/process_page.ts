import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";

export class ProcessPage extends BasePage { 
    readonly memberCreateProcessLink: Locator;
    readonly memberLink: Locator;
    readonly approveButton: Locator;
    readonly memberDetails: Locator;

    constructor(page: Page) {
        super(page)

        this.memberCreateProcessLink = page.locator('button').filter({ hasText: 'Member - Create' }).first();
        this.memberLink = page.getByRole('cell', { name: 'In Review' }).first();
        this.approveButton = page.getByRole('button', { name: 'Approve' }).first();
        this.memberDetails = page.locator('a');
    }

    async reviewMemberCreateProcess(memberName: string){
        await this.memberCreateProcessLink.click();
        await this.memberLink.click();

        //check and approve
        await expect(this.approveButton).toBeVisible();
        //this.approveButton.click();

        await this.memberDetails.filter({ hasText: memberName }).click();
    }
}