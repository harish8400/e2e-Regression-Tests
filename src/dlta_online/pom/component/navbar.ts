import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";

export class Navbar extends BasePage {

    private readonly dashboardLink: Locator;
    private readonly clientsLink: Locator;
    private readonly reportsLink: Locator;
    private readonly profile: Locator;
    private readonly profileLogutButton: Locator;

    constructor(page: Page) {
        super(page);

        this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
        this.clientsLink = page.getByRole('link', { name: 'Clients' });
        this.reportsLink = page.getByRole('link', { name: 'Reports' });
        this.profile = page.locator('.va-navbar__item .va-avatar');
        this.profileLogutButton = page.getByRole('button', { name: 'Log out' })
    }

    async clickDashBoard() {
        await this.dashboardLink.click();
    }

    async clickClients() {
        await this.clientsLink.click();
    }

    async clickReports() {
        await this.reportsLink.click();
    }


    async clickProfile() {
        await this.profile.click();
    }

    async doLogout() {
        await this.clickProfile();
        await this.profileLogutButton.click();
    }

}