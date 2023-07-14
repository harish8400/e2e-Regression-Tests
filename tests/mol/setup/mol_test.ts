import { APIRequestContext, test as base } from '@playwright/test';
import { LoginPage } from '../../../src/mol/pom/login_page';
import { DashboardPage } from '../../../src/mol/pom/dashboard_page';
import { BeneficiariesPage } from '../../../src/mol/pom/beneficiaries_page';
import { MemberApi } from '../../../src/dlta/api/member_api';
import { CaseApi } from '../../../src/dlta/api/case_api';
import { initDltaApiContext } from '../../../src/dlta/api/base_dlta_api';
import { InvestmentsPage } from '../../../src/mol/pom/investments_page';
import { InsurancePage } from '../../../src/mol/pom/insurance_page';


type Pages = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    beneficiariesPage: BeneficiariesPage;
    investmentsPage: InvestmentsPage;
    insurancePage: InsurancePage;
};

type DltaApi = {
    dltaApiRequestContext: APIRequestContext;
    memberApi: MemberApi;
    caseApi: CaseApi;
};

//User not logged in
export const molTest = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    }
});

//User previously logged in and sessionStorage has been saved
export const molAuthenticatedUserTest = base.extend<Pages & DltaApi>({
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

    //api
    dltaApiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },

    memberApi: async ({ dltaApiRequestContext }, use) => {
        await use(new MemberApi(dltaApiRequestContext));
    },

    caseApi: async ({ dltaApiRequestContext }, use) => {
        await use(new CaseApi(dltaApiRequestContext));
    }
});