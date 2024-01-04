import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL } from "../../../src/aol/utils_aol";

/**This test create a pension shell account */
test("Create a Pension Shell ABP account - Reached age 65 @pension", async ({ pensionAccountPage }) => {

    await allure.suite("Pension");
    test.setTimeout(600000);
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);

})
