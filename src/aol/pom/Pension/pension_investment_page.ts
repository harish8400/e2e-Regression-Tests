import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { DateUtils } from "../../../utils/date_utils";

export class PensionInvestmentPage extends BasePage {

    readonly processesLink: Locator;
    readonly RetirementIncomeStream: Locator;
    readonly Members: Locator;
    readonly MemberGridselection: Locator;
    readonly ButtonTransactions: Locator;
    readonly selectProduct: Locator;
    readonly selectHFM: Locator;
    readonly ButtonAddTransactions: Locator;
    readonly OptionRolloverIn: Locator;
    readonly paymentReceivedDate: Locator;
    readonly effectiveDate: Locator;
    readonly RolloverType: Locator;
    readonly RolloverOption: Locator;
    readonly ViewCase: Locator;
    readonly CreateCase: Locator;
    readonly LinkCase: Locator;
    readonly FundUSI: Locator;
    readonly AccountNumber: Locator;
    readonly InputPaymentAmount: Locator;
    readonly PaymentAmount: Locator;
    readonly PaymentReference: Locator;

    readonly InvestmentsandBalances: Locator;
    readonly CashBalanceBeforetRolloverIn: Locator;

    readonly UntaxedComponent: Locator;
    readonly InputUntaxedComponent: Locator;

    readonly TaxedComponent: Locator;
    readonly InputTaxedComponent: Locator;

    readonly PreservedAmount: Locator;
    readonly InputPreservedAmount: Locator;

    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly ApproveButtonVisblity: Locator;

    //drawdown proposal
    readonly FilterClick: Locator;
    readonly FilterOptionName: Locator;
    readonly FilterOptionNameInput: Locator;
    readonly BtnApply: Locator;
    readonly SelectMember: Locator;

    readonly PensionTab: Locator;
    readonly BtnEdit: Locator;
    readonly ProDataFirstYear: Locator;

    //specific order
    readonly SelectMember_SpecificOrder: Locator;
    readonly PensionDrawdownDetailsEdit: Locator;


    readonly ClearButton: Locator;
    readonly ClickCombobox: Locator;
    readonly SelectSecificOrder: Locator;
    readonly ClickOnInputBox: Locator;
    readonly SelectProduct: Locator;


    //Percentage


    readonly SelectPercentage: Locator;
    readonly SelectInputBox: Locator;
    readonly PercentageInput: Locator;
    readonly AddButton: Locator;







    TotalCash!: string;


