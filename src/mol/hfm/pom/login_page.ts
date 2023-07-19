import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";

export class LoginPage extends BasePage {
    private readonly url: string;

    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molURL;

        this.emailInput = page.getByLabel('Your Email');
        this.passwordInput = page.getByLabel('Your Password');
        this.loginButton = page.getByRole('button', { name: 'LOG IN NOW' });
    }

    async goTo() {
        await this.page.goto(this.url);
    }

    async doLogin(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

}