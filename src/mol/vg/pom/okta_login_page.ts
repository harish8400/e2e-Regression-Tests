import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page"

export class OktaLoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;


    constructor(page: Page) {
        super(page);

        this.usernameInput = page.getByLabel('Username');
        this.passwordInput = page.getByLabel('Password');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
    }

    async doLogin(username: string, password: string) {
        await this.usernameInput.fill(username);
        //focus sometimes remains on username for some reason, below is to force it to password
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

}