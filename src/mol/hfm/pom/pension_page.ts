import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { PAYMENT_FREQUENCY } from "../../../../constants";

export class PensionPage extends AuthenticatedPage {

    //view
    private readonly nextPaymentDateParagraph;
    private readonly paymenFrequencyParagraph;
    private readonly paymenSelectionParagraph;

    //manage payment details
    private readonly changePaymentDetailsButton: Locator;
    private readonly frequencyDropdown: Locator;
    private readonly paymentSelectionDropdown: Locator;
    private readonly minimumAmountSelection: Locator;
    private readonly nominatedAmountSelection: Locator;
    private readonly nominatedAmountInput: Locator;
    private readonly saveChangesButton: Locator;

    //TODO: extract confirmation dialog into component
    //confirmation modal
    private readonly yesSureButton: Locator;


    constructor(page: Page) {
        super(page);

        //view
        this.nextPaymentDateParagraph = page.locator('//p[@data-cy="pension-info-details-next-payment-date"]');
        this.paymenFrequencyParagraph = page.locator('//p[@data-cy="pension-info-details-frequency"]');
        this.paymenSelectionParagraph = page.locator('//p[@data-cy="pension-info-details-payment-selection"]');

        //manage payment details
        //has different aria-label, can't use role
        this.changePaymentDetailsButton = page.locator('xpath=//button[text() = "Change payment details"]');
        this.frequencyDropdown = page.locator('//div[@data-cy="frequency-option-input-select"]//div[@data-cy-name="dropdown-trigger"]');
        this.paymentSelectionDropdown = page.locator('//div[@data-cy="payment-selection-option-input-select"]//div[@data-cy-name="dropdown-trigger"]');
        this.minimumAmountSelection = page.getByTitle("Minimum amount", { exact: true })
        this.nominatedAmountSelection = page.getByTitle("Nominated amount", { exact: true })
        this.nominatedAmountInput = page.getByLabel('Amount per', { exact: false });
        //has different aria-label, can't use role
        this.saveChangesButton = page.locator('xpath=//button[text() = "Save Changes"]');

        //confirmation modal
        this.yesSureButton = page.locator('xpath=//button[text() = "Yes, I’m sure"]');
    }

    async getCurrentPaymentDetails() {
        let paymentDetailsText: Array<string> = [];
        paymentDetailsText.push((await this.nextPaymentDateParagraph.innerText()).replace("\n\n", " "));
        paymentDetailsText.push((await this.paymenFrequencyParagraph.innerText()).replace("\n", " "));
        paymentDetailsText.push((await this.paymenSelectionParagraph.innerText()).replace("\n", " "));
        return paymentDetailsText;
    }

    async changePaymentDetails(paymentDetails: PensionPaymentDetails) {
        await this.changePaymentDetailsButton.click();

        await this.frequencyDropdown.click();
        await this.page.getByText(paymentDetails.frequency, { exact: true }).nth(-1).click();

        await this.paymentSelectionDropdown.click();
        if (typeof paymentDetails.amount === "number") {
            await this.nominatedAmountSelection.click();
            await this.nominatedAmountInput.fill(paymentDetails.amount.toString());
        } else {
            await this.minimumAmountSelection.click();
        }

        await this.saveChangesButton.click();
        await this.yesSureButton.click();
    }

    async waitForPaymentDetailsPutResponseCaseGroupId() {
        let response = await this.page.waitForResponse(response =>
            response.url().includes("/pension/payment/details") && response.request().method() === "PUT"
        );
        let responseJson = await response.json();
        return responseJson.linkedCaseGroupId.toString();
    }

};

export interface PensionPaymentDetails {
    frequency: PAYMENT_FREQUENCY,
    amount: number | "Minimum amount",
    nextPaymentDate?: string
}