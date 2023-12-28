import { test as base } from '@playwright/test';
import { LoginPage } from './pom/login_page';
import { DashboardPage } from './pom/dashboard_page';
import { MemberPage } from './pom/member_page';
import { MemberTransactionsPage } from './pom/member_transaction';
import{CommutationPayment} from './pom/commutation_payment_rollout';
import{PensionShellAccount} from "./pom/pension_shell_account"
type ExtensionFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage
    memberPage: MemberPage
    memberTransactionPage: MemberTransactionsPage
    pensionShellAccount:PensionShellAccount
    commutationPayment:CommutationPayment
}

export const aolTest = base.extend<ExtensionFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    memberPage: async ({ page }, use) => {
        await use(new MemberPage(page));
    },

    memberTransactionPage: async ({ page }, use) => {
        await use(new MemberTransactionsPage(page));
    },

    pensionShellAccount:  async ({ page }, use) => {
        await use(new PensionShellAccount(page));
    },

    commutationPayment: async ({ page }, use) => {
        await use(new CommutationPayment(page));
    },
})
