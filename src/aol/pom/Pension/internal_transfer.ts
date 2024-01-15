import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
//import { AssertionError } from "assert";
import { AssertionError } from "assert";
//import { InvalidResultAttributeException } from "@aws-sdk/client-ssm";
import * as memberData from "../../../aol/data/pension_data.json";
import { ReviewCase } from "../component/review_case";

export class InternalTransferPage extends BasePage {
    readonly processesLink: Locator;
    readonly reviewCase: ReviewCase;

    readonly AccumulationMembers: Locator;
    readonly AccumulationProduct: Locator;
    readonly ButtonTransactions: Locator;
    readonly ButtonAddTransactions: Locator;
    readonly accumulationOption: Locator;
    readonly internalTransferOption: Locator;
    readonly viewCasesButton: Locator;
    readonly createCaseButton: Locator;
    readonly collapseButton: Locator;
    readonly dropdownInternalTransferType: Locator;
    readonly valueInternalTransferType: Locator;
    readonly dropdownSourceProduct: Locator;
    readonly valueSourceProduct: Locator;
    readonly sourceAccount: Locator;
    readonly buttonLinkToCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly verifyContributionSuccess: Locator;
    readonly processException: Locator;
    readonly processID: Locator;
    readonly verifySuccessMessage: Locator;
    //readonly accountInfo: Locator;
    //readonly caseTable: Locator;

    constructor(page:Page){
        super(page)
        this.reviewCase = new ReviewCase(page);
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.processesLink = page.getByRole('link', { name: 'Processes' });

        /* locators for product and member selection */
        //this.selectProduct = page.locator("(//div[@class='eBloA'])[1]");
        //this.selectHFM = page.getByText('HESTA for Mercy');
        //this.RetirementIncomeStream = page.locator("(//p[text()='Products' and @type='caption']//following::p[text()='Retirement Income Stream'])[1]");
        //this.Members = page.locator("(//p[text()='Retirement Income Stream']//following::p[text()='Members'])[1]");
        //this.MemberGridselection = page.getByText('Glenn').first();
        //this.selectProduct = page.locator("(//div[@class='eBloA'])[1]");

        this.AccumulationProduct = page.locator("//p[@type='label'][normalize-space()='Accumulation']");
        this.AccumulationMembers = page.getByRole('link', { name: 'Members' });
        this.ButtonTransactions = page.getByRole('button', { name: 'Transactions' });
        this.ButtonAddTransactions = page.getByRole('button', { name: 'ADD TRANSACTION' });
        this.accumulationOption = page.getByRole('button', { name: 'Accumulation' });
        this.internalTransferOption = page.getByText('Internal Transfer', { exact: true });
        this.viewCasesButton = page.getByRole('button', { name: 'View Cases' });
        this.createCaseButton = page.getByRole('button', { name: 'Create Case' });
        this.collapseButton = page.getByRole('button', { name: 'arrow-left icon clipboard-' });
        this.dropdownInternalTransferType = page.locator("(//div[@class='gs__actions'])[2]");
        this.valueInternalTransferType = page.getByRole('option', { name: 'Internal Transfer' });
        this.dropdownSourceProduct = page.locator("//div[@id='sourceProduct']");

        this.valueSourceProduct = page.getByRole('option', { name: 'HESTA for Mercy Super' });
        
        this.sourceAccount = page.locator("//input[@id='sourceMemberNumber']");
        this.buttonLinkToCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.verifyContributionSuccess = page.getByText('Internal transfer out sub process initiated.');
        this.processID = page.getByLabel('Related Cases add-circle iconarrow-down iconSearch Related Cases CloseSelect').locator('a');
        this.verifySuccessMessage = page.getByText('Processed Payment.');
        
    }

    /** Internal Transaction from Accumulation to Retirement Income Sream */
    async transferFromAccumulationToRetirement(){
        
        await this.ButtonTransactions.click();
        await this.ButtonAddTransactions.click();
        await this.internalTransferOption.click();

        await this.viewCasesButton.click();
        await this.createCaseButton.click();
        await this.sleep(3000);

        await this.dropdownInternalTransferType.click();
        await this.valueInternalTransferType.click();
        await this.dropdownSourceProduct.click();
        await this.sleep(2000);
        await this.valueSourceProduct.click();
        await this.sourceAccount.fill(memberData.pension.Internal_Transfer_Accumulation_Source_Account);
        await this.page.keyboard.down('Tab');
        await this.sleep(2000);
        await this.buttonLinkToCase.click();

        await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);

        // do{
        //     //Approve step
        //     if(await this.approveProcessStep.count() > 0)
        //     {
        //         try{
        //             await this.approveProcessStep.click({ timeout: 5000});
        //         }
        //         catch (TimeoutException) {
        //         }
        //     }
            
        //     //Retry step
        //     if(await this.retryProcessStep.count() > 0 )
        //     {
        //         try{
        //             await this.retryProcessStep.click({ timeout: 5000});
        //         }
        //         catch (TimeoutException) {
        //         }
        //     }

        //     //assert(await this.processException.count() < 0);
        //     //Break if there is an process exception
        //     if (await this.processException.count() > 0){
        //         throw new AssertionError({message: "Error in Processing Case"});
        //      }

        // } while(await this.verifyContributionSuccess.count() == 0);
        
        // await expect(this.verifyContributionSuccess).toBeVisible();


        await this.processID.click();
        await this.sleep(3000);

        await this.reviewCase.reviewCaseProcess(this.verifySuccessMessage);

        // do{
        //     //Approve step
        //     if(await this.approveProcessStep.count() > 0)
        //     {
        //         try{
        //             await this.approveProcessStep.click({ timeout: 5000});
        //         }
        //         catch (TimeoutException) {
        //         }
        //     }
            
        //     //Retry step
        //     if(await this.retryProcessStep.count() > 0 )
        //     {
        //         try{
        //             await this.retryProcessStep.click({ timeout: 5000});
        //         }
        //         catch (TimeoutException) {
        //         }
        //     }

        //     //assert(await this.processException.count() < 0);
        //     //Break if there is an process exception
        //     if (await this.processException.count() > 0){
        //         throw new AssertionError({message: "Error in Processing Case"});
        //      }

        // } while(await this.verifySuccessMessage.count() == 0);
        
        // await expect(this.verifySuccessMessage).toBeVisible();

        
    }
}