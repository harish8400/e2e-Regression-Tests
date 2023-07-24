import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../../common/pom/base_page";

export class ContactDetailsSidebar extends BasePage {
    private readonly landlineNumberLabel: Locator;

    private readonly phoneInput: Locator;

    private readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.landlineNumberLabel = page.getByText('Landline number');

        this.phoneInput = page.locator('//input[@id = "phone"]');

        this.saveButton = page.locator('xpath=//button[text() = "Save"]');
    }

    async getLandlineNumber() {
        return await this.valueForLabelLocator(this.landlineNumberLabel).textContent();
    }

    //TODO: include country code
    async updateLandlineNumber(landlineNumber: string) {
        await this.landlineNumberLabel.click();
        await this.phoneInput.fill(landlineNumber);
        await this.saveButton.click();
    }

    async waitForContactDetailsPutResponseCaseGroupId() {
        let response = await this.page.waitForResponse(response =>
            response.url().includes("/contact-details/") && response.request().method() === "PUT",
            { timeout: 10000 }
        );
        let responseJson = await response.json();
        return responseJson.linkedCaseGroupId.toString();
    }

    private valueForLabelLocator(labelLocator: Locator) {
        //value should be in label's parent div's span sibling
        return labelLocator.locator('xpath=./parent::div/following-sibling::span');
    }

}