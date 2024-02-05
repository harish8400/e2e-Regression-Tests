import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs member creation tests */
test("Verify a new Active Member Account is created successfully and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false);
        await memberPage.selectMember(addedMember);
        await memberPage.verifyIfWelcomeLetterTriggered();

    } catch (error) {
        throw error;
    }

})

test("Verify new member creation without TFN and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {

        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true);
        await memberPage.selectMember(addedMember);
        await memberPage.verifyIfWelcomeLetterTriggered();

    } catch (error) {
        throw error;
    }

})