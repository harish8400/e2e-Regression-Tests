import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { FUND } from "../../../constants";
import * as memberData from "../../../src/aol/data/member.json";


test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

// test(fundName()+"Verify Combined switch is processed successfully for a member with 1 single option to multiple option using current date.", async ({ memberOverviewpage,memberTransactionPage,navBar, memberPage }) => {
//     try {
//         await navBar.navigateToAccumulationMembersPage();
//         let addedMember = await memberPage.addNewMember(false, true);
//         if(process.env.PRODUCT! == FUND.HESTA){
//             await memberPage.selectMember(addedMember);
//             await memberPage.verifyIfWelcomeLetterTriggered();
//         }else{
//             await memberPage.approveMemberCreationProcess(addedMember);
//         }
       
//         await memberOverviewpage.memberAccumulationAccount_Tab.click();
//         await memberTransactionPage.memberRolloverIn();
//         await navBar.navigateToAccumulationMembersPage();
//         await memberPage.clickOnMemberLink();
//         await memberPage.verifyCombinedSwitchProcessedSuccessfully();

//     } catch (error) {
//         throw error;
//     }

// })

test(fundName()+"Verify Combined switch is processed successfully for a member with 1 single option to another single options using current date.", async ({ memberOverviewpage,memberTransactionPage,navBar, memberPage }) => {
      
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
            case FUND.AE:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
        }

        await navBar.selectMember(member);
        await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToAnotherOption();

    } catch (error) {
        throw error;
    } 

})

test(fundName()+"Verify Combined switch is processed successfully for a member with 1 single option to multiple option using current date.", async ({ memberOverviewpage,memberTransactionPage,navBar, memberPage }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
            case FUND.AE:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
        }

        await navBar.selectMember(member);
        await memberPage.verifyCombinedSwitchProcessedSuccessfullyForOneSingleOptionToMultipleOption();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify Combined switch is processed successfully for a more than one option to single option using current date.", async ({ memberOverviewpage,memberTransactionPage,navBar, memberPage }) => {
    try {
        await navBar.navigateToAccumulationMembersPage();
        let member = memberData.Employment.EmployementTerminationMember_Hesta;
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
            case FUND.AE:
                member = memberData.Employment.EmployementTerminationMember_Vanguard;
        }

        await navBar.selectMember(member);
        await memberPage.verifyCombinedSwitchProcessedSuccessfullyForMoreThanOneOptionToSingleOption();

    } catch (error) {
        throw error;
    }
})