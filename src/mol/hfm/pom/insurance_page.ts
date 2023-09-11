import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";

export class InsurancePage extends AuthenticatedPage {

    //view
    private readonly deathHeader: Locator;
    private readonly tpdHeader: Locator;
    private readonly ipHeader: Locator;

    readonly optInHeader: Locator;
    readonly applicationInProgressHeader: Locator;
    readonly coverOptionsHeader: Locator;
    readonly optInButton: Locator;
    readonly manageYourCoverButton: Locator;

    //opt-in modal
    private readonly yesOptInButton: Locator;

    constructor(page: Page) {
        super(page);

        //view
        this.deathHeader = page.getByRole('heading', { name: 'Death' });
        this.tpdHeader = page.getByRole('heading', { name: 'Total and Permanent Disablement (TPD)' });
        this.ipHeader = page.getByRole('heading', { name: 'Income Protection' });

        this.optInHeader = page.getByRole('heading', { name: 'Opt In' });
        this.applicationInProgressHeader = page.getByRole('heading', { name: 'Insurance Application in progress' });
        this.coverOptionsHeader = page.getByRole('heading', { name: 'Cover options' });

        this.optInButton = page.locator('button:text-is("Opt in")');
        this.manageYourCoverButton = page.locator('button:text-is("Manage your cover")');

        //opt-in modal
        //has different aria-label value so can't use getByRole with name
        this.yesOptInButton = page.locator('button:text-is("Yes, Opt in")');
    }

    async getInsurance() {
        //TODO: check with devs if can add some html locators instead
        let deathRow = this.deathHeader.locator('../..');
        let deathCover = await deathRow.locator('p').nth(1).textContent();
        let deathFee = await deathRow.locator('p').nth(2).textContent();

        let tpdRow = this.tpdHeader.locator('../..');
        let tpdCover = await tpdRow.locator('p').nth(1).textContent();
        let tpdFee = await tpdRow.locator('p').nth(2).textContent();

        let ipRow = this.ipHeader.locator('../..');
        let ipCover = (await ipRow.locator('div').nth(1).locator('div').nth(0).innerText()).replaceAll("\n\n", "\n");
        let ipFee = await ipRow.locator('p').nth(4).textContent();
        return {
            death: { cover: deathCover, fee: deathFee },
            tpd: { cover: tpdCover, fee: tpdFee },
            ip: { cover: ipCover, fee: ipFee },
        };
    }

    async optInToInsurance() {
        await this.optInButton.click();
        await this.yesOptInButton.click();
    }

    async waitForInsuranceOptInPutCaseGroupId() {
        let response = await this.page.waitForResponse(response =>
            response.url().includes("insurances/opt-in") && response.request().method() === "PUT"
        );
        let responseJson = await response.json();
        return responseJson.linkedCaseGroupId.toString();
    }

}