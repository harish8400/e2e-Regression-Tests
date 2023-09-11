import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";

export abstract class MolBasePage extends BasePage {
    readonly messageItem: Locator;

    constructor(page: Page) {
        super(page);

        this.messageItem = page.locator('div[data-cy="message-item"]');
    }

    async doAccountsGet(baseUrl: string, headers: { [key: string]: string }, molApiVerion?: string) {
        let apiUrl = baseUrl + "/v1/identities/current/accounts";
        if (molApiVerion) {
            apiUrl = apiUrl + `?mol-api-version=${molApiVerion}`;
        }

        let response = await this.page.request.get(apiUrl, {
            headers: headers
        });

        let accounts = await response.json() as Array<Account>;
        return accounts;
    }

}

export interface Account {
    memberId: string,
    memberNo: string,
    productReference: string,
    productType: string,
    fundProductId: string,
    productPhase: string
};