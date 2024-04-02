import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import * as member from "../../data/member.json"
import { ReviewCase } from "../component/review_case";
import { DateUtils } from "../../../utils/date_utils";
import { allure } from "allure-playwright";
import { GlobalPage } from "../component/global_page";

export class AccountInfoPage extends BasePage {

    readonly reviewCase: ReviewCase;

    //Bank Account Details Add/Edit step
    readonly accountInfo: Locator;
    readonly editAccountIcon: Locator;
    readonly addNewButton: Locator;
    readonly bsbNumberField: Locator;
    readonly accountNameField: Locator;
    readonly accountNUmberField: Locator;
    readonly purposeDropdown: Locator;
    readonly purposeOption: Locator;

    //Edit CRN
    readonly editCRN: Locator;
    readonly CRN_Field: Locator;
    readonly eligibleServiceDate: Locator;
    readonly verifyCRN: Locator;
    readonly CRN_SuccessMessage: Locator;

    //approval process step
    readonly viewCasesButton: Locator;
    readonly createCaseButton: Locator;
    readonly buttonLinkToCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly processException: Locator;
    readonly EditBankAcc_successMessage: Locator;
    readonly NewBankAcc_successMessage: Locator;

    readonly processesLink: Locator;
    readonly memberaccount: Locator;
    readonly review: Locator;
    readonly shellaccount:Locator;
    readonly inReview:Locator;
    readonly globalPage: GlobalPage;

    constructor(page: Page) {
        super(page)
        this.reviewCase = new ReviewCase(page);
        this.globalPage = new GlobalPage(page);

        // Bank Account Details Add/Edit step
        this.accountInfo = page.getByRole('button', { name: 'Account Info' });
        this.editAccountIcon = page.locator('button').filter({ hasText: 'Edit Content' }).nth(1);
        this.addNewButton = page.getByRole('button', { name: 'add-circle icon Add New' }).first();
        this.bsbNumberField = page.getByLabel('BSB Number');
        this.accountNUmberField = page.getByLabel('Account Number');
        this.accountNameField = page.getByLabel('Account Name');
        this.purposeDropdown = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.purposeOption = page.getByRole('option', { name: 'Pension Payment' });

        //Edit CRN
        this.editCRN = page.locator('button').filter({ hasText: 'Edit Content' });
        this.CRN_Field = page.getByLabel('CRN');
        this.eligibleServiceDate = page.locator('input[name="eligibleServiceDate"]');
        this.verifyCRN = page.getByText(member.CRN);
        this.CRN_SuccessMessage = page.getByText('Updated member.');

        //Approval Process step
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.EditBankAcc_successMessage = page.getByText('Processed update bank account.');
        this.NewBankAcc_successMessage = page.getByText('Create or update bank account.');
        this.viewCasesButton = page.getByRole('button', { name: 'View Cases' });
        this.createCaseButton = page.getByRole('button', { name: 'Create Case' });
        this.buttonLinkToCase = page.getByRole('button', { name: 'Link to Case' });

        //process

        this.processesLink = page.getByRole('link', { name: 'Processes' });
        this.memberaccount = page.locator('(//button[@aria-label="Member - Create"])[1]').first();
        this.review = page.locator('//span[text()="In Progress"]');
        this.shellaccount = page.locator('//div[text()="Pension Shell Account - Create"][1]').first();
        this.inReview = page.locator('//span[text()="In Review"]');

    }

    /** this function is for edit or update the existing bank account details  */
    async editBankAccount() {
        await this.accountInfo.click();
        await this.editAccountIcon.click();
        await this.bsbNumberField.click();
        await this.bsbNumberField.fill(member.BSBNumber);
        await this.accountNameField.click();
        await this.accountNameField.fill(member.AccountName);
        await this.sleep(2000);
        await this.accountNUmberField.click();
        await this.accountNUmberField.fill(member.AccountNumber);
        await this.purposeDropdown.click();
        await this.sleep(2000);
        await this.purposeOption.click();
        await this.viewCasesButton.click();
        await this.sleep(3000);
        await this.createCaseButton.click();
        await this.sleep(3000);
        await this.buttonLinkToCase.click();

        await this.reviewCase.reviewCaseProcess(this.EditBankAcc_successMessage);

        await allure.step("Validate Correspondence is sent with success", async () => {
            allure.logStep("Verify Correspondence sent success is displayed")
            expect(this.EditBankAcc_successMessage).toBeVisible();
        });

        await allure.step("Validate Bank-Update is processed without error", async () => {
            await this.globalPage.captureScreenshot("Bank-Update case");
        });
    }

    /** this function is for adding New Bank Account Details */
    async addNewBankAccount() {
        await this.accountInfo.click();
        await this.sleep(3000);
        await this.addNewButton.click();
        await this.sleep(3000);
        await this.bsbNumberField.click();
        await this.bsbNumberField.fill(member.BSBNumber);
        await this.accountNameField.click();
        await this.accountNameField.fill(member.AccountName);
        await this.sleep(5000);
        await this.accountNUmberField.fill(member.AccountNumber);
        await this.purposeDropdown.click();
        await this.sleep(5000);
        await this.purposeOption.click();
        await this.viewCasesButton.click();
        await this.sleep(5000);
        await this.createCaseButton.click();
        await this.sleep(5000);
        await this.buttonLinkToCase.click();
        await this.sleep(10000);
        await this.reviewCase.reviewCaseProcess(this.NewBankAcc_successMessage);

    }

    //CRN Update
    async updateCRN() {
        await this.accountInfo.click();
        await this.sleep(3000);
        await this.editCRN.click();
        await this.CRN_Field.fill(member.CRN);
        await this.eligibleServiceDate.fill(DateUtils.ddmmyyyStringDate(0));
        await this.viewCasesButton.click();
        await this.createCaseButton.click();
        await this.sleep(5000);
        await this.buttonLinkToCase.click();
        await this.reviewCase.reviewCaseProcess(this.CRN_SuccessMessage);
        await this.CRN_SuccessMessage.scrollIntoViewIfNeeded();
        await expect(this.verifyCRN).toBeVisible();
    }


    async ProcessTab() {
        await this.processesLink.click();
        await this.sleep(3000);
        await this.memberaccount.click();
        await this.review.click();
        await this.page.reload();
        await this.sleep(3000);
        const caseId = this.page.locator("(//div[@class='gs-column case-table-label']/following-sibling::div)[1]");
        await caseId.waitFor();
        let id = await caseId.textContent();
        return id!.trim();
    }

    async shellAccountProcess() {
        await this.processesLink.click();
        await this.sleep(3000);
        await this.shellaccount.click();
        await this.inReview.click();
        await this.page.reload();
        await this.sleep(3000);
        const caseId = this.page.locator("(//div[@class='gs-column case-table-label']/following-sibling::div)[1]");
        await caseId.waitFor();
        let id = await caseId.textContent();
        return id!.trim();
    }

}