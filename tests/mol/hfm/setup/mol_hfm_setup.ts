import { ENVIRONMENT_CONFIG } from "../../../../config/environment_config";
import { ParametersUtils } from "../../../../src/utils/parameters_utils";
import { molHfmLogin as setup } from "./mol_hfm_test";

setup("Login and save storage", async ({ loginPage, dashboardPage }) => {
    setup.info().annotations.push({ type: "environment", description: ENVIRONMENT_CONFIG.name })

    let username;
    let password;
    if (process.env.BUILDKITE) {
        username = await ParametersUtils.getQualityParamValue("e2e/HFM_MOL_USERNAME");
        password = await ParametersUtils.getQualityParamValue("e2e/HFM_MOL_PASSWORD");
    } else {
        username = process.env.MOL_USERNAME
        password = process.env.MOL_PASSWORD
    }

    await loginPage.doLogin(username!!, password!!);
    await dashboardPage.navigateToInvestments();
    await dashboardPage.saveSessionStorage();
});