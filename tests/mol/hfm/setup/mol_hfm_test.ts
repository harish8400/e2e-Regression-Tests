import { test as base } from "@playwright/test";
import { LoginPage } from '../../../../src/mol/pom/login_page';
import { DashboardPage } from '../../../../src/mol/pom/dashboard_page';
import { BeneficiariesPage } from '../../../../src/mol/pom/beneficiaries_page';
import { InvestmentsPage } from '../../../../src/mol/pom/investments_page';
import { InsurancePage } from '../../../../src/mol/pom/insurance_page';
import { molBaseTest } from '../../common/setup/mol_base_test';
import { FUND_IDS } from "../../../../types";

export type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    beneficiariesPage: BeneficiariesPage;
    investmentsPage: InvestmentsPage;
    insurancePage: InsurancePage;
};

//User not logged in
export const hfmMolLogin = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    }
});

//User previously logged in and sessionStorage has been saved
export const molHfmAuthenticatedUserTest = molBaseTest.extend<Pages>({
    //pom
    dashboardPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.addSessionStorage();
        await dashboardPage.goTo();

        await use(dashboardPage);
    },

    beneficiariesPage: async ({ page }, use) => {
        await use(new BeneficiariesPage(page));
    },

    investmentsPage: async ({ page }, use) => {
        await use(new InvestmentsPage(page));
    },

    insurancePage: async ({ page }, use) => {
        await use(new InsurancePage(page));
    },
});

export const molHfmAccumTest = molHfmAuthenticatedUserTest.extend({
    //test options
    fundIds: async ({ }, use) => { await use(FUND_IDS.MERCY) },

    memberId: async ({ dashboardPage, fundIds }, use) => {
        let accounts = await dashboardPage.doAccountsGet();
        use(accounts.find(account => account.fundProductId === fundIds.PRODUCT_ID.ACCUMULATION)!!.memberId!!);
    }
});