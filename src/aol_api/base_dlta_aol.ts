import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ENVIRONMENT_CONFIG } from "../../config/environment_config";
import {TokenManager} from "./token_manager";

export abstract class BaseDltaAolApi {
    protected readonly userId: string;
    protected readonly requestContext: APIRequestContext;

    constructor(requestContext: APIRequestContext) {
        this.requestContext = requestContext;
        this.userId = this.getJwtUserId();
    }

    private getJwtUserId() {
        const token = TokenManager.getToken();
        if (!token) {
            throw new Error("JWT Token is not available");
        }
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return decoded.user?._id;
    }

    async get(path: string): Promise<APIResponse> {
        return this.handleRequest(this.requestContext.get(path));
    }

    async post(path: string, payloadJsonString: string): Promise<APIResponse> {
        return this.handleRequest(this.requestContext.post(path, { data: payloadJsonString }));
    }

    async put(path: string, payloadJsonString: string): Promise<APIResponse> {
        return this.handleRequest(this.requestContext.put(path, { data: payloadJsonString }));
    }

    async delete(path: string, payloadJsonString: string): Promise<APIResponse> {
        return this.handleRequest(this.requestContext.delete(path, { data: payloadJsonString }));
    }

    private async handleRequest(requestPromise: Promise<APIResponse>): Promise<APIResponse> {
        const response = await requestPromise;
        if (!response.ok()) {
            throw new Error(`Got response status: '${response.status()}', ${response.statusText()}. URL: ${response.url()}`);
        }
        return response;
    }
}

export async function initDltaApiContext() {
    // You can modify the token retrieval logic based on your requirements
    const jwt = TokenManager.getToken();

    // Ensure that a valid JWT is available
    if (!jwt) {
        throw new Error("JWT Token is not available. Please check TokenManager logic.");
    }

    const context = await request.newContext({
        baseURL: ENVIRONMENT_CONFIG.dltaApiURL,
        extraHTTPHeaders: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        // Workaround for not being able to add custom certs to playwright yet https://github.com/microsoft/playwright/issues/14663
        ignoreHTTPSErrors: true,
    });

    return context;
}
