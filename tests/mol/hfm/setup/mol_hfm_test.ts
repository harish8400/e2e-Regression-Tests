import { Page, test as base } from "@playwright/test";
import { LoginPage } from '../../../../src/mol/hfm/pom/login_page';
import { ACCOUNT_OPTION, DashboardPage } from '../../../../src/mol/hfm/pom/dashboard_page';
import { BeneficiariesPage } from '../../../../src/mol/hfm/pom/beneficiaries_page';
import { InvestmentsPage } from '../../../../src/mol/hfm/pom/investments_page';
import { InsurancePage } from '../../../../src/mol/hfm/pom/insurance_page';
import { molBaseTest } from '../../common/setup/mol_base_test';
import { PensionPage } from "../../../../src/mol/hfm/pom/pension_page";
import { FUND_IDS } from "../../../../constants";
import { DocumentsPage } from "../../../../src/mol/hfm/pom/documents_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { TransactionsPage } from "../../../../src/mol/hfm/pom/transactions_page";

type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    beneficiariesPage: BeneficiariesPage;
    investmentsPage: InvestmentsPage;
    insurancePage: InsurancePage;
    pensionPage: PensionPage;
    documentsPage: DocumentsPage;
    transactionsPage: TransactionsPage;
};

//User not logged in
export const hfmMolLogin = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();

        if (ENVIRONMENT_CONFIG.name === "dev") {
            await setMolApiVersionLocalStorage(page);
        }

        await use(loginPage);
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

        if (ENVIRONMENT_CONFIG.name === "dev") {
            await setMolApiVersionLocalStorage(page);
        }

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
    },

    documentsPage: async ({ page }, use) => {
        await use(new DocumentsPage(page));
    },

    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page));
    },

    //test options
    fundIds: async ({ }, use) => { await use(FUND_IDS.MERCY) },
});

export const molHfmAccumTest = molHfmAuthenticatedUserTest.extend({
    //test options
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
    memberId: async ({ dashboardPage, fundIds }, use) => {
        let accounts = await dashboardPage.doAccountsGet();
        await use(accounts.find(account => account.fundProductId === fundIds.PRODUCT_ID.RETIREMENT)!!.memberId!!);
    }
});


async function setMolApiVersionLocalStorage(page: Page) {
    const apiVersion = ENVIRONMENT_CONFIG.molHfmMolApiVersion;
    if (apiVersion === undefined) {
        throw new Error("'molHfmMolApiVersion' is not defined in environment config");
    }
    await page.evaluate((molApiVersion) => { window.localStorage.setItem("mol-api-version", molApiVersion) }, apiVersion);
    await page.reload();
}
