import { Page } from "@playwright/test";
import { MolPensionBasePage } from "../../common/pom/mol_pension_base_page";

export class PensionPage extends MolPensionBasePage {

    constructor(page: Page) {
        super(page);
    }

};
