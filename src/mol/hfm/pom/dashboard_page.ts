import { Locator, Page } from "@playwright/test";
import { AuthenticatedPage } from "./authenticated_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";


export class DashboardPage extends AuthenticatedPage {
    private readonly url;

    private readonly accountDropdown: Locator;
    private readonly accumulationDropdownOption: Locator;
    private readonly retirementDropdownOption: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molHfmURL + "/dashboard"

        this.accountDropdown = page.locator('//div[@data-cy-name="dropdown-trigger"]');
        this.accumulationDropdownOption = page.getByText(ACCOUNT_OPTION.ACCUMULATION);
        this.retirementDropdownOption = page.getByText(ACCOUNT_OPTION.RETIREMENT);
    }

    async goTo() {
        await this.page.goto(this.url);
    }

    async selectAccount(accountOption: string) {
        let currentSelection = await this.accountDropdown.innerText();
        if (currentSelection.includes(accountOption)) {
            return;
        }

        await this.accountDropdown.nth(0).click();
        switch (accountOption) {
            case ACCOUNT_OPTION.ACCUMULATION:
                await this.accumulationDropdownOption.click();
                break;
            case ACCOUNT_OPTION.RETIREMENT:
                await this.retirementDropdownOption.click();
                break;
            default:
                throw new Error(`Account option '${accountOption}' not yet implemented`);
        }
    }

}

export const ACCOUNT_OPTION = {
    ACCUMULATION: "HESTA for Mercy Super",
    RETIREMENT: "HESTA for Mercy Retirement Income Stream"
}