import { Page } from "@playwright/test";

export abstract class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async reload() {
        await this.page.reload();
    }

    async sleep(miliseconds: number) {
        await this.page.waitForTimeout(miliseconds);
    }

}