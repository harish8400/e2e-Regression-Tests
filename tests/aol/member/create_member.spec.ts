import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"

/**This test performs member creation tests */
test("Verify a new Active Member Account is created successfully and welcome letter is triggered", async ({ memberPage, navBar }) => {

    await allure.suite("Member");

    test.setTimeout(600000);

    try {

        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false);
        await memberPage.selectMember(addedMember);
        await memberPage.verifyIfWelcomeLetterTriggered();

    } catch (error) {
        throw error;
    }
})

test("Verify new member creation without TFN and welcome letter is triggered", async ({ memberPage, navBar }) => {

    await allure.suite("Member");

    test.setTimeout(600000);

    try {

        await navBar.selectProduct();
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true);
        await memberPage.selectMember(addedMember);
        await memberPage.verifyIfWelcomeLetterTriggered();

    } catch (error) {
        throw error;
    }
})