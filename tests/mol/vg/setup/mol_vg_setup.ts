import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { AUTH_USER_FILENAME } from "../../../../constants";
import { DashboardPage } from "../../../../src/mol/vg/pom/dashboard_page";
import { molVgLogin as setup } from "./mol_vg_test";

setup("Login and save storage", async ({ loginPage, oktaLoginPage, page }) => {
    setup.info().annotations.push({ type: "environment", description: ENVIRONMENT_CONFIG.name })

    await loginPage.commenceOktaLogin();
    await oktaLoginPage.doLogin(process.env.OKTA_USERNAME!!.toString(), process.env.OKTA_PASSWORD!!.toString())
    await loginPage.registeredStatus.waitFor({ state: "visible", timeout: 30000 });
    let accounts = await loginPage.doAccountsGet();
    await loginPage.updateSettings(accounts[0].memberId);
    await loginPage.clickWebComponentLink();

    let dashboardPage = new DashboardPage(page);
    await dashboardPage.saveSessionAndLocalStorage(AUTH_USER_FILENAME.MOL_VG);
});
