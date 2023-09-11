import { Page } from "@playwright/test";
import { MolInvestmentsBasePage } from "../../common/pom/mol_investments_base_page";

export class InvestmentsPage extends MolInvestmentsBasePage {

    constructor(page: Page) {
        super(page);
    }

};
