import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";

export class BeneficiariesPage extends AuthenticatedPage {

    //view
    readonly noBeneficiariesHeading: Locator;
    readonly noBeneficiariesYetParagraph: Locator;
    readonly beneficiarySummary: Locator
    readonly beneficiarySummaryHeader: Locator
    readonly beneficiarySummaryDescription: Locator
    //manage
    private readonly manageBeneficiariesButton: Locator;
    private readonly nominateNonBindingBeneficiaryLabel: any;
    private readonly startNominationButton: Locator;
    private readonly addBeneficiaryButton: Locator;
    private readonly continueButton: Locator;

    private readonly manageBeneficiaryItemDiv: Locator;
    private readonly manageBeneficiaryRelationshipDropdown: Locator;
    private readonly manageBeneficaryName: Locator;
    private readonly manageBeneficaryDateOfBirth: Locator;
    private readonly manageBeneficiaryPercentageDiv: Locator;
    private readonly applyChangeButton: Locator;
    private readonly yesProceedButton: Locator;

    constructor(page: Page) {
        super(page);

        //view
        this.noBeneficiariesHeading = page.getByRole('heading', { name: 'No existing beneficiaries' });

        //paragraph text is different in uat
        const noBeneficiariesParagraphText = 'We don\'t have any nominated beneficiaries for you yet.';
        this.noBeneficiariesYetParagraph = page.getByText(noBeneficiariesParagraphText);
        //div with each beneficiary's details
        this.beneficiarySummary = page.locator('xpath=//*[@data-cy-name="beneficiary-summary-list"]');
        this.beneficiarySummaryHeader = page.locator('xpath=//*[@data-cy-name="beneficiary-summary-item-header"]');
        this.beneficiarySummaryDescription = page.locator('xpath=//*[@data-cy-name="beneficiary-summary-item-description"]');

        //manage
        this.manageBeneficiariesButton = page.locator('xpath=//button[text() = "Manage beneficiaries"]');
        this.nominateNonBindingBeneficiaryLabel = page.getByText('Nominate non-binding beneficiary');
        this.startNominationButton = page.locator('xpath=//button[text() = "Start nomination"]');
        this.addBeneficiaryButton = page.locator('xpath=//button[text() = "Add beneficiary"]');
        this.continueButton = page.locator('xpath=//button[text() = "Continue"]');
        this.applyChangeButton = page.locator('xpath=//button[text() = "Apply changes"]');
        this.yesProceedButton = page.locator('xpath=//button[text() = "Yes, proceed"]');

        this.manageBeneficiaryItemDiv = page.locator('xpath=//div[@data-cy-name="beneficiary-item"]');
        //within each div
        this.manageBeneficiaryRelationshipDropdown = page.locator('xpath=//div[@data-cy-name="dropdown-trigger"]');
        this.manageBeneficaryName = page.getByLabel('Name of beneficiary (First name and Surname)');
        this.manageBeneficaryDateOfBirth = page.getByLabel('Date of birth');

        this.manageBeneficiaryPercentageDiv = page.locator('xpath=//div[@data-cy-name="non-binding-beneficiary-allocation-item-input"]');
    }

    async getBeneficiaries() {
        let beneficiariesText = []
        let beneficiariesRows = await this.beneficiarySummary.all();
        for (const row of beneficiariesRows) {
            let headerText = await row.locator(this.beneficiarySummaryHeader).textContent();
            let descriptionText = await row.locator(this.beneficiarySummaryDescription).textContent();
            beneficiariesText.push({ "header": headerText, "description": descriptionText });
        }
        return beneficiariesText;
    }

    async addNonBindingBeneficiaries(beneficiaries: Array<MolBeneficary>) {
        await this.manageBeneficiariesButton.click();
        await this.nominateNonBindingBeneficiaryLabel.click();
        await this.startNominationButton.click();

        for (let index = 0; index < beneficiaries.length; index++) {
            if (index !== 0) {
                await this.addBeneficiaryButton.click();
            }
            let beneficiary = beneficiaries[index];
            let workingDiv = this.manageBeneficiaryItemDiv.nth(index);
            await workingDiv.locator(this.manageBeneficiaryRelationshipDropdown).click();
            await this.page.getByText(beneficiary.relationship, { exact: true }).click();
            await workingDiv.locator(this.manageBeneficaryName).fill(beneficiary.name);
            await workingDiv.locator(this.manageBeneficaryDateOfBirth).click();
            await workingDiv.locator(this.manageBeneficaryDateOfBirth).fill(beneficiary.dateOfBirth);
            await this.page.keyboard.press("Enter");
        }
        await this.continueButton.click();

        for (let index = 0; index < beneficiaries.length; index++) {
            let beneficiary = beneficiaries[index];
            let workingDiv = this.manageBeneficiaryPercentageDiv.nth(index);
            await workingDiv.locator("input").fill(beneficiary.percentage.toString());
        }
        await this.applyChangeButton.click();

        await this.yesProceedButton.click();
    }

    async waitForBeneficiariesPostResponseCaseGroupId() {
        let response = await this.page.waitForResponse(response =>
            response.url().includes("/beneficiaries") && response.request().method() === "POST"
        );
        let responseJson = await response.json();
        return responseJson.linkedCaseGroupId.toString();
    }

};

export interface MolBeneficary {
    relationship: string,
    name: string,
    dateOfBirth: string,
    percentage: number,
};