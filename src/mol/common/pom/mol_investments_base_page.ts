import { Locator, Page } from "@playwright/test";
import { INVESTMENT_CHANGE_TYPE } from "../../../../constants";
import { MolBasePage } from "./mol_base_page";

export abstract class MolInvestmentsBasePage extends MolBasePage {

    //view
    readonly currentInvestmentChart: Locator;
    readonly futureInvestmentChart: Locator;
    private readonly investmentItem: Locator;
    private readonly investmentItemTitle: Locator;
    private readonly investmentItemSubTitle: Locator;

    protected changeInvestmentsButton: Locator;

    //change
    private readonly currentBalanceAllocationOptionDiv: Locator;
    private readonly futureInvestmentsOptionDiv: Locator;
    private readonly currentAndFuturePortfolioOptionDiv: Locator;

    private readonly investmentRow;
    private readonly investmentRowLabel;
    private readonly investmentRowPercentInput;
    private readonly sameAllocationLabel: Locator;

    private readonly applyChangesButton;

    //confirmation modal
    private readonly yesUpdateButton: Locator;

    constructor(page: Page) {
        super(page);

        //view
        this.currentInvestmentChart = page.locator('div[data-cy="current-investment-chart"]');
        this.futureInvestmentChart = page.locator('div[data-cy="future-investment-chart"]');
        this.investmentItem = page.locator('div[data-cy-name="investment-breakdown-item"]');
        this.investmentItemTitle = page.locator('p[data-cy-name="legend-title"]');
        this.investmentItemSubTitle = page.locator('p[data-cy-name="legend-subtitle"]');
        this.changeInvestmentsButton = page.locator('button:text-is("Change investments")');

        //change
        //switch type selection
        this.currentBalanceAllocationOptionDiv = page.getByText('Current investments', { exact: true });
        this.futureInvestmentsOptionDiv = page.getByText('Future investments', { exact: true });
        this.currentAndFuturePortfolioOptionDiv = page.getByText('Current and future investments', { exact: true });

        //allocations
        this.investmentRow = page.locator('div[data-cy="investment-strategy-wrapper"]');
        this.investmentRowLabel = page.locator('p[data-cy="investment-strategy-label"]');
        this.investmentRowPercentInput = page.locator('input[data-cy="input-field"]');
        this.sameAllocationLabel = page.getByText('Same as above allocation')
        //has different aria-label value so can't use getByRole with name
        this.applyChangesButton = page.locator('button:text-is("Apply changes")');

        //confirmation modal
        this.yesUpdateButton = page.locator('button:text-is("Yes, I’m sure")');
    }

    async getCurrentAssetAllocation(): Promise<Array<{ title: string, subtitle1: string, subtitle2: string }>> {
        let currentAllocation = []
        let investmentItems = await this.currentInvestmentChart.locator(this.investmentItem).all();
        for (const investmentItem of investmentItems) {
            let titleText = await investmentItem.locator(this.investmentItemTitle).textContent();
            let subtitles = await investmentItem.locator(this.investmentItemSubTitle).all();
            let subtitle1Text = await subtitles[0].textContent();
            let subtitle2Text = await subtitles[1].textContent();
            currentAllocation.push({ title: titleText!!, subtitle1: subtitle1Text!!, subtitle2: subtitle2Text!! });
        }
        return currentAllocation;
    }

    async getFutureAllocation(): Promise<Array<string>> {
        let futureAllocation = []
        let investmentItems = await this.futureInvestmentChart.locator(this.investmentItem).all();
        for (const investmentItem of investmentItems) {
            let titleText = await investmentItem.locator(this.investmentItemTitle).textContent();
            futureAllocation.push(titleText!!);
        }
        return futureAllocation;
    }

    async changeInvestments(investmentsChanges: InvestmentChange[]) {
        await this.changeInvestmentsButton.click();
        //TODO subsequent option selection click doesn't fire intermittently without a small delay. Need to investigate further 
        await this.sleep(1000);

        if (investmentsChanges.length < 1 || investmentsChanges.length > 2) {
            throw new Error(`Got ${investmentsChanges.length} number of investment changes: ${JSON.stringify(investmentsChanges)}.\nExpected 1 or 2 only`);
        }
        else if (investmentsChanges.length === 2) {
            //current and future investment change 
            await this.currentAndFuturePortfolioOptionDiv.click();
            await this.sameAllocationLabel.click();
        }
        else if (investmentsChanges[0].changeType === INVESTMENT_CHANGE_TYPE.CURRENT_BALANCE) {
            await this.currentBalanceAllocationOptionDiv.click();
        }
        else {
            await this.futureInvestmentsOptionDiv.click();
        }

        for (let investmentChangeIndex = 0; investmentChangeIndex < investmentsChanges.length; investmentChangeIndex++) {
            let investmentChange = investmentsChanges[investmentChangeIndex];
            let rowIndex = 0;
            //if current and future investment change, future investments grid comes after current investments grid
            if (investmentsChanges.length > 1 && investmentChange.changeType === INVESTMENT_CHANGE_TYPE.FUTURE_INVESTMENTS) {
                rowIndex = 1
            }
            await this.enterInvestmentChange(investmentChange, rowIndex);
        };

        await this.applyChangesButton.click();
        await this.yesUpdateButton.click();
    }

    async waitForInvestmentsPutCaseGroupId() {
        let response = await this.page.waitForResponse(response =>
            response.url().includes("/investments/") && response.request().method() === "PUT"
        );
        let responseJson = await response.json();
        return responseJson.linkedCaseGroupId.toString();
    }

    private async enterInvestmentChange(investmentChange: InvestmentChange, rowIndex: number) {
        for (let investmentIndex = 0; investmentIndex < investmentChange.investments.length; investmentIndex++) {
            let investment = investmentChange.investments[investmentIndex];
            let label = this.investmentRowLabel.filter({ hasText: new RegExp(`^${investment.name}$`) });
            let row = this.investmentRow.filter({ has: label }).nth(rowIndex);
            await row.locator(this.investmentRowPercentInput).fill(investment.percentage.toString());
        }
    }

};

export interface InvestmentChange {
    changeType: INVESTMENT_CHANGE_TYPE,
    investments: Array<MolInvestmentSelection>
};

export interface MolInvestmentSelection {
    name: string,
    percentage: number
};