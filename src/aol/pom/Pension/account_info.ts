import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import * as member from "../../data/member.json"
import { ReviewCase } from "../component/review_case";

export class AccountInfoPage extends BasePage{

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

    //approval process step
    readonly viewCasesButton: Locator;
    readonly createCaseButton: Locator;
    readonly buttonLinkToCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly processException: Locator;
    readonly EditBankAcc_successMessage: Locator;
    readonly NewBankAcc_successMessage: Locator;

    constructor(page:Page){
        super(page)
        this.reviewCase = new ReviewCase(page);

        // Bank Account Details Add/Edit step
        this.accountInfo = page.getByRole('button', { name: 'Account Info' });
        this.editAccountIcon = page.locator('button').filter({ hasText: 'Edit Content' }).nth(1);
        this.addNewButton = page.getByRole('button', { name: 'add-circle icon Add New' }).first();
        this.bsbNumberField = page.getByLabel('BSB Number');
        this.accountNUmberField = page.getByLabel('Account Number');
        this.accountNameField = page.getByLabel('Account Name');
        this.purposeDropdown = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.purposeOption = page.getByRole('option', { name: 'Pension Payment' });

        //Approval Process step
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.EditBankAcc_successMessage = page.getByText('Processed update bank account.');
        this.NewBankAcc_successMessage = page.getByText('Create or update bank account.');
        this.viewCasesButton = page.getByRole('button', { name: 'View Cases' });
        this.createCaseButton = page.getByRole('button', { name: 'Create Case' });
        this.buttonLinkToCase = page.getByRole('button', { name: 'Link to Case' });
    
    }

    /** this function is for edit or update the existing bank account details  */
    async editBankAccount(){
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
    }

    /** this function is for adding New Bank Account Details */
    async addNewBankAccount(){
        await this.accountInfo.click();
        await this.sleep(3000);
        await this.addNewButton.click();
        await this.sleep(3000);
        await this.bsbNumberField.click();
        await this.bsbNumberField.fill(member.BSBNumber);
        await this.accountNameField.click();
        await this.accountNameField.fill(member.AccountName);
        await this.sleep(5000);
        //await this.accountNUmberField.click();
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
}