import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs member creation tests */
test(fundName()+"-Verify a new Active Member Account is created successfully and welcome letter is triggered", async ({ memberPage, navBar }) => {
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(false, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
})

test(fundName()+"-Verify new member creation without TFN and welcome letter is triggered", async ({ memberPage, navBar }) => {
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
})

test(fundName()+"-Verify creation of a new active member account with Date Joined Fund date earlier than current system date is successful", async ({ memberPage, navBar }) => {
        await navBar.navigateToAccumulationMembersPage();
        let addedMember = await memberPage.addNewMember(true, true, true);
        if(process.env.PRODUCT! == FUND.HESTA){
            await memberPage.selectMember(addedMember);
            await memberPage.verifyIfWelcomeLetterTriggered();
        }else{
            await memberPage.approveMemberCreationProcess(addedMember);
        }
})


