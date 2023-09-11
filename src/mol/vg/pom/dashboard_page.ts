import { Page } from "@playwright/test";
import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { MolDashboardBasePage } from "../../common/pom/mol_dashboard_base_page";
import { SideNavbar } from "./components/side_navbar";

export class DashboardPage extends MolDashboardBasePage {
    protected override readonly url: string;

    readonly sideNavbar: SideNavbar;

    constructor(page: Page) {
        super(page);

        this.url = ENVIRONMENT_CONFIG.molVgURL + "/web-component/#/dashboard";

        this.sideNavbar = new SideNavbar(page);
    }

    //TODO: resolve duplication withd oAccountsGet() in  LoginPage
    async doAccountsGet() {
        let headers = await this.assembleHeaderForApiRequest();
        let apiVersion = undefined;
        if (ENVIRONMENT_CONFIG.name === "dev") {
            apiVersion = ENVIRONMENT_CONFIG.molVgMolApiVersion;
        }

        let accounts = await super.doAccountsGet(ENVIRONMENT_CONFIG.molVgApiURL, headers, apiVersion);
        return accounts;
    }

    private async assembleHeaderForApiRequest() {
        let accessToken = await this.page.evaluate(() => JSON.parse(localStorage.getItem("okta-token-storage")!!).accessToken.accessToken);
        let headers = {
            "Authorization": `Bearer ${accessToken}`
        };
        return headers;
    }

}