    constructor(page: Page) {
        super(page)

        this.processesLink = page.getByRole('link', { name: 'Processes' });

        this.selectProduct = page.locator("(//div[@class='eBloA'])[1]");
        this.selectHFM = page.getByText('HESTA for Mercy');

        this.RetirementIncomeStream = page.locator("(//p[text()='Products' and @type='caption']//following::p[text()='Retirement Income Stream'])[1]");
        this.Members = page.locator("(//p[text()='Retirement Income Stream']//following::p[text()='Members'])[1]");
        this.MemberGridselection = page.getByText('Zele').first();
        this.InvestmentsandBalances = page.getByRole('button', { name: 'Investments and Balances' });
        this.CashBalanceBeforetRolloverIn = page.locator("(//table[@class='el-table__body']//following::div[text()='Cash']//following::td//div)");

        this.ButtonTransactions = page.getByRole('button', { name: 'Transactions' });
        this.ButtonAddTransactions = page.getByRole('button', { name: 'ADD TRANSACTION' });
        this.OptionRolloverIn = page.getByText('Rollover In');

        this.FundUSI = page.getByLabel('Fund USI *');
        this.AccountNumber = page.getByLabel('Account number *');

        this.paymentReceivedDate = page.locator('input[name="paymentReceivedDate"]');

        this.effectiveDate = page.locator('input[name="effectiveDate"]');

        this.PaymentReference = page.getByText('Payment Reference');

        this.PaymentAmount = page.getByText('Payment Amount *');
        this.InputPaymentAmount = page.getByText('$ 0.00').first();

        this.UntaxedComponent = page.getByText('$ 0.00').first();
        this.InputUntaxedComponent = page.getByLabel('Untaxed Component *');

        this.TaxedComponent = page.getByText('$ 0.00').nth(1);
        this.InputTaxedComponent = page.getByLabel('Taxed Component *', { exact: true });

        this.PreservedAmount = page.getByText('0.00', { exact: true }).nth(1);
        this.InputPreservedAmount = page.getByLabel('Preserved Amount *', { exact: true });

        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button').filter({ hasText: 'Retry' }).first();
        this.ApproveButtonVisblity = page.locator("(//button//span[text()=' Approve '])");

        this.RolloverType = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
        this.RolloverOption = page.getByText('Client-RTR');
        this.ViewCase = page.getByRole('button', { name: 'View Cases' });
        this.CreateCase = page.getByRole('button', { name: 'Create Case' });
        this.LinkCase = page.getByRole('button', { name: 'Link to Case' });

        //DrawDown 

        this.FilterClick = page.getByRole('button', { name: 'FILTER' });
        this.FilterOptionName = page.getByText('Name', { exact: true });
        this.FilterOptionNameInput = page.getByRole('textbox').first();
        this.BtnApply = page.getByRole('button', { name: 'APPLY' });
        this.SelectMember = page.getByText('Ashton', { exact: true });
        this.PensionTab = page.getByRole('button', { name: 'Pension' });
        this.BtnEdit = page.locator('button').filter({ hasText: 'Edit Content' }).first();
        this.ProDataFirstYear = page.locator('label').filter({ hasText: 'Yes' }).locator('span').first();





        //specific order

        this.SelectMember_SpecificOrder = page.getByText('Gopu').nth(1);

        this.PensionDrawdownDetailsEdit = page.getByRole('main').locator('section').filter({ hasText: 'Pension Drawdown Details Edit' }).getByRole('button');

        this.ClearButton = page.getByRole('button', { name: 'Clear Selected' });
        this.ClickCombobox = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
        this.SelectSecificOrder = page.getByText('Specified Order');


        this.ClickOnInputBox = page.getByRole('textbox', { name: 'Select' });

        this.SelectProduct = page.getByRole('listitem');

        //Percentage

        this.SelectPercentage = page.getByText('Percentage');

        this.SelectInputBox = page.getByRole('textbox', { name: 'Select' });

        //getByRole('listitem')


        this.PercentageInput = page.getByRole('textbox').nth(1);//-- fill


        this.AddButton = page.getByRole('button', { name: 'Add', exact: true });

    }

    async RolloverInTransaction() {

        // await this.FilterClick.click();
        // await this.FilterOptionName.click();
        // await this.FilterOptionNameInput.fill('Ashton');
        // await this.BtnApply.click();
        // //await this.SelectMember.click();

        //await this.ButtonTransactions.click();
        //await this.sleep(3000);
        await this.InvestmentsandBalances.click();

        await this.sleep(3000);

        //var getNum = (n: number) => (+n) ? +n : -1;
        let CashBeforeRolloverIn = await this.page.getByRole('row', { name: 'Cash $' }).locator('div').nth(1).textContent();
        let st = (CashBeforeRolloverIn?.replace(/[^0-9\.-]+/g, ""));
        let cash = 0;
        cash = (Number(st)) + (Number(25000));
        //cash = (Number(st));

        await this.ButtonTransactions.click();
        await this.sleep(1000);
        await this.ButtonAddTransactions.click();
        await this.OptionRolloverIn.click();

        await this.ViewCase.click();
        await this.CreateCase.click();

        await this.FundUSI.click();
        await this.FundUSI.fill('STA0100AU');
        await this.AccountNumber.click();
        await this.AccountNumber.fill('AUS-ACC-102030');
        await this.PaymentReference.fill('PA123');

        await this.paymentReceivedDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);

