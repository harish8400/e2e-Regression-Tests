import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";

export abstract class BaseDltaApi {

    protected readonly userId: string;
    protected requestContext: APIRequestContext;

    constructor(apiRequestContext: APIRequestContext) {
        this.requestContext = apiRequestContext;
        this.userId = this.getJwtUserId();
    }

    protected async get(path: string) {
        let response = await this.requestContext.get(path);
        this.failIfResponseError(response);
        return response;
    }

    protected async post(path: string, jsonString: string) {
        let response = await this.requestContext.post(path, { data: jsonString });
        this.failIfResponseError(response);
        return response;
    }

    private getJwtUserId() {
        let jwt = process.env.DLTA_JWT;
        let decoded = JSON.parse(Buffer.from(jwt!!.split('.')[1], 'base64').toString());
        return decoded.user._id;
    }

    private failIfResponseError(response: APIResponse) {
        if (!response.ok()) {
            throw new Error(`Got response status: '${response.status()}', ${response.statusText()}. URL: ${response.url()}`);
        }
    }

}

export async function initDltaApiContext() {
    const jwt = process.env.DLTA_JWT;
    if (jwt === undefined) {
        throw new Error("DLTA_JWT environment variable not found");
    }

    const context = await request.newContext({
        baseURL: ENVIRONMENT_CONFIG.dltaApiURL,
        extraHTTPHeaders: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        //workaround for not able to add custom certs to playwright yet https://github.com/microsoft/playwright/issues/14663
        ignoreHTTPSErrors: true
    })

    return context;
};