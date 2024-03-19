import { Page, BrowserContext, Cookie } from '@playwright/test';
import { ENVIRONMENT_CONFIG } from '../../../config/environment_config';
import TokenManager from '../token_manager';
import jwt from 'jsonwebtoken'; 


const authFile = 'playwright/.auth/user.json';

export class AuthPageSetup {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login() {
        await this.page.goto(ENVIRONMENT_CONFIG.dltaApiURL + 'swagger-ui'); // Change the URL here
        const token = TokenManager.getToken();

        await this.page.setExtraHTTPHeaders({
            'Authorization': `Bearer ${token}`,
        });

        // Generate JWT token
        const payload = {
            userId: '3487a450-4388-11eb-961f-f3593a8b7d62',
            username: 'admin',
            // Add any other data you need for testing
        };
        const secretKey = 'yourSecretKey'; // Replace with your actual secret key
        const jwtToken = jwt.sign(payload, secretKey);

        const cookies: Cookie[] = [
            {
                name: '_ga_CHNDKX3YH0@tinasuper.com',
                value: 'GS1.1.1704714368.140.1.1704714486.0.0.0',
                domain: ENVIRONMENT_CONFIG.dltaApiURL,
                path: '/', // Specify the path where the cookie is valid
                expires: 0, // Specify the expiration date as needed
                httpOnly: false, // Specify whether the cookie is HTTP only
                secure: false, // Specify whether the cookie is secure (HTTPS)
                sameSite: 'None', // Specify the SameSite attribute
            },
        ];

        const context: BrowserContext = this.page.context();
        await context.addCookies(cookies);

        await this.page.context().storageState({ path: authFile });
    }
}