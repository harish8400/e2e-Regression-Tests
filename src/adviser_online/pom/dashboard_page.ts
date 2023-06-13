import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { DashboardPortfolio } from "./component/dashboard_portfolio";

export class DashboardPage extends AuthenticatedPage {

    readonly welcomeHeading: Locator;
    readonly yourPortfolio: DashboardPortfolio;

    constructor(page: Page) {
        super(page);

        this.welcomeHeading = page.getByRole('heading');

        this.yourPortfolio = new DashboardPortfolio(page);
    }

}