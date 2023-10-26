import { test as base } from '@playwright/test';
import { LoginPage } from './pom/login_page';
import { DashboardPage } from './pom/dashboard_page';
import { ClientPage } from './pom/client_page';
import { Navbar } from '../mol/hfm/pom/components/navbar';

type ExtensionFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    clientPage: ClientPage;
    navbar: Navbar;
};

export const adviserOnlineTest = base.extend<ExtensionFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    clientPage: async ({ page }, use) => {
        await use(new ClientPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        use(new DashboardPage(page));
    },

    navbar: async({ page }, use) => {
        await use(new Navbar(page));
    }
});
