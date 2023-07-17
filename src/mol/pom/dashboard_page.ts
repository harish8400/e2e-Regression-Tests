import { Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";


export class DashboardPage extends AuthenticatedPage {
    private readonly url;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molURL + "/dashboard"
    }

    async goTo() {
        await this.page.goto(this.url);
    }

}