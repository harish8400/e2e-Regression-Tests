import { Locator, Page, expect,  } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";


export class InsurancePage extends BasePage {

    readonly insuranceLink: Locator;
    readonly accumulationDropDown: Locator;
    readonly insuranceText: Locator;
    readonly filterTab: Locator;
    readonly categoryText: Locator;

    constructor(page: Page) {
        super(page)

        this.insuranceLink = page.getByRole('link', { name: 'Insurance' });
        this.accumulationDropDown = page.getByRole('link', { name: 'Accumulation' });
        this.insuranceText = page.getByRole('heading', { name: 'Insurance' });
        this.filterTab = page.getByRole('button', { name: 'FILTER' });
        this.categoryText = page.getByText('Category', { exact: true });
    
    }
    async clickOnInsuranceLink(){
        await this.accumulationDropDown.click();;
        await this.insuranceLink.click();;
        await expect(this.insuranceText).toBeVisible();
      }
      
      async clickOnFilter(){
        await this.filterTab.click();
        await expect(this.categoryText).toBeVisible();
      }
}