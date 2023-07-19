import { test as base } from "@playwright/test";
import { LoginPage } from '../../../../src/mol/pom/login_page';
import { ACCOUNT_OPTION, DashboardPage } from '../../../../src/mol/pom/dashboard_page';
import { BeneficiariesPage } from '../../../../src/mol/pom/beneficiaries_page';
import { InvestmentsPage } from '../../../../src/mol/pom/investments_page';
import { InsurancePage } from '../../../../src/mol/pom/insurance_page';
import { molBaseTest } from '../../common/setup/mol_base_test';
import { FUND_IDS } from "../../../../types";
import { PensionPage } from "../../../../src/mol/pom/pension_page";

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    beneficiariesPage: BeneficiariesPage;
    investmentsPage: InvestmentsPage;
    insurancePage: InsurancePage;
    pensionPage: PensionPage;
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
const molHfmAuthenticatedUserTest = molBaseTest.extend<Pages>({
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

    pensionPage: async ({ page }, use) => {
        await use(new PensionPage(page));
    }
});

export const molHfmAccumTest = molHfmAuthenticatedUserTest.extend({
    //test options
    fundIds: async ({ }, use) => { await use(FUND_IDS.MERCY) },

    memberId: async ({ dashboardPage, fundIds }, use) => {
        let accounts = await dashboardPage.doAccountsGet();
        await use(accounts.find(account => account.fundProductId === fundIds.PRODUCT_ID.ACCUMULATION)!!.memberId!!);
    }
});

export const molHfmPensionTest = molHfmAuthenticatedUserTest.extend({
    //pom
    dashboardPage: async ({ dashboardPage }, use) => {
        await dashboardPage.selectAccount(ACCOUNT_OPTION.RETIREMENT);

        await use(dashboardPage);
    },

    //test options
    fundIds: async ({ }, use) => { await use(FUND_IDS.MERCY) },

    memberId: async ({ dashboardPage, fundIds }, use) => {
        let accounts = await dashboardPage.doAccountsGet();
        await use(accounts.find(account => account.fundProductId === fundIds.PRODUCT_ID.RETIREMENT)!!.memberId!!);
    }
});