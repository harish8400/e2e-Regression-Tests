import { Page } from "@playwright/test";
import path from "path";
import fs from "fs"

export abstract class BasePage {

    private readonly AUTH_DIRECTORY = path.join(__dirname, '../../../playwright/.auth');

    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async reload() {
        await this.page.reload();
    }

    async sleep(miliseconds: number) {
        await this.page.waitForTimeout(miliseconds);
    }

    async saveSessionAndLocalStorage(fileName: string) {
        let sessionStorage: string = await this.page.evaluate(() => sessionStorage);
        let localStorage: string = await this.page.evaluate(() => localStorage);
        let storage = {
            sessionStorage: sessionStorage,
            localStorage: localStorage
        };

        if (!fs.existsSync(this.AUTH_DIRECTORY)) {
            fs.mkdirSync(this.AUTH_DIRECTORY, { recursive: true });
        }

        let filePath = `${this.AUTH_DIRECTORY}/${fileName}`;
        fs.writeFileSync(filePath, JSON.stringify(storage));
    }

    async addSessionAndLocalStorage(fileName: string) {
        let filePath = `${this.AUTH_DIRECTORY}/${fileName}`;
        let storage = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        let sessionStorage: JSON = await storage.sessionStorage;
        await this.page.evaluate((ss) => {
            for (const [key, value] of Object.entries(ss)) {
                window.sessionStorage.setItem(key, value);
            }
        }, sessionStorage)

        let localStorage: JSON = await storage.localStorage;
        await this.page.evaluate((ls) => {
            for (const [key, value] of Object.entries(ls)) {
                window.localStorage.setItem(key, value);
            }
        }, localStorage)
    }

}