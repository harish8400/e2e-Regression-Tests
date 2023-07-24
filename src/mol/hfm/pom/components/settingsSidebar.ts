import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../../common/pom/base_page";

export class SettingsSidebar extends BasePage {
    //options
    private readonly personalDetails: Locator;
    private readonly contactDetails: Locator;
    private readonly changeYourPassword: Locator;
    private readonly taxFileNumber: Locator;
    private readonly logOut: Locator;

    constructor(page: Page) {
        super(page);

        //options
        this.personalDetails = page.getByText('Personal details');
        this.contactDetails = page.getByText('Contact details');
        this.changeYourPassword = page.getByText('Change your password');
        this.taxFileNumber = page.getByText('Tax file number');
        this.logOut = page.getByText('Log out');
    }

    async clickPersonalDetails() {
        await this.personalDetails.click();
    }

    async clickContactDetails() {
        await this.contactDetails.click();
    }

    async clickChangeYourPassword() {
        await this.changeYourPassword.click();
    }

    async clickTaxFileNumber() {
        await this.taxFileNumber.click();
    }

    async clickLogout() {
        await this.logOut.click();
    }

}