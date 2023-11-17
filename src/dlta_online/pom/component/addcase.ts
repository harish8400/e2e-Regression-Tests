import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";

export class AddCase extends BasePage { 

    private readonly ProductDropDown: Locator;
    private readonly selectProduct: Locator;
    private readonly CaseTypeDropDown: Locator;
    private readonly SelectCaseType: Locator;
    private readonly createCase: Locator;
    private readonly createCaseSuccess: Locator;

    constructor(page: Page) {
        super(page);

        this.ProductDropDown = page.getByPlaceholder('Search Product');
        this.selectProduct = page.locator('li').filter({ hasText: 'Accumulation' })
        this.SelectCaseType = page.locator('li').filter({ hasText: '10 Day Follow-up' });
        this.CaseTypeDropDown = page.getByPlaceholder('Search Case Type')
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.createCaseSuccess = page.getByRole('heading', { name: '10 Day Follow-up' });
    }

    async submitCase() {
        await this.ProductDropDown.click();
        await this.selectProduct.click();
        await this.CaseTypeDropDown.click();
        await this.SelectCaseType.click();
        await this.createCase.click();
        await expect(this.createCaseSuccess).toHaveText('10 Day Follow-up');
    }
}