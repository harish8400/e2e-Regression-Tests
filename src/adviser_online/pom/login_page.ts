import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";

export class LoginPage extends BasePage {

    private readonly url: string

    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.adviserOnlineURL;

        this.emailInput = page.getByLabel('Email address');
        this.passwordInput = page.getByLabel('Password');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }

    async doLogin(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.continueButton.click();
        await this.passwordInput.fill(password);
        await this.continueButton.click();
    }

}