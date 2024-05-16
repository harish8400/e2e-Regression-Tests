import { APIRequestContext, expect } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';

import { DateUtils } from '../utils/date_utils';
import { UtilsAOL, fundDetails } from '../aol/utils_aol';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';
import { INVESTMENT_OPTIONS } from '../../constants';

let fundProduct = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;

export class RollinApi extends BaseDltaAolApi {

  readonly today: Date;


  constructor(apiRequestContext: APIRequestContext) {
    super(apiRequestContext);
    this.today = new Date();
  }

  async createRollin(linearId: string): Promise<{ linearId: string, memberNo: string, amount: number }> {
    let investmentId: string;
    let memberInvestmentId:string
        switch (fundProduct) {
            case 'HESTA for Mercy':
            investmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.AUSTRALIAN_SHARES.ID;
            memberInvestmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.BALANCED_GROWTH.ID;
            break;
            case 'Vanguard Super':
            investmentId = INVESTMENT_OPTIONS.VANGUARD.RETIREMENT.AUSTRALIAN_SHARES.ID;
            memberInvestmentId = INVESTMENT_OPTIONS.VANGUARD.RETIREMENT.CONSERVATIVE.ID;
            break;
            default:
                throw new Error(`Unsupported product: ${fundProduct}`);
        }
    let path = `member/${linearId}/rollin`;
    let moneyIn = UtilsAOL.generateMoney();
    let data = {
      "paymentReference": "InternalTransfer_902010134",
      "transferringFundABN": "11789425178",
      "transferringFundUSI": "11789425178799",
      "transferringClientIdentifier": "902010134",
      "amount": moneyIn,
      "preserved": moneyIn,
      "restrictedNonPreserved": "0",
      "unrestrictedNonPreserved": "0",
      "kiwiPreserved": "0",
      "taxed": moneyIn,
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
          "id": investmentId,
              "percent": 50
          },
          {
              "id": memberInvestmentId,
              "percent": 50
          }
      ]
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    const rollIn = responseBody.rollin;
    expect(rollIn.type).toBe('RLI');
    expect(rollIn.name).toBe('Roll In');
    expect(rollIn.historic).toBe(true);
    let Id = responseBody?.linearId?.id || null;
    let memberNo = responseBody?.memberNo || null;
    let amount = responseBody?.amount || 0;
    return { linearId: Id, memberNo: memberNo, amount: amount };
  }

  async validateCommutation(linearId: string, amount: number): Promise<{ linearId: string }> {
    let path = `member/${linearId}/commutation/validate`;
    let data = {
      "commutationType": "BENEFIT",
      "commutationAmount": amount,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "whole": true
    }
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    console.log(responseBody);
    let Id = responseBody?.linearId?.id || null;
    return { linearId: Id };
  }

  async internalTransferOutvalidation(linearId: string,amount: number): Promise<{ linearId: string }> {
    let path = `member/${linearId}/transfer/out/validate`;
    let data = {
      "amount": amount,
      "memberId": linearId,
      "whole": true,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    console.log(responseBody);
    let resultLinearId = responseBody?.linearId?.id || null;
    return { linearId: resultLinearId };
  }

}