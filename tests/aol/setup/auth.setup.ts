import { test as setup, expect } from '@playwright/test';
import { Admins } from '../../../src/aol/data/admins';
import { ENVIRONMENT_CONFIG } from '../../../config/environment_config';
import { allure } from "allure-playwright";
import { fundName } from '../../../src/aol/utils_aol';



const authFile = 'playwright/.auth/user.json';
setup(fundName() + "authenticate", async ({ page }) => {
    await allure.parentSuite("Login"); 
    let authToken: string | null = null; 
    page.on('request', async (request) => {
        const url = request.url();
        const headers = request.headers();
        const authorization = headers['authorization'];
        if (url.startsWith('https://middleware-saturn.dev.tinasuper.com/users/me') && authorization) {
            authToken = authorization;
           process.env.TOKEN = authToken;
        }
    });   

    
    // Perform authentication steps. Replace these actions with your own.
    let admin = Admins.getAdminByUsername("admin@tinasuper.com");
    await page.goto(ENVIRONMENT_CONFIG.aolURL);
    await page.getByRole('button').nth(2).click();
    await page.getByPlaceholder('user@company.com').fill(admin.username);
    await page.getByPlaceholder('Your password').fill(admin.password);
    await page.keyboard.press('Tab');
    await page.getByRole('button', { name: 'Log in' }).click();
    // Wait until the page receives the cookies.
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    //await page.waitForURL('https://github.com/');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    await new Promise(resolve => setTimeout(resolve, 4000));
    await expect(page.getByText('Open Cases', { exact: true })).toBeVisible();
    await page.context().storageState({ path: authFile });
});