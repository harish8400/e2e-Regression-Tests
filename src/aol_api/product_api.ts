import { APIRequestContext } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';


export class ProductApi extends BaseDltaAolApi {

    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async getInvestmentPerformance(productId: string) {
        let response = await this.get(`/product/${productId}/investment/performance/historic`);
        return await response.json();
    }

    async postInvestmentPerformance(fundProductId: string, payload: InvestmentPerformancePayload) {
        let response = await this.post(`/product/${fundProductId}/investment/performance/historic/batch`, JSON.stringify(payload));
        return await response.json();
    }

};

export interface InvestmentPerformancePayload {
    prices: Array<InvestmentPerformancePrice>
}

export interface InvestmentPerformancePrice {
    applicationPrice: number,
    investmentId: string,
    midPrice: number,
    redemptionPrice: number,
    referenceDate: string,
    traderName: string
}