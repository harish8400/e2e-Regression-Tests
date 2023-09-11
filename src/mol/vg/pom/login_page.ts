import { Locator, Page } from "@playwright/test";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { MolBasePage } from "../../common/pom/mol_base_page";


export class LoginPage extends MolBasePage {
    private readonly url: string;

    private readonly webComponentLink: Locator;

    //okta status card
    private readonly oktaClientDropdown: Locator;
    private readonly loginButton: Locator;

    //registration status card
    readonly registeredStatus: Locator;

    //web component settings card
    private readonly environmentDropdown: Locator;
    private readonly memberIdInput: Locator;
    private readonly updateSettingsButton: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molVgURL;

        this.webComponentLink = page.getByRole('link', { name: 'Web Component' });

        //okta status card
        this.oktaClientDropdown = page.getByRole('combobox', { name: 'Okta Client' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });

        //registration status card
        this.registeredStatus = page.getByText('Registered', { exact: true });

        //web component settings card
        this.environmentDropdown = page.getByRole('combobox', { name: 'Environment' });
        this.memberIdInput = page.getByLabel('Member ID');
        this.updateSettingsButton = page.getByRole('button', { name: 'Update Settings' });

    }

    async goTo() {
        await this.page.goto(this.url);
    }

    async commenceOktaLogin() {
        let oktaClientOption = oktaClientOptions.get(ENVIRONMENT_CONFIG.name)!!;
        await this.oktaClientDropdown.selectOption(oktaClientOption);

        let environmentOption = environmentOptions.get(ENVIRONMENT_CONFIG.name)!!;
        await this.environmentDropdown.selectOption(environmentOption);

        await this.loginButton.click();
    }

    async updateSettings(memberId: string) {
        await this.memberIdInput.fill(memberId);
        await this.updateSettingsButton.click();
    }

    async clickWebComponentLink() {
        await this.webComponentLink.click();
    }

    async doAccountsGet() {
        let headers = await this.assembleHeaderForApiRequest();
        let apiVersion = undefined;
        if (ENVIRONMENT_CONFIG.name === "dev") {
            apiVersion = ENVIRONMENT_CONFIG.molVgMolApiVersion;
        }

        let accounts = await super.doAccountsGet(ENVIRONMENT_CONFIG.molVgApiURL, headers, apiVersion);
        return accounts;
    }

    private async assembleHeaderForApiRequest() {
        let accessToken = await this.page.evaluate(() => JSON.parse(localStorage.getItem("okta-token-storage")!!).accessToken.accessToken);
        let headers = {
            "Authorization": `Bearer ${accessToken}`
        };
        return headers;
    }

}

const oktaClientOptions = new Map<string, string>([
    ["dev", "GrowDev"],
    ["uat", "GrowUAT"]
]);

const environmentOptions = new Map<string, string>([
    ["dev", "Dev"],
    ["uat", "UAT"]
]);