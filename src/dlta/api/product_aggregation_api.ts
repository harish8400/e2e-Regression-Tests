import { APIRequestContext } from "@playwright/test";
import { BaseDltaApi } from "./base_dlta_api";

export class ProductAggregationApi extends BaseDltaApi {

    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async getInvestmentPerformanceByRefDate(productId: string, referenceDate: string) {
        let filters = {
            filterGroups: [
                {
                    type: "historicinvestmentperformance",
                    label: `Reference Date is: ${referenceDate}`,
                    filters: [
                        {
                            queryField: "reference_date",
                            equals: referenceDate
                        }
                    ]
                }
            ]
        };
        let response = await this.post(`/product/aggregation/${productId}/investment/performance/historic`, JSON.stringify(filters));

        return await response.json();
    }
};