import { Locator, Page } from "@playwright/test";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { MolBasePage } from "./mol_base_page";


export abstract class MolDashboardBasePage extends MolBasePage {
    private readonly url;

    private readonly balancedHeading: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molHfmURL + "/dashboard"

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
