import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
// import { AssertionError } from "assert";
// import * as memberData from "../../../src/aol/data/pension_data.json";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { AssertionError } from "assert";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";


export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
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


test(fundName() + "-Internal Transfer from Accumulation to ABP-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage }) => {

    try {
        await navBar.navigateToAccumulationMembersPage();
        const { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        await pensionAccountPage.createShellAccountExistingMember(createMemberNo);
        await pensionAccountPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo);
        await pensionAccountPage.retirement()
        await internalTransferPage.internalTransferMember('Accumulation', createMemberNo);
        await pensionTransactionPage.transactionView();
        await pensionTransactionPage.sleep(5000)

    } catch (Error) {
        throw Error;
    }

})

test(fundName() + "-Internal Transfer from ABP to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {

    try {
        await navBar.navigateToPensionMembersPage();
        let { memberNo, surname } = await pensionTransactionPage.accumulationAccount(navBar, pensionAccountPage, apiRequestContext);
        await internalTransferPage.internalTransferProcess(true, false);
        await navBar.selectMemberSurName(surname);
        await internalTransferPage.internalTransferMember('ABP', memberNo);
        await internalTransferPage.transferOut();
        await pensionTransactionPage.transactions();
        await pensionTransactionPage.sleep(5000)
    } catch (Error) {
        throw new AssertionError({ message: "Test Execution Failed : Internal Transfer from ABP to Accumulation has failed" });
    }


})

test(fundName() + "-Validate Retirement Transition process is successful where PTB transaction is processed on TTR account prior to conversion", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, internalTransferPage }) => {

    try {
        //navigating to TTR source member and verifying PTB
        await navBar.navigateToTTRMembersPage();
        await ShellAccountApiHandler.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
        await pensionTransactionPage.verifyPTBtransaction(true);

        //Initiating internal transfer from source TTR to ABP
        let { memberNo, surname } = await ShellAccountApiHandler.process(navBar, pensionAccountPage, apiRequestContext);
        await pensionAccountPage.createShellAccountExistingMember(memberNo);
        await pensionAccountPage.reload();
        await navBar.selectMemberSurName(surname);
        await internalTransferPage.internalTransferMember('TTR', memberNo);
        await pensionTransactionPage.transactionView();
    } catch (error) {
        throw error;
    }

})

test(fundName() + "-Validate Retirement Transition process completes successfully on TTR account with CoR and NO PTB transaction", async ({ navBar, pensionAccountPage, apiRequestContext, internalTransferPage, relatedInformationPage, pensionTransactionPage }) => {

    try {
        //navigating to TTR source member and adding condition of release
        await navBar.navigateToTTRMembersPage();
        await ShellAccountApiHandler.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
        await pensionTransactionPage.verifyPTBtransaction(false);
        await relatedInformationPage.addConditionOfRelease();

        //navigating to ABP destination member and initiating internal transfer from source TTR to ABP
        let { memberNo, surname } = await ShellAccountApiHandler.process(navBar, pensionAccountPage, apiRequestContext);
        await pensionAccountPage.createShellAccountExistingMember(memberNo);
        await pensionAccountPage.reload();
        await navBar.selectMemberSurName(surname);
        await internalTransferPage.internalTransferMember('TTR', memberNo);
        await pensionTransactionPage.transactionView();
    } catch (error) {
        throw error;
    }

})

