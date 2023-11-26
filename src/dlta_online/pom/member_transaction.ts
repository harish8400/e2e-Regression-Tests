import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import { DateUtils } from "../../utils/date_utils";
import { InvalidResultAttributeException } from "@aws-sdk/client-ssm";

export class MemberTransactionsPage extends BasePage {

    //Rollover In
    readonly memberHFMFundLink: Locator;
    readonly memberTransactionTab: Locator;
    readonly memberAddTransaction: Locator;
    readonly memberAddContribution: Locator;
    readonly memberContributionType: Locator;
    readonly memberContributionTypeSelection: Locator;
    readonly paymentReference: Locator;
    readonly paymentReceivedDate: Locator;
    readonly effectiveDate: Locator;
    readonly contributionAmount: Locator;
    readonly governmentContribution: Locator;
    readonly governmentContributionConfirm: Locator;
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly verifyContributionSuccess: Locator;

    //Rollover Out
    readonly rolloverOut: Locator;
    readonly payTo: Locator;
    readonly payToOption: Locator;
    readonly fundUSI: Locator;
    readonly destinationAccountNumber: Locator;
    readonly payFullBalance: Locator;
    readonly supertickRetry: Locator;
    readonly verifyRolloutProcessSuccess: Locator;
    readonly memberOverview: Locator;
    readonly exitStatus: Locator;

    readonly processException: Locator;

    constructor(page: Page) {
        super(page)

        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")

        //Rollover In
        this.memberHFMFundLink = page.getByRole('button', { name: 'HESTA for Mercy Super' });
        this.memberTransactionTab = page.getByRole('button', { name: 'Transactions' });
        this.memberAddTransaction = page.getByRole('button', { name: 'ADD TRANSACTION' });
        this.memberAddContribution = page.getByText('Contribution', { exact: true });
        this.memberContributionType = page.locator("(//div[@class='gs__selected-options'])[2]");
        this.memberContributionTypeSelection = page.getByRole('option', { name: 'Personal', exact: true }).locator('span');
        this.paymentReference = page.getByLabel('Payment Reference *');
        this.paymentReceivedDate = page.locator('input[name="paymentReceivedDate"]');
        this.effectiveDate = page.locator('input[name="effectiveDate"]');
        this.contributionAmount = page.getByPlaceholder('0');
        this.governmentContribution = page.locator("(//div[@class='gs__selected-options'])[3]");
        this.governmentContributionConfirm = page.getByRole('option', { name: 'No' });
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.verifyContributionSuccess = page.getByText('Process step completed with note: Member contribution payload sent.');

        //Rollover out
        this.rolloverOut = page.getByText('Rollover Out');
        this.payTo = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
        this.payToOption = page.getByRole('option', { name: 'Fund' });
        this.fundUSI = page.getByLabel('Fund USI *');
        this.destinationAccountNumber = page.getByLabel('Destination account number');
        this.payFullBalance = page.locator('.switch-slider').first();
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.supertickRetry = page.getByText('SuperTick verification result is not ready, retry in a few minutes');
        this.retryProcessStep = page.getByRole('button').filter({ hasText: 'Retry' }).first();
        this.verifyRolloutProcessSuccess = page.getByText('Process step completed with note: Manual Super Stream rollout correspondence sen');
        this.memberOverview = page.getByRole('button', { name: 'Overview' });
        this.exitStatus = page.getByRole('cell', { name: 'Exited', exact: true });
    }

    /** Member Rollin, adds a contribution to member account */
    async memberRolloverIn(){
        await this.memberHFMFundLink.click();
        await this.memberTransactionTab.click();
        await this.memberAddTransaction.click();
        await this.memberAddContribution.click();

        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(3000);
        
        await this.memberContributionType.click(); 
        await this.memberContributionTypeSelection.click(); 
        await this.paymentReference.fill('PA');
        await this.paymentReceivedDate.fill(`${DateUtils.ddmmyyyStringDate()}`);
        await this.paymentReceivedDate.press('Tab');
        await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate()}`);
        await this.effectiveDate.press('Tab');
        await this.contributionAmount.fill('10000');
        await this.governmentContribution.click();
        await this.governmentContributionConfirm.click();

        await this.linkCase.click();
        await this.sleep(5000);

        //Review case process steps, approve/retry or exit on exception
        do{
            //Approve step
            if(await this.approveProcessStep.count() > 0)
            {
                try{
                    await this.approveProcessStep.click({ timeout: 5000});
                }
                catch (TimeoutException) {
                }
            }
            
            //Retry step
            if(await this.retryProcessStep.count() > 0 )
            {
                try{
                    await this.retryProcessStep.click({ timeout: 5000});
                }
                catch (TimeoutException) {
                }
            }

            //Break if there is an process exception
            if (await this.processException.count() > 0){
                throw InvalidResultAttributeException;
             }

        } while(await this.verifyContributionSuccess.count() == 0);
        
        await expect(this.verifyContributionSuccess).toBeVisible();
    }

    /** Member Rollout, perform rollout and exits member */
    async memberRolloverOut() {

        await this.memberHFMFundLink.click();
        await this.memberTransactionTab.click();
        await this.memberAddTransaction.click();
        await this.rolloverOut.click();

        await this.viewCase.click();
        await this.createCase.click();
        this.sleep(3000);

        await this.payTo.click();
        await this.payToOption.click();
        await this.fundUSI.fill('STA0100AU');
        await this.fundUSI.press('Tab');
        await this.destinationAccountNumber.fill('MER-ACC-355657');
        await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate()}`);
        await this.effectiveDate.press('Tab');
        await this.payFullBalance.click();

        await this.linkCase.click();
        await this.sleep(5000);

        //Review case process steps, approve/retry or exit on exception
        do {
            //Approve step
            if (await this.approveProcessStep.count() > 0) {
                try {
                    await this.approveProcessStep.click({ timeout: 5000 });
                }
                catch (TimeoutException) {
                }
            }

            //Retry step
            if (await this.retryProcessStep.count() > 0) {
                try {
                    await this.retryProcessStep.click({ timeout: 5000 });
                }
                catch (TimeoutException) {
                }
            }

            //Break if there is an process exception
            if (await this.processException.count() > 0){
               throw InvalidResultAttributeException;
            }
        } while (
            await this.verifyRolloutProcessSuccess.count() == 0
        );

        await this.page.reload();
        await this.memberOverview.click();
        await expect(this.exitStatus).toBeVisible();
    }
}