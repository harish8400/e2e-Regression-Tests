import { Locator, Page } from "@playwright/test";
import { Navbar } from "./components/navbar";
import path from "path";
import fs from "fs"
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { SettingsSidebar } from "./components/settingsSidebar";
import { ContactDetailsSidebar } from "./components/contactDetailsSidebar";
import { MolBasePage } from "../../common/mol_base_page";

const AUTH_DIRECTORY = path.join(__dirname, '../../../../playwright/.auth');
const SESSION_STORAGE = AUTH_DIRECTORY + '/mol_hfm_user.json';

export abstract class AuthenticatedPage extends MolBasePage {

    private readonly navbar: Navbar;
    private readonly setttingsSidebar: SettingsSidebar;

    readonly contactDetailsSidebar: ContactDetailsSidebar;

    readonly messageItem: Locator;

    constructor(page: Page) {
        super(page);

        this.navbar = new Navbar(page);
        this.setttingsSidebar = new SettingsSidebar(page);
        this.contactDetailsSidebar = new ContactDetailsSidebar(page);

        this.messageItem = page.locator('div[data-cy="message-item"]');
    }

    async navigateToDashboard() {
        await this.navbar.clickDashboard();
    }

    async navigateToInvestments() {
        await this.navbar.clickInvestments();
    }

    async navigateToTransactions() {
        await this.navbar.clickTransactions();
    }

    async navigateToInsurance() {
        await this.navbar.clickInsurance();
    }

    async navigateToPension() {
        await this.navbar.clickPayments();
    }

    async navigateToCombine() {
        await this.navbar.clickMoreAndCombine();
    }

    async navigateToBeneficiaries() {
        await this.navbar.clickMoreAndBeneficiaries();
    }

    async navigateToDocuments() {
        await this.navbar.clickMoreAndDocuments();
    }

    async navigateToContactDetails() {
        await this.navbar.clickProfile();
        await this.setttingsSidebar.clickContactDetails();
    }

    async doLogout() {
        await this.navbar.clickProfile();
        await this.setttingsSidebar.clickLogout();
    }

    async saveSessionStorage() {
        let storage: string = await this.page.evaluate(() => JSON.stringify(sessionStorage));
        if (!fs.existsSync(AUTH_DIRECTORY)) {
            fs.mkdirSync(AUTH_DIRECTORY, { recursive: true });
        }
        fs.writeFileSync(SESSION_STORAGE, storage);
    }

    async addSessionStorage() {
        let storage: JSON = JSON.parse(fs.readFileSync(SESSION_STORAGE, 'utf-8'));
        await this.page.evaluate((ss) => {
            for (const [key, value] of Object.entries(ss)) {
                window.sessionStorage.setItem(key, value);
            }
        }, storage)
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

};