import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import {  FUND_IDS } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { DateUtils } from "../../../src/utils/date_utils";
import { ProductApiHandler } from "../../../src/aol_api/handler/product_api_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});



test(fundName() + "-Run unit Prices via API for accumulation ", async ({navBar,investmentsAndPricing }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        await investmentsAndPricing.investmentsList();
        const apiRequestContext: APIRequestContext = await initDltaApiContext();
        let productId = FUND_IDS.VANGUARD.PRODUCT_ID.ACCUMULATION;
        let today = new Date();
        today.setDate(today.getDate() + 1); // Enable this line when we want to run for Vanguard
        let refDate = DateUtils.localISOStringDate(today);
        await ProductApiHandler.uploadHfmAccumUnitPrices(apiRequestContext, productId, refDate);
        await investmentsAndPricing.reload();
    } catch (error) {
        throw error;
    }
})


test(fundName() + "-Run unit Prices via API for pension accounts ", async ({navBar,investmentsAndPricing }) => {
    await navBar.navigateToPensionMembersPage();
    await investmentsAndPricing.investmentsList();
    const apiRequestContext: APIRequestContext = await initDltaApiContext();
    let productId = FUND_IDS.VANGUARD.PRODUCT_ID.RETIREMENT;
    let today = new Date();
    today.setDate(today.getDate() + 1); // Enable this line when we want to run for Vanguard
    let refDate = DateUtils.localISOStringDate(today);
    await ProductApiHandler.uploadHfmAccumUnitPrices(apiRequestContext, productId, refDate);
    await investmentsAndPricing.reload();
})

