import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json";
import * as data from "../../../data/aol_test_data.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await allure.suite("Money_Out");
    await navBar.selectProduct();
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs self triggered rollout full exit on a member */
test(fundName()+"-Money Out - Rollover out full exit @moneyout", async ({ apiRequestContext, accountInfoPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await allure.subSuite("Rollover out full exit");
    let createMemberNo;
    await test.step("Create New Accumulation Account", async () => {
    const memberData = await memberPage.createAccumulationMember(apiRequestContext, accountInfoPage, navBar);
    createMemberNo = memberData.createMemberNo;
    await globalPage.captureScreenshot('Accumulation Account Creation');
    })

    await test.step("Rollover In personal contribution", async () => {
        await memberTransactionPage.memberRolloverIn();
    })

    await test.step("Rollout full exit", async () => {
        await memberTransactionPage.memberRolloverOut(true);
    })

})

test(fundName()+"-Rollover In Personal contribution @moneyout", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");
    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await navBar.selectMemberSurName(addedMember);
    await memberTransactionPage.memberRolloverIn();

})

test(fundName()+"-Rollover out @moneyout", async ({ navBar, memberPage, memberTransactionPage }) => {

    await allure.suite("Money Out");

    await navBar.navigateToAccumulationMembersPage();
    let addedMember = await memberPage.addNewMember(false, true);
    await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn();
    await memberTransactionPage.memberRolloverOut(true);
    
})

test(fundName() + " Benefit Payment_Retirement - Preservation age_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Retirement - Preservation Age', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Ceased employment age after 60_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Ceased employment age after 60', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Age 65 or older_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Age 65 or older', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Financial Hardship_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Financial Hardship', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Unrestricted non-preserved benefit_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Unrestricted non-preserved benefit', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Compassionate Grounds - Partial_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Compassionate Grounds - Partial', false);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Compassionate Grounds - Full_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Compassionate Grounds - Partial', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Permanent Incapacity_Verify claim processed successfully for a member @moneyout", async ({ pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
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
        await memberTransactionPage.benefitPayment('Permanent Incapacity', true);
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Benefit Payment_Death benefit_Verify claim processed successfully for a member @moneyout", async ({ globalPage, pensionAccountPage, pensionTransactionPage, navBar, memberPage, accountInfoPage, internalTransferPage, memberTransactionPage , apiRequestContext }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember( navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
        await navBar.navigateToAccumulationMembersPage();
    })

    await test.step("Select the Accumulation Member & add bank account", async () => {
        await navBar.selectMember(createMemberNo!);
        await accountInfoPage.addNewBankAccount();
    })

    await test.step("Benefit Payment - Death benefit", async () => {
        await pensionTransactionPage.deathBenefitTransaction();
        await globalPage.captureScreenshot('Death Benefit Payment');
    })

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await memberTransactionPage.investmentsComponents('Payment-BPAP');
        await pensionTransactionPage.componentsValidation();

        await memberTransactionPage.investmentsComponents('Benefit Payment-BPA');
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + " Roll Out - With TFN for APRA fund @moneyout", async ({ relatedInformationPage ,internalTransferPage, apiRequestContext, accountInfoPage, memberPage, memberOverviewpage, pensionTransactionPage, memberTransactionPage, navBar, globalPage }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    //when api is set to true, we create a new member for testing.
    if (data.generate_test_data_from_api) {
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member & select the created member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
    
    }
    //when api is set to false, we will use existing member details for testing.
     else {
            await test.step("Select the accumulation member with valid TFN", async () => {
            await navBar.selectMember(member.memberIDwithTFN);
        });
    }

    await test.step("verify TFN & RolloverOut transaction", async () => {
        await memberOverviewpage.verifyTFNStatus(true);
        await globalPage.captureScreenshot("TFN Status");
        await memberOverviewpage.superTickVerification();
        await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverOut(true);
        await memberTransactionPage.rollOutTransaction.click();
        await pensionTransactionPage.componentsValidation();
    });
})

test(fundName() + " Roll Out - Without TFN for APRA fund @moneyout", async ({ memberPage, accountInfoPage, internalTransferPage, relatedInformationPage, memberOverviewpage, memberTransactionPage, apiRequestContext, navBar, globalPage }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    //when api is set to true, we create a new member for testing.
    if (data.generate_test_data_from_api) {
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member & select the created member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
    }
    //when api is set to false, we will use existing member details for testing.
     else {
        await test.step("Select the accumulation member without TFN", async () => {
            await navBar.selectMember(member.memberIDwithoutTFN);
        });
    }

    await test.step("delete TFN", async () => {
        await memberOverviewpage.deleteTFN();
    });
    
    await test.step("verify TFN & RolloverOut transaction", async () => {
        await memberOverviewpage.verifyTFNStatus(false);
        await globalPage.captureScreenshot("TFN Status");
        await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverOut(false);
        
    });
})