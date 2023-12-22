import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";

export class LoginPage extends BasePage {

    private readonly url: string

    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly continueButton: Locator;
    private readonly vpnCancel: Locator;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.aolURL;

        this.emailInput = page.getByPlaceholder('user@company.com');
        this.passwordInput = page.getByPlaceholder('Your password');
        this.continueButton = page.getByRole('button', { name: 'Log in' });
        this.vpnCancel = page.locator('//div[@data-cy="alert-button"]');
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }

    async doLogin(email: string, password: string) {
        await this.vpnCancel.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.page.keyboard.press('Tab');
        await this.continueButton.click();
    }
}