import { APIRequestContext, expect } from '@playwright/test';
import { BaseDltaAolApi } from '../base_dlta_aol';
import { DateUtils } from "../../utils/date_utils";

export class TransactionsApiHandler {
    static async fetchTransactionDetails(apiRequestContext: APIRequestContext, rollinId?: string) {
        const transactions = new Transactions(apiRequestContext);
        return transactions.fetchTransactionDetails(rollinId!);
    }

    static async fetchPaymentDetails(apiRequestContext: APIRequestContext, paymentId?: string) {
        const transactions = new Transactions(apiRequestContext);
        return transactions.fetchPaymentDetails(paymentId!);
    }
}

export class Transactions extends BaseDltaAolApi {
    constructor(apiRequestContext: APIRequestContext) {
        super(apiRequestContext);
    }

    async fetchTransactionDetails(rollinId: string) {
        const today = new Date();

        const response = await this.get(`transaction/rollin/${rollinId}`);
        const responseBody = await response.json();
        expect(responseBody.amount, `Expected amount to be 50000, and we got ${responseBody.amount}`).toBe(50000);
        expect(responseBody.category, `Expected category to be "Roll In", and we got ${responseBody.category}`).toEqual("Roll In");
        expect(responseBody.type, `Expected type to be "RLI", and we got ${responseBody.type}`).toEqual("RLI");
        expect(responseBody.effectiveDate, `Expected effective date to be ${DateUtils.localISOStringDate(today)}, and we got ${responseBody.effectiveDate}`).toEqual(DateUtils.localISOStringDate(today));
        expect(responseBody.paymentReceivedDate, `Expected payment received date to be defined, and it was not`).toBeDefined();
        expect(responseBody.effectiveDate, `Expected effective date to equal payment received date, but they were different`).toEqual(responseBody.paymentReceivedDate);
        expect(responseBody.messageType, `Expected message type to be "Client-RTR", and we got ${responseBody.messageType}`).toEqual("Client-RTR");
        expect(responseBody.transferringFundName, `Expected transferring fund name to be "AustralianSuper", and we got ${responseBody.transferringFundName}`).toEqual("AustralianSuper");
        expect(responseBody.paymentReference, `Expected payment reference to be "ABP-Full", and we got ${responseBody.paymentReference}`).toEqual("ABP-Full");

        return responseBody;
    }

    async fetchPaymentDetails(paymentId: string) {

        const response = await this.get(`payment/${paymentId}`);
        const responseBody = await response.json();

        // Perform assertions on the response body fields
        expect(responseBody.amount).toBeLessThan(0);
        expect(responseBody.category, `Expected category to be "Payment", and we got ${responseBody.category}`).toEqual("Payment");
        expect(responseBody.type, `Expected type to be "UNPCBP", and we got ${responseBody.type}`).toEqual("UNPCBP");
        return responseBody;
    }

}
