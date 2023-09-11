import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../../common/pom/base_page";

export class SideNavbar extends BasePage {

    private readonly dashboard: Locator;
    private readonly investments: Locator;
    private readonly transactions: Locator;
    private readonly insurance: Locator;
    private readonly pension: Locator;
    private readonly beneficairies: Locator;
    private readonly documents: Locator;

    constructor(page: Page) {
        super(page);

        this.dashboard = page.getByText('DAS', { exact: true });
        this.investments = page.getByText('INV', { exact: true });
        this.transactions = page.getByText('TRA', { exact: true });
        this.insurance = page.getByText('INS', { exact: true });
        this.pension = page.getByText('PEN', { exact: true });
        this.beneficairies = page.getByText('BEN', { exact: true });
        this.documents = page.getByText('DOC', { exact: true });
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

    async clickPension() {
        await this.pension.click();
    }

    async clickBeneficiaries() {
        this.beneficairies.click();
    }

    async clickDocuments() {
        this.documents.click();
    }

}