import { aolTest as test } from "../../src/aol/base_aol_test";

test("AOL login @aol", async ({ loginPage }) => {
    await loginPage.navigateTo();
    await loginPage.doLogin("username", "password");
})