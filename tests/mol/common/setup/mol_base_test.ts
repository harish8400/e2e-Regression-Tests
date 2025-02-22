import { APIRequestContext, Page, test as base } from "@playwright/test";
import { initDltaApiContext } from "../../../../src/dlta/api/base_dlta_api";
import { MemberApi } from "../../../../src/dlta/api/member_api";
import { CaseApi } from "../../../../src/dlta/api/case_api";
import { ProductApi } from "../../../../src/dlta/api/product_api";
import { ProductAggregationApi } from "../../../../src/dlta/api/product_aggregation_api";

export type DltaApi = {
    dltaApiRequestContext: APIRequestContext;
    memberApi: MemberApi;
    caseApi: CaseApi;
    productApi: ProductApi;
    productAggregationApi: ProductAggregationApi;
};

export type TestContext = {
    fundIds: {
        FUND_ID: string,
        PRODUCT_ID:
        {
            ACCUMULATION: string,
            RETIREMENT?: string,
            TTR?: string
        }
    };

    memberId: string;
};

export const molBaseTest = base.extend<DltaApi & TestContext>({
    dltaApiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },

    memberApi: async ({ dltaApiRequestContext }, use) => {
        await use(new MemberApi(dltaApiRequestContext));
    },

    caseApi: async ({ dltaApiRequestContext }, use) => {
        await use(new CaseApi(dltaApiRequestContext));
    },

    productApi: async ({ dltaApiRequestContext }, use) => {
        await use(new ProductApi(dltaApiRequestContext));
    },

    productAggregationApi: async ({ dltaApiRequestContext }, use) => {
        await use(new ProductAggregationApi(dltaApiRequestContext));
    }
});

export async function setMolApiVersionLocalStorage(page: Page, apiVersion: string) {
    await page.evaluate((molApiVersion) => { window.localStorage.setItem("mol-api-version", molApiVersion) }, apiVersion);
    await page.reload();
}