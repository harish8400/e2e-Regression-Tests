import { Locator, Page } from "@playwright/test";
import { MolDashboardBasePage } from "../../common/pom/mol_dashboard_base_page";
import { Navbar } from "./components/navbar";
import { SettingsSidebar } from "./components/settingsSidebar";
import { ContactDetailsSidebar } from "./components/contactDetailsSidebar";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";


export class DashboardPage extends MolDashboardBasePage {

    readonly navbar: Navbar;
    readonly setttingsSidebar: SettingsSidebar;
    readonly contactDetailsSidebar: ContactDetailsSidebar;

    private readonly accountDropdown: Locator;
    private readonly accumulationDropdownOption: Locator;
    private readonly retirementDropdownOption: Locator;

    constructor(page: Page) {
        super(page);

        this.navbar = new Navbar(page);
        this.setttingsSidebar = new SettingsSidebar(page);
        this.contactDetailsSidebar = new ContactDetailsSidebar(page);

        this.accountDropdown = page.locator('div[data-cy-name="dropdown-trigger"]').first();
        this.accumulationDropdownOption = page.getByText(ACCOUNT_OPTION.ACCUMULATION);
        this.retirementDropdownOption = page.getByText(ACCOUNT_OPTION.RETIREMENT);
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

    async doAccountsGet() {
        let headers = await this.assembleHeaderForApiRequest();
        let apiVersion = undefined;
        if (ENVIRONMENT_CONFIG.name === "dev") {
            apiVersion = ENVIRONMENT_CONFIG.molHfmMolApiVersion;
        }

        let accounts = await super.doAccountsGet(headers, apiVersion);
        return accounts;
    }

    private async assembleHeaderForApiRequest() {
        let accessToken = await this.page.evaluate(() => sessionStorage.accessToken);
        let idToken = await this.page.evaluate(() => sessionStorage.idToken);
        let headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Identity": `Bearer ${idToken}`,
        };
        return headers;
    }

}

export const ACCOUNT_OPTION = {
    ACCUMULATION: "HESTA for Mercy Super",
    RETIREMENT: "HESTA for Mercy Retirement Income Stream"
}