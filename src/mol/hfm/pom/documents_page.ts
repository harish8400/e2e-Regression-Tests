import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { MOL_DOCUMENT_TYPE } from "../../../../constants";

export class DocumentsPage extends AuthenticatedPage {

    //documents filter
    private readonly documentsFilter: Locator;
    private readonly documentsFilterOptionsWrapper: Locator;

    //documents list
    private readonly documentsList: Locator;
    private readonly documentTitle: Locator;

    constructor(page: Page) {
        super(page);

        //documents filter
        this.documentsFilter = page.locator('div[data-cy-name="documents-filter"]');
        this.documentsFilterOptionsWrapper = page.locator('div[data-cy-name="dropdown-wrapper"]');
        //documents list
        this.documentsList = page.locator('div[data-cy-name="documents-list"]');
        this.documentTitle = page.locator('p[data-cy-name="document-title"]');
    }

    async filterByDocumentType(type: MOL_DOCUMENT_TYPE) {
        await this.documentsFilter.click();
        await this.documentsFilterOptionsWrapper.getByText(type, { exact: true }).click();
    }

    async getDocumentsTitles() {
        await this.documentsList.waitFor({ state: "attached" });
        let documentTitlesStrings = [];
        for (let i = 0; i < await this.documentTitle.count(); i++) {
            documentTitlesStrings.push(await this.documentTitle.nth(i).textContent())
        }
        return documentTitlesStrings;
    }

}