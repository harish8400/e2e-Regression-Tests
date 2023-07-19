import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { Navbar } from "./components/navbar";
import path from "path";
import fs from "fs"
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";

const AUTH_DIRECTORY = path.join(__dirname, '../../../../playwright/.auth');
const SESSION_STORAGE = AUTH_DIRECTORY + '/user.json';

export abstract class AuthenticatedPage extends BasePage {

    private readonly navbar: Navbar;

    readonly messageItem: Locator;

    constructor(page: Page) {
        super(page);

        this.navbar = new Navbar(page);

        this.messageItem = page.locator('xpath=//div[@data-cy="message-item"]');
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

    async doLogout() {
        await this.navbar.doLogout();
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
        let response = await this.page.request.get(ENVIRONMENT_CONFIG.molApiURL + "/v1/identities/current/accounts", {
            headers: await this.assembleHeaderForApiRequest()
        });

        let accounts: Array<Account>;
        accounts = await response.json();
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

export interface Account {
    memberId: string,
    memberNo: string,
    productReference: string,
    productType: string,
    fundProductId: string,
    productPhase: string
};