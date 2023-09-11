import { Page } from "@playwright/test";
import { MolInsuranceBasePage } from "../../common/pom/mol_insurance_base_page";

export class InsurancePage extends MolInsuranceBasePage {

    constructor(page: Page) {
        super(page);
    }

}