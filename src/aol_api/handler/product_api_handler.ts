import { InvestmentPerformancePayload ,ProductApi} from "../product_api";
import { DataUtils } from "../../utils/data_utils";
import { APIRequestContext } from '@playwright/test';

export class ProductApiHandler {

    static async uploadHfmAccumUnitPrices(apiRequestContext: APIRequestContext, fundProductId?: string, referenceDate?: string) {
        const productApi = new ProductApi(apiRequestContext);
    
        if (!fundProductId) {
            throw new Error('fundProductId is required');
        }
    
        const content = DataUtils.getSubstitutedFileContent("hfm_accum_prices.json", new Map([["referenceDate", referenceDate]]));
        const payload = JSON.parse(content) as InvestmentPerformancePayload;
    
        await productApi.postInvestmentPerformance(fundProductId, payload);
    }
}