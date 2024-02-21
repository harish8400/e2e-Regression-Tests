import { APIRequestContext } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';

import { DateUtils } from '../utils/date_utils';
import { fundDetails } from '../aol/utils_aol';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';

export class RollinApi extends BaseDltaAolApi {

  readonly today: Date;
  

  constructor(apiRequestContext: APIRequestContext) {
    super(apiRequestContext);
    this.today = new Date();
  }

  async createRollin(linearId: string):  Promise<{ linearId: string, memberNo: string }> {
    let {investmentId } = fundDetails(ENVIRONMENT_CONFIG.product);
    let path = `member/${linearId}/rollin`;
    let data = {
      "paymentReference": "InternalTransfer_902010134",
      "transferringFundABN": "11789425178",
      "transferringFundUSI": "11789425178799",
      "transferringClientIdentifier": "902010134",
      "amount": "50000",
      "preserved": "50000",
      "restrictedNonPreserved": "0",
      "unrestrictedNonPreserved": "0",
      "kiwiPreserved": "0",
      "taxed": "50000",
      "untaxed": "0",
      "taxFree": "0",
      "kiwiTaxFree": "0",
      "type": "RLI",
      "paymentReceivedDate": `${DateUtils.localISOStringDate(this.today)}`,
      "eligibleServicePeriodStartDate": null,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "messageType": null,
      "historic": true,
      "caseReference": null,
      "targetInvestments": [
        {
            id: investmentId,
          "percent": 100
        }
      ]
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let resultLinearId = responseBody?.linearId?.id || null;
    let memberNo = responseBody?.memberNo || null;
    return { linearId: resultLinearId, memberNo: memberNo };
  }

}
