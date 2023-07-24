import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../../common/pom/base_page";


export class Navbar extends BasePage {
    private readonly dashboard: Locator;
    private readonly investments: Locator;
    private readonly transactions: Locator;
    private readonly insurance: Locator;
    private readonly payments: Locator;
    private readonly more: Locator;
    private readonly profile: Locator;

    //More submenu
    private readonly moreMenu: Locator;
    private readonly moreCombine: Locator;
    private readonly moreBeneficiaries: Locator;
    private readonly moreDocuments: Locator;

    constructor(page: Page) {
        super(page);

        this.dashboard = this.page.getByRole('button', { name: 'Dashboard' });
        this.investments = page.getByRole('button', { name: 'Investments' });
        this.transactions = page.getByRole('button', { name: 'Transactions' });
        this.insurance = page.getByRole('button', { name: 'Insurance' });
        this.payments = page.getByRole('button', { name: 'Payments' });
        this.more = page.getByRole('button', { name: 'More', exact: true });
        this.profile = this.page.locator('button', { hasText: new RegExp(/^[A-Z]{2}$/) });

        this.moreMenu = page.locator("xpath=//div[@data-cy-name='dropdown']");
        this.moreCombine = this.moreMenu.getByText('Combine');
        this.moreBeneficiaries = this.moreMenu.getByText('Beneficiaries');
        this.moreDocuments = this.moreMenu.getByText('Documents');
    }

    async clickDashboard() {
        await this.dashboard.click();
    }

    async clickInvestments() {
        await this.investments.click();
    }

    async clickTransactions() {
        await this.transactions.click();
    }

    async clickInsurance() {
        await this.insurance.click();
    }

    async clickPayments() {
        await this.payments.click();
    }

    async clickMoreAndCombine() {
        await this.clickMore();
        await this.moreCombine.click();
    }

    async clickMoreAndBeneficiaries() {
        await this.clickMore();
        await this.moreBeneficiaries.click();
    }

    async clickMoreAndDocuments() {
        await this.clickMore();
        await this.moreDocuments.click();
    }

    async clickProfile() {
        await this.profile.click();
    }

    private async clickMore() {
        await this.more.click();
    }

}