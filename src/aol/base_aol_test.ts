import { APIRequestContext,test as base } from '@playwright/test';
import { LoginPage } from './pom/login_page';
import { DashboardPage } from './pom/dashboard_page';
import { MemberPage } from './pom/member_page';
import { MemberTransactionsPage } from './pom/member_transaction';
import{PensionTransactionPage} from './pom/Pension/pension_transaction_page';
import{PensionShellAccount as PensionShellAccountPage} from "./pom/Pension/pension_account_page"
import { Navbar } from './pom/component/navbar';
import { PensionInvestmentPage } from './pom/Pension/pension_investment_page';
import { InternalTransferPage } from './pom/Pension/internal_transfer';
import { AccountInfoPage } from './pom/Pension/account_info';
import { BeneficiaryPage } from './pom/beneficiary_page';
import { InsurancePage } from './pom/insurance_page';
import { Transactions } from '../aol_api/handler/transaction_api_handler';
import { initDltaApiContext } from '../aol_api/base_dlta_aol';
import { RelatedInformationPage } from './pom/member/related_information_page';
import { InvestmentsAndPricing } from './pom/investment_and_pricing_page';
import { MemberOverView } from './pom/member/member_overview';

type ExtensionFixtures = {
    loginPage: LoginPage;
    navBar: Navbar
    dashboardPage: DashboardPage
    memberPage: MemberPage
    memberTransactionPage: MemberTransactionsPage
    pensionAccountPage:PensionShellAccountPage
    pensionTransactionPage:PensionTransactionPage
    pensionInvestmentPage: PensionInvestmentPage
    internalTransferPage: InternalTransferPage
    accountInfoPage: AccountInfoPage
    beneficiaryPage: BeneficiaryPage
    insurancePage: InsurancePage
    relatedInformationPage: RelatedInformationPage;
    investmentsAndPricing: InvestmentsAndPricing;
    memberOverviewpage: MemberOverView;
    transactions:Transactions
    dltaApiRequestContext: APIRequestContext;
}

export const aolTest = base.extend<ExtensionFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    navBar: async ({ page }, use) => {
        await use(new Navbar(page));
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

    pensionAccountPage:  async ({ page }, use) => {
        await use(new PensionShellAccountPage(page));
    },

    pensionTransactionPage: async ({ page }, use) => {
        await use(new PensionTransactionPage(page));
    },

    pensionInvestmentPage: async ({ page }, use) => {
        await use(new PensionInvestmentPage(page));
    },

    internalTransferPage: async ({ page }, use) => {
        await use(new InternalTransferPage(page));
    },
    accountInfoPage: async ({ page }, use) => {
        await use(new AccountInfoPage(page));
    },
    beneficiaryPage: async ({ page }, use) => {
        await use(new BeneficiaryPage(page));
    },
    insurancePage: async ({ page }, use) => {
        await use(new InsurancePage(page));
    },
    relatedInformationPage: async ({ page }, use) => {
        await use(new RelatedInformationPage(page));
    },
    investmentsAndPricing: async ({ page }, use) => {
        await use(new InvestmentsAndPricing(page));
    },
    memberOverviewpage: async ({ page }, use) => {
        await use(new MemberOverView(page));
    },
    dltaApiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
    transactions: async ({ dltaApiRequestContext }, use) => {
        await use(new Transactions(dltaApiRequestContext));
    },
})