        await this.sleep(1000);

        await this.effectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);


        await this.sleep(1000);
        await this.InputPaymentAmount.click();
        await this.PaymentAmount.fill('25000');

        await this.UntaxedComponent.click();
        await this.InputUntaxedComponent.fill('000');

        await this.TaxedComponent.click();
        await this.InputTaxedComponent.fill('25000');

        await this.sleep(1000);
        await this.PreservedAmount.click();
        await this.InputPreservedAmount.fill('25000');

        await this.RolloverType.click();
        await this.RolloverOption.click();

        await this.LinkCase.click();


        await this.sleep(5000);



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

        } while (await this.ApproveButtonVisblity.count());

        await this.sleep(1000);
        await this.InvestmentsandBalances.click();

        await this.sleep(2000);

        let CashAfterRolloverIn = await this.page.getByRole('row', { name: 'Cash $' }).locator('div').nth(1).textContent();
        await this.sleep(1000);
        let afterCashAmount = (CashAfterRolloverIn?.replace(/[^0-9\.-]+/g, ""));
        await this.sleep(1000);
        let cashAfter = 0;
        cashAfter = (Number(afterCashAmount));
        await this.sleep(1000);
        expect(cashAfter).toEqual(cash);

    }

    //Drawdown Transactions
    async DrawdownTransactionsProportional() {

        await this.PensionTab.click();

        await this.sleep(5000);
        await this.BtnEdit.click();
        await this.ProDataFirstYear.click();

        await this.ViewCase.click();
        await this.sleep(1000);
        await this.CreateCase.click();
        await this.sleep(2000);
        await this.LinkCase.click();

        await this.sleep(5000);

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

        } while (await this.ApproveButtonVisblity.count());

        let updated = await this.page.getByText('No', { exact: true }).textContent();

        expect(updated).toEqual('No');

    }


    //specific order

    async DrawdownTransactionsSepcificOrder() {

        await this.PensionTab.click();
        await this.PensionDrawdownDetailsEdit.click();


        await this.ClearButton.click();
        await this.ClickCombobox.click();

        await this.SelectSecificOrder.click();
        await this.ClickOnInputBox.click();
        await this.SelectProduct.click();


        await this.ViewCase.click();
        await this.sleep(3000);
        await this.CreateCase.click();
        await this.sleep(3000);
        await this.LinkCase.click();

        await this.sleep(6000);

        do {
            //Approve step
            if (await this.approveProcessStep.count() > 0) {
                try {
                    await this.approveProcessStep.click({ timeout: 6000 });
                }
                catch (TimeoutException) {
                }
            }

            //Retry step
            if (await this.retryProcessStep.count() > 0) {
                try {
                    await this.retryProcessStep.click({ timeout: 6000 });
                }
                catch (TimeoutException) {
                }
            }

        } while (await this.ApproveButtonVisblity.count());

    }


    async DrawdownTransactionsPercentage() {

        await this.PensionTab.click();
        await this.PensionDrawdownDetailsEdit.click();

        await this.ClearButton.click();
        await this.ClickCombobox.click();

        await this.SelectPercentage.click();
        await this.SelectInputBox.click();

        await this.SelectProduct.click();
        await this.PercentageInput.fill('100');

        await this.AddButton.click();

        await this.ViewCase.click();
        await this.sleep(3000);
        await this.CreateCase.click();
        await this.sleep(3000);
        await this.LinkCase.click();

        await this.sleep(6000);

        do {
            //Approve step
            if (await this.approveProcessStep.count() > 0) {
                try {
                    await this.approveProcessStep.click({ timeout: 6000 });
                }
                catch (TimeoutException) {
                }
            }

            //Retry step
            if (await this.retryProcessStep.count() > 0) {
                try {
                    await this.retryProcessStep.click({ timeout: 6000 });
                }
                catch (TimeoutException) {
                }
            }

        } while (await this.ApproveButtonVisblity.count());

    }

}

