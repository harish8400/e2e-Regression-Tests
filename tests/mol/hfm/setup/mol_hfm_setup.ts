import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { hfmMolLogin as setup } from "./mol_hfm_test";

setup("Login and save storage", async ({ loginPage, dashboardPage }) => {
    setup.info().annotations.push({ type: "environment", description: ENVIRONMENT_CONFIG.name })

    await loginPage.goTo();
    await loginPage.doLogin(process.env.MOL_USERNAME!!, process.env.MOL_PASSWORD!!);
    await dashboardPage.navigateToInvestments();
    await dashboardPage.saveSessionStorage();
});