import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { MOL_TRANSACTION_TYPE } from "../../../../constants";

export class TransactionsPage extends AuthenticatedPage {
    transactionFilter: Locator;
    transactionFilterOptionsWrapper: Locator;

    transactionHistoryList: Locator;
    transactionItem: Locator;
    transactionItemTopRow: Locator;
    transactionItemBottomRow: Locator;

    constructor(page: Page) {
        super(page);

        this.transactionFilter = page.locator('xpath=//div[@data-cy="transactions-category-filter"]');
        this.transactionFilterOptionsWrapper = page.locator('xpath=//div[@data-cy-name="dropdown-wrapper"]');

        this.transactionHistoryList = page.locator('xpath=//div[@data-cy="transactions-history-list"]');
        this.transactionItem = page.locator('xpath=//div[@data-cy="transaction-item"]');
        this.transactionItemTopRow = page.locator('xpath=//div[@data-cy="transaction-item-above"]');
        this.transactionItemBottomRow = page.locator('xpath=//div[@data-cy="transaction-item-body"]');
    }

    async filterByTransactionType(type: MOL_TRANSACTION_TYPE) {
        await this.transactionFilter.click();
        await this.transactionFilterOptionsWrapper.getByText(type, { exact: true }).click();
    }

    async getTransactions() {
        await this.transactionHistoryList.waitFor({ state: "attached" });
        await this.transactionItem.first().waitFor({ state: "visible" });
        let transactions = [];
        for (let i = 0; i < await this.transactionItem.count(); i++) {
            let tr = this.transactionItem.nth(i);
            let bottomRowParagraphs = await tr.locator(this.transactionItemBottomRow).locator('xpath=.//p').all();
            transactions.push({
                date: await tr.locator(this.transactionItemTopRow).textContent(),
                description: await bottomRowParagraphs[0].textContent(),
                amount: await bottomRowParagraphs[1].textContent()
            });
        }
        return transactions;
    }

}
