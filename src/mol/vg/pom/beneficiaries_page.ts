import { Page } from "@playwright/test";
import { MolBeneficiariesBasePage } from "../../common/pom/mol_beneficiaries_base_page";

export class BeneficiariesPage extends MolBeneficiariesBasePage {

    constructor(page: Page) {
        super(page);
    }

};
