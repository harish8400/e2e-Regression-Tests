import { InvestmentPerformancePayload, ProductApi } from "../product_api";
import { DataUtils } from "../../../utils/data_utils";

export class ProductApiHandler {

    static async uploadHfmAccumUnitPrices(productApi: ProductApi, productId: string, referenceDate: string) {
        let content = DataUtils.getSubstitutedFileContent("hfm_accum_prices.json", new Map([["referenceDate", referenceDate]]));
        let payload = JSON.parse(content) as InvestmentPerformancePayload;
        await productApi.postInvestmentPerformance(productId, payload);
    }

}