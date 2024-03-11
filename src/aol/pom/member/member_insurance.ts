import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { ReviewCase } from "../component/review_case";
import { DateUtils } from "../../../utils/date_utils";
import { PensionTransactionPage } from "../Pension/pension_transaction_page";

export class MemberInsurance extends BasePage{
    readonly reviewCase: ReviewCase;
    readonly processException: Locator;

    //member insurance tab
    readonly insuranceTab: Locator;
    readonly addNewButton: Locator;
    readonly effectiveDate: Locator;
    readonly providerDropdown: Locator;
    readonly providerOption: Locator;
    readonly categoryDropdown: Locator;
    readonly categoryOption: Locator;
    readonly statusDropdown: Locator;
    readonly statusActive: Locator;
    readonly occupationDropdown: Locator;
    readonly occupationOption: Locator;
    readonly coverAmount: Locator;
    readonly coverAmountInput: Locator;
    readonly saveButton: Locator;
    readonly addInsuranceSuccessMessage: Locator;
    readonly expand_MemberActiveCover: Locator;
    readonly deleteCover_button: Locator;
    readonly deleteInsuranceRecord_button: Locator;
    readonly deleteInsuranceSuccessMessage: Locator;

    //Case Review
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;

    readonly transactionPage: PensionTransactionPage;

    constructor(page: Page){
        super(page)
        this.reviewCase = new ReviewCase(page);
        this.transactionPage = new PensionTransactionPage(page);
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");

        this.insuranceTab = page.getByRole('button', { name: 'Insurance' });
        this.addNewButton = page.getByRole('button', { name: 'add-circle icon Add New' });
        this.effectiveDate = page.locator('input[name="effectiveDate"]');
        this.providerDropdown = page.locator('#gs6__combobox').getByLabel('Select', { exact: true });
        this.providerOption = page.getByRole("option").first();
        this.categoryDropdown = page.locator('#gs7__combobox').getByLabel('Select', { exact: true });
        this.categoryOption = page.getByRole("option").first();
        this.statusDropdown = page.locator('#gs8__combobox').getByLabel('Select', { exact: true });
        this.statusActive = page.getByRole('option', { name: 'Active' });
        this.occupationDropdown = page.locator('#gs10__combobox').getByLabel('Select', { exact: true });
        this.occupationOption = page.getByRole("option").first();
        this.coverAmount = page.locator("//input[@id='coverAmount']/preceding-sibling::div");
        this.coverAmountInput = page.locator("//input[@id='coverAmount']");
        this.saveButton = page.getByRole('button', { name: 'SAVE' });
        this.addInsuranceSuccessMessage = page.getByText("Process step completed with note: Modified Member Insurance cover payload sent to Chandler.");
        this.expand_MemberActiveCover = page.getByRole('group').getByLabel('arrow-down icon');
        this.deleteCover_button = page.locator('button').filter({ hasText: 'Delete Item' });
        this.deleteInsuranceRecord_button = page.getByRole('button', { name: 'DELETE' });
        this.deleteInsuranceSuccessMessage = page.getByText("Process insurance policy for member.");

        //case review
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });

    }

    async addMemberInsurance(){
        await this.insuranceTab.click();
        await this.addNewButton.scrollIntoViewIfNeeded();
        await this.addNewButton.click();
        await this.effectiveDate.fill(DateUtils.ddmmyyyStringDate(0));
        await this.page.keyboard.down('Tab');
        await this.providerDropdown.click();
        await this.providerOption.click();
        await this.categoryDropdown.click();
        await this.categoryOption.click();
        await this.statusDropdown.click();
        await this.statusActive.click();
        await this.occupationDropdown.click();
        await this.occupationOption.click();
        await this.coverAmount.click();
        await this.coverAmountInput.fill('10000');
        await this.saveButton.click();
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(5000);
        await this.linkCase.click();
        await this.reviewCase.reviewCaseProcess(this.addInsuranceSuccessMessage);
    }

    async verifyInsuranceTransaction(){
        await this.transactionPage.memberTransactionTab.click();
        await this.transactionPage.transactionsHistoryFilter.click();
        await this.sleep(3000);
        await this.transactionPage.filterCategory_Type.click();
        await this.transactionPage.selectFilterType.click();
        await this.transactionPage.selectFilterType.fill('INS');
        await this.transactionPage.filterType_INS.click();
        await this.transactionPage.applyButton.click();
        await this.sleep(3000);
        await this.transactionPage.transactionType_Insurance.scrollIntoViewIfNeeded();
        await expect(this.transactionPage.transactionType_Insurance).toBeVisible();
        await this.reviewCase.captureScreenshot();
    }

    async deleteInsurance(){
        await this.insuranceTab.click();
        await this.expand_MemberActiveCover.click();
        await this.deleteCover_button.click();
        await this.deleteInsuranceRecord_button.click();
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(5000);
        await this.linkCase.click();
        await this.reviewCase.reviewCaseProcess(this.deleteInsuranceSuccessMessage);
    }

}