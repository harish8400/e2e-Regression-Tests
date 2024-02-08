import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { UtilsAOL } from "../../../src/aol/utils_aol";
import * as memberData from "../../../src/aol/data/pension_data.json";
import { FUND } from "../../../constants";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
});

test(`Create a Pension Shell ABP account - Reached age 65 @pensiondemo '${process.env.PRODUCT}'`, async ({ navBar, pensionAccountPage, memberPage }) => {

    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);

    navBar.navigateToPensionMembersPage();
    let uniqueSurname = UtilsAOL.randomSurname(5);
    await pensionAccountPage.createShellAccount(uniqueSurname);
    await memberPage.selectMember(uniqueSurname);

})

test("Manual Roll-in - Pension Member @pension @pensiondemo @pensiondemovanguard", async ({ navBar, pensionTransactionPage }) => {

    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);

    await navBar.navigateToPensionMembersPage();

    let member = memberData.pension.Manual_Rollin;
    switch (process.env.PRODUCT) {
        case FUND.VANGUARD:
            member = memberData.pension_vangaurd.Manual_Rollin;
        case FUND.AE:
            member = memberData.pension_vangaurd.Manual_Rollin;
    }

    await navBar.selectMember(member);
    await pensionTransactionPage.rollInTransaction();

})

test(`Pension draw-down as Specific order @pension @pensiondemo @pensiondemovanguard '${process.env.PRODUCT}'`, async ({ navBar, pensionInvestmentPage }) => {
    try {

        await allure.suite("Pension");
        await allure.parentSuite(process.env.PRODUCT!);

        await navBar.selectProduct();
        await navBar.navigateToPensionMembersPage();

        let member = memberData.pension.Pension_Drawdown_Change;
        switch (process.env.PRODUCT) {
            case FUND.VANGUARD:
            member = memberData.pension_vangaurd.Pension_Drawdown_Change;
            case FUND.AE:
            member = memberData.pension_vangaurd.Pension_Drawdown_Change;
        }
        
        await navBar.selectMember(member);

        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();

    } catch (error) {
        throw error;
    }
})

test("ABP Rollover Out Commutation - Partial @pensiondemo", async ({ navBar, pensionTransactionPage }) => {

    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);

    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();

    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    switch (process.env.PRODUCT!) {
        case FUND.VANGUARD:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
        case FUND.AE:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
    }
    await navBar.selectMember(member);

    await pensionTransactionPage.commutationRolloverOut(false);

})

test("ABP Rollover Out Commutation - Full exit @pensiondemo", async ({ navBar, pensionTransactionPage }) => {

    test.setTimeout(600000);
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
    
    await navBar.selectProduct();
    await navBar.navigateToPensionMembersPage();

    let member = memberData.pension.ABP_Commutation_Rollout_Fullexit_Member_Number;
    switch (process.env.PRODUCT!) {
        case FUND.VANGUARD:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
        case FUND.AE:
            member = memberData.pension_vangaurd.ABP_Commutation_Rollout_Fullexit_Member_Number;
    }

    await navBar.selectMember(member);
    //await pensionTransactionPage.commutationRolloverOut(true);

})
