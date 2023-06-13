import { Locator, Page } from "@playwright/test";
import { Sidebar } from "./component/sidebar";
import { BasePage } from "../../common/pom/base_page";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";

export class LoginPage extends BasePage {

    readonly url: string;

    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    readonly sidebar: Sidebar;

    constructor(page: Page) {
        super(page);
        this.url = ENVIRONMENT_CONFIG.aolURL;

        this.emailInput = page.locator("#email-input input");
        this.passwordInput = page.locator("#password-input input");
        this.loginButton = page.locator("#login-btn");

        this.sidebar = new Sidebar(page)
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }

    async doLogin(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

}