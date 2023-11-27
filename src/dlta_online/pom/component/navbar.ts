import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";

export class Navbar extends BasePage {

    readonly processesLink: Locator;

    constructor(page: Page) {
        super(page);

        this.processesLink = page.getByRole('link', { name: 'Processes' });
    }

    async clickProcessesLink() {
        await this.processesLink.click();
    }
}