import { Page, test as base } from "@playwright/test";
import { LoginPage } from "../../../../src/mol/vg/pom/login_page";
import { OktaLoginPage } from "../../../../src/mol/vg/pom/okta_login_page";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { molBaseTest, setMolApiVersionLocalStorage } from "../../common/setup/mol_base_test";
import { AUTH_USER_FILENAME, FUND_IDS } from "../../../../constants";
import { DashboardPage } from "../../../../src/mol/vg/pom/dashboard_page";
import { BeneficiariesPage } from "../../../../src/mol/vg/pom/beneficiaries_page";
import { InvestmentsPage } from "../../../../src/mol/vg/pom/investments_page";
import { InsurancePage } from "../../../../src/mol/vg/pom/insurance_page";
import { TransactionsPage } from "../../../../src/mol/vg/pom/transactions_page";

type Pages = {
    loginPage: LoginPage;
    oktaLoginPage: OktaLoginPage,
    dashboardPage: DashboardPage,
    beneficiariesPage: BeneficiariesPage,
    investmentsPage: InvestmentsPage,
    transactionsPage: TransactionsPage,
    insurancePage: InsurancePage
};

//User not logged in
export const molVgLogin = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();

        if (ENVIRONMENT_CONFIG.name === "dev") {
            await setMolApiVersion(page);
        };

        await use(loginPage);
    },

    oktaLoginPage: async ({ page }, use) => {
        await use(new OktaLoginPage(page));
    }
});

//User previously logged in and sessionStorage has been saved
const molVgAuthenticatedUserTest = molBaseTest.extend<Pages>({
    //pom
    dashboardPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goTo();

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.addSessionAndLocalStorage(AUTH_USER_FILENAME.MOL_VG);
        await dashboardPage.goTo();
        await use(dashboardPage);
    },

    beneficiariesPage: async ({ page }, use) => {
        await use(new BeneficiariesPage(page))
    },

    investmentsPage: async ({ page }, use) => {
        await use(new InvestmentsPage(page))
    },

    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page))
    },

    insurancePage: async ({ page }, use) => {
        await use(new InsurancePage(page))
    },

    //test context
    fundIds: async ({ }, use) => { await use(FUND_IDS.VANGUARD) }
});

export const molVgAccumTest = molVgAuthenticatedUserTest.extend({
    //test context
    memberId: async ({ dashboardPage, fundIds }, use) => {
        let accounts = await dashboardPage.doAccountsGet();
        await use(accounts.find(account => account.fundProductId === fundIds.PRODUCT_ID.ACCUMULATION)!!.memberId!!);
    }
});

async function setMolApiVersion(page: Page) {
    const apiVersion = ENVIRONMENT_CONFIG.molVgMolApiVersion;
    if (apiVersion === undefined) {
        throw new Error("'molVgMolApiVersion' is not defined in environment config");
    };
    setMolApiVersionLocalStorage(page, apiVersion);
}