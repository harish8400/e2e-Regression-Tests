import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(60000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs member creation tests */
test(fundName()+"-Verify a new Active Member Account is created successfully and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        await test.step("Create a new Active member & Verify welcome letter is triggered", async () => {
            let addedMember = await memberPage.addNewMember(false, true);
            if(process.env.PRODUCT! == FUND.HESTA){
                await memberPage.selectMember(addedMember);
                await memberPage.verifyIfWelcomeLetterTriggered();
            }else{
                await memberPage.approveMemberCreationProcess(addedMember);
            }
        })
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify new member creation without TFN and welcome letter is triggered", async ({ memberPage, navBar }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
        
        await test.step("Create a new member without TFN & Verify welcome letter is triggered", async () => {
            let addedMember = await memberPage.addNewMember(true, true);
            if(process.env.PRODUCT! == FUND.HESTA){
                await memberPage.selectMember(addedMember);
                await memberPage.verifyIfWelcomeLetterTriggered();
            }else{
                await memberPage.approveMemberCreationProcess(addedMember);
            }
        })
        
    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify creation of a new active member account with Date Joined Fund date earlier than current system date is successful", async ({ memberPage, navBar }) => {

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
        
        await test.step("Create a new member without TFN & Verify welcome letter is triggered", async () => {
            let addedMember = await memberPage.addNewMember(true, true, true);
            if(process.env.PRODUCT! == FUND.HESTA){
                await memberPage.selectMember(addedMember);
                await memberPage.verifyIfWelcomeLetterTriggered();
            }else{
                await memberPage.approveMemberCreationProcess(addedMember);
            }
        })

    } catch (error) {
        throw error;
    }
})


