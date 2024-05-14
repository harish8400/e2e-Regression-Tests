import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { DateUtils } from "../../utils/date_utils";
import * as investments from "../../../data/hfm_accum_prices.json"

export class InvestmentsAndPricing extends BasePage {
    readonly investmentsLink: Locator;
    readonly pricingTab: Locator;
    readonly addInvestmentPrice_button: Locator;
    readonly investmentName_dropdown: Locator;
    readonly investmentName_option: Locator;
    readonly custodianName_dropdown: Locator;
    readonly custodianName_option: Locator;
    readonly referenceDate: Locator;
    readonly applicationPrice: Locator;
    readonly redemptionPrice: Locator;
    readonly midPrice: Locator;
    readonly saveButton: Locator;
    readonly filterButton: Locator;
    readonly filterReferenceDate: Locator;
    readonly filterReferenceDateInput: Locator;
    readonly filterApplyButton: Locator;
    readonly investmentsRow: Locator;

    readonly investmentName: Locator;
    readonly configurationTab: Locator;
    readonly investmentStructure: Locator;
    readonly investmentStructure_Option: Locator;
    readonly investmentNameField: Locator;
    readonly selectAsset_dropdown: Locator;
    readonly selectAsset_Option: Locator;
    readonly allocation: Locator;
    readonly lowerDeviation: Locator;
    readonly upperDeviation: Locator;
    readonly addButton: Locator;
    readonly save_Button: Locator;

    readonly today: Date;

    constructor(page: Page){
        super(page)

        this.today = new Date();
        this.investmentsLink = page.getByRole('link', { name: 'Investments & Pricing' });
        this.pricingTab = page.getByRole('button', { name: 'Pricing' });
        this.addInvestmentPrice_button = page.getByRole('button', { name: 'ADD INVESTMENT PRICE' });
        this.investmentName_dropdown = page.getByPlaceholder('Select').nth(1);
        this.investmentName_option = page.getByText(investments.investmentName).first();
        //getByText('Australian Shares (AUST)').first()
        this.custodianName_dropdown = page.getByPlaceholder('Select').nth(2)
        this.custodianName_option = page.getByText('trader', { exact: true });
        this.referenceDate = page.getByPlaceholder('dd/mm/yyyy');
        this.applicationPrice = page.locator("(//input[@class='el-input__inner'])[5]");
        this.redemptionPrice = page.locator("(//input[@class='el-input__inner'])[6]");
        this.midPrice = page.locator("(//input[@class='el-input__inner'])[7]")
        this.saveButton = page.getByRole('button', { name: 'SAVE' });
        this.filterButton = page.getByRole('button', { name: 'FILTER' });
        this.filterReferenceDate = page.getByText('Investment Date Reference');
        this.filterReferenceDateInput = page.getByPlaceholder('dd/mm/yyyy').first();
        this.filterApplyButton = page.getByRole('button', { name: 'APPLY' });
        this.investmentsRow = page.getByRole("row").nth(1);

        this.investmentName = page.getByText(investments.InvestmentNameToBeUpdated, { exact: true });
        this.configurationTab = page.getByRole('button', { name: 'Configuration' });
        this.investmentStructure = page.getByRole('textbox', { name: 'Select', exact: true });
        this.investmentStructure_Option = page.getByRole('listitem');
        this.investmentNameField = page.locator("(//input[@class='el-input__inner'])[3]");
        this.selectAsset_dropdown = page.getByPlaceholder('Select asset');
        this.selectAsset_Option = page.getByText(investments.InvestmentNameToBeUpdated).first();
        this.allocation = page.getByRole('spinbutton').nth(2);
        this.lowerDeviation = page.getByRole('spinbutton').nth(3);
        this.upperDeviation = page.getByRole('spinbutton').nth(4);
        this.addButton = page.getByRole('button', { name: 'Add' });
        this.save_Button = page.getByRole('button', { name: 'SAVE' });
    }

    async addInvestmentPrice(){

        await this.investmentsLink.click();
        await this.pricingTab.click();
        await this.sleep(3000);
        await this.addInvestmentPrice_button.click();
        await this.sleep(3000);
        await this.investmentName_dropdown.click();
        await this.investmentName_option.click();
        await this.custodianName_dropdown.click();
        await this.custodianName_option.click();
        await this.referenceDate.click();
        await this.referenceDate.fill(DateUtils.ddmmyyyStringDate(0));
        await this.applicationPrice.fill(investments.prices[2].applicationPrice.toString());
        await this.redemptionPrice.fill(investments.prices[2].redemptionPrice.toString());
        await this.midPrice.fill(investments.prices[2].midPrice.toString());
        await this.saveButton.click();
        await this.filterButton.click();
        await this.filterReferenceDate.click();
        await this.filterReferenceDateInput.fill(DateUtils.ddmmyyyStringDate(0));
        await this.filterApplyButton.click();
        await this.sleep(2000);
        const date = DateUtils.ddMMMyyyStringDate(this.today);
        await expect(this.investmentsRow).toContainText(investments.investmentName && date);
    }

    async editInvestment(){

        await this.investmentsLink.click();
        await this.investmentName.scrollIntoViewIfNeeded();
        await this.investmentName.click();
        await this.configurationTab.click();
        await this.sleep(3000);
        await this.investmentStructure.click();
        await this.investmentStructure_Option.click();
        await this.investmentNameField.fill(investments.NewInvestmentName);
        await this.selectAsset_dropdown.click();
        await this.selectAsset_Option.click();
        await this.allocation.fill('100');
        await this.lowerDeviation.fill('100');
        await this.upperDeviation.fill('100');
        await this.addButton.click();
        await this.sleep(3000);
        await this.save_Button.click();
        await this.sleep(5000);
        await expect(this.investmentNameField).toHaveText(investments.NewInvestmentName);
    }

    async investmentsList() {
        await this.investmentsLink.click();
        await this.pricingTab.click();
        await this.sleep(3000);
    }
}