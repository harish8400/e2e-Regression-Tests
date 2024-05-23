import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";

export const test = base.extend<{apiRequestContext: APIRequestContext;}>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

/** Test Case: Maintain Income Stream Account: Bank account details (Edit) */
test(fundName()+"- Maintain Income Stream Account (documentation required): Bank account details", async ({ navBar , accountInfoPage ,pensionAccountPage ,apiRequestContext ,pensionTransactionPage}) => {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await accountInfoPage.editBankAccount();   
})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Monthly' */
test(fundName()+"- Maintain Income Steam Account - Payment details (payment amount, frequency, payment draw down options)", async ({ navBar , pensionAccountPage ,pensionTransactionPage ,apiRequestContext}) => {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await pensionAccountPage.editPaymentDetails();    
})

/** Test Case: Maintain Income Stream Account: Edit Payment details freqeuncy 'Quarterly' */
test(fundName()+"- Verify Pension Payment is executed successful for Half-yearly frequency", async ({ navBar , pensionAccountPage ,pensionTransactionPage, apiRequestContext }) => {
           
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await pensionAccountPage.editPaymentDetails('Bi-Annualy');
})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Annually' */
test(fundName()+"- Verify Pension Payment is executed successful for Quarterly frequency", async ({ navBar , pensionAccountPage ,pensionTransactionPage ,apiRequestContext}) => {
            await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await pensionAccountPage.editPaymentDetails('Quartely');
})
