import { Locator, Page } from "@playwright/test";
import { MolBasePage } from "./mol_base_page";


export abstract class MolDashboardBasePage extends MolBasePage {
    protected abstract readonly url: string;

    private readonly balancedHeading: Locator;

    constructor(page: Page) {
        super(page);

        this.balancedHeading = page.getByRole('heading', { name: 'Estimated balance as at' });
    }

    async goTo() {
        await this.page.goto(this.url);
        await this.waitForBalanceHeading();
    }

    async waitForBalanceHeading() {
        await this.balancedHeading.waitFor({ state: "visible" });
    }

}
