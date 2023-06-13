import { test as base } from '@playwright/test';
import { LoginPage } from './pom/login_page';

type ExtensionFixtures = {
    loginPage: LoginPage;
};

export const aolTest = base.extend<ExtensionFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});
