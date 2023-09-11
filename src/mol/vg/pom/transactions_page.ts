import { Page } from "@playwright/test";
import { MolTransactionsBasePage } from "../../common/pom/mol_transactions_base_page";

export class TransactionsPage extends MolTransactionsBasePage {

    constructor(page: Page) {
        super(page);
    }

}