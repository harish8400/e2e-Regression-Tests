import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";

export class DashboardPortfolio extends BasePage {

    readonly investments: Locator;

    constructor(page: Page) {
        super(page)

        this.investments = this.page.locator(".va-card__content div.row");
    }

    async getInvestments() {
        let investments: string[] = [];

        let els = await this.investments.all();
        els[0].scrollIntoViewIfNeeded();

        for (const e of els) {
            investments.push(await e.textContent() || "");
        }

        return investments
    }

}