import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
});

/**This test performs self triggered rollout full exit on a member */
test(fundName()+"-Money Out - Rollover out full exit", async ({ dashboardPage, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await allure.subSuite("Rollover out full exit");

    await test.step("Super Member creation", async () => {
        await dashboardPage.navigateToAccumulationAddMember();
        let addedMember = await memberPage.addNewMember(false, true);
        await memberPage.selectMember(addedMember);
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn();
    })

    await test.step("Rollout full exit", async () => {
        await memberTransactionPage.memberRolloverOut();
    })

})

test(fundName()+"-Rollover In Personal contribution", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn();

})

test(fundName()+"-Rollover out", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn();
    await memberTransactionPage.memberRolloverOut();
    
})

test(fundName() + "Benefit Payment_Retirement - Preservation age_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Retirement - Preservation age", async () => {
        await memberTransactionPage.benefitPayment('Retirement - Preservation Age');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Ceased employment age after 60_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Ceased employment age after 60", async () => {
        await memberTransactionPage.benefitPayment('Ceased employment age after 60');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Age 65 or older_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Age 65 or older", async () => {
        await memberTransactionPage.benefitPayment('Age 65 or older');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Financial Hardship_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Financial Hardship", async () => {
        await memberTransactionPage.benefitPayment('Financial Hardship');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Unrestricted non-preserved benefit_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Unrestricted non-preserved benefit", async () => {
        await memberTransactionPage.benefitPayment('Unrestricted non-preserved benefit');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Compassionate Grounds - Partial_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Compassionate Grounds - Partial", async () => {
        await memberTransactionPage.benefitPayment('Compassionate Grounds - Partial');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Permanent Incapacity_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Permanent Incapacity", async () => {
        await memberTransactionPage.benefitPayment('Permanent Incapacity');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Benefit Payment_Death benefit_Verify claim processed successfully for a member", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Death benefit", async () => {
        await memberTransactionPage.benefitPayment('Death benefit');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})