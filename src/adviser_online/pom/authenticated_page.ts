import { Page } from "@playwright/test";
import { Navbar } from "./component/navbar";
import { BasePage } from "../../common/pom/base_page";


export abstract class AuthenticatedPage extends BasePage {

    readonly navbar: Navbar;

    constructor(page: Page) {
        super(page);

        this.navbar = new Navbar(page);
    }

    async doLogout() {
        await this.navbar.doLogout();
    }

}