import { Page } from "@playwright/test";
import { MolDocumentsBasePage } from "../../common/pom/mol_documents_base_page";

export class DocumentsPage extends MolDocumentsBasePage {

    constructor(page: Page) {
        super(page);
    }

}