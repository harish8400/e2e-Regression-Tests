import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json";
import pensionMember from "../../../data/aol_test_data.json";
import * as data from "../../../data/aol_test_data.json";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
        apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(360000);
    await allure.suite("Money_In");
    await navBar.selectProduct();
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "Contribution with TFN - Verify if contribution is processed successfully @moneyin", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        globalPage.captureScreenshot('Accumulation Member page');


    });
    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberIDwithTFN);
    }

    let contributionAmount: string;

    await test.step("Verify TFN Status of member", async () => {
        //await memberPage.selectMember(memberNo);
        await memberOverviewpage.verifyTFNStatus(true);
        globalPage.captureScreenshot('Member TFN Status');
    });

    await test.step("Add Personal Contribution", async () => {
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        contributionAmount = await memberTransactionPage.memberRolloverIn('Personal', true);
        globalPage.captureScreenshot('Personal Contribution');
    });

    await test.step("Validate transaction", async () => {
        await globalPage.validateMoneyInTransactionDetail(contributionAmount);
    });

})

test(fundName() + " Contribution without TFN - Verify if contribution is process failed for accum member doesn't have TFN where contribution type as Non Government @moneyin", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        globalPage.captureScreenshot('Accumulation Member page');
    });

    await test.step("Add new Accumulation Member", async () => {
        let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await navBar.selectMember(memberNo);
    })

    await test.step("Verify TFN is not available", async () => {
        //await memberPage.selectMember(addedMember);
        await memberOverviewpage.verifyTFNStatus(false);
        globalPage.captureScreenshot('Member TFN Status');
        await memberOverviewpage.sleep(3000);
    });

    await test.step("Add Personal Contribution", async () => {
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverIn('Personal', false, false);
        globalPage.captureScreenshot('Personal Contribution');
    });

})

test(fundName() + " Contribution without TFN - Verify if contribution is process failed for accum member doesn't have TFN where contribution type as Government @moneyin", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        globalPage.captureScreenshot('Accumulation Member page');
    });

    await test.step("Add new Accumulation Member", async () => {
        let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await navBar.selectMember(memberNo);
    })

    await test.step("Verify TFN is not available", async () => {
        //await memberPage.selectMember(addedMember);
        await memberOverviewpage.verifyTFNStatus(false);
        globalPage.captureScreenshot('Member TFN Status');
        await memberOverviewpage.sleep(3000);
    });

    await test.step("Add Personal Contribution", async () => {
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverIn('Personal', false, true);
    });

})

test(fundName() + " Verify if Personal contribution is processed successfully for Accum member @moneyin", async ({ navBar, memberApi, memberTransactionPage, pensionTransactionPage,shellAccountApi,apiRequestContext, globalPage, pensionAccountPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId  } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 5000));
            let linearId =  await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi, memberNo!);
            await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id!);
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Personal Contribution and Validate Investments & Balances", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Personal', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances');
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.TransactionsTab();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + "Salary Sacrifice Contribution - Verify if contribution is processed successfully @moneyin", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberApi, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Salary Sacrifice Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Salary Sacrifice', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances')
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + "Super Guarantee Contribution - Verify if contribution is processed successfully @moneyin", async ({ apiRequestContext,pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberApi, memberTransactionPage ,shellAccountApi}) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId  } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 5000));
            let linearId =  await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi, memberNo!);
            await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id!);
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Super Guarantee Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Super Guarantee', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances')
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + " Spouse Contribution - Verify if contribution is processed successfully @moneyin", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberApi, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Spouse Contribution", async () => {
        // await navBar.navigateToAccumulationMembersPage();
        // await navBar.selectMember(createMemberNo!);
        await memberTransactionPage.memberRolloverIn('Spouse', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances')
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + "Retirement Contribution - Verify if contribution is processed successfully @moneyin", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberApi, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 5000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await navBar.selectMember(memberNo);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Super Guarantee Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Retirement', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances')
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + "Verify if Child contribution is processed successfully for Accum member when the age is below 18 @moneyin", async ({ memberPage, internalTransferPage, apiRequestContext, accountInfoPage, memberOverviewpage, pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("update member's age to below 18 years", async () => {
        await memberOverviewpage.updateMemberAgeBelow18();
    })

    await test.step("Add Child Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverIn('Child', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances')
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();
    })

})

test(fundName() + "Verify if Child contribution is processed successfully for Accum member when the age is above 18 @moneyin", async ({ internalTransferPage, apiRequestContext, accountInfoPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    if (pensionMember.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        })
    } else {
        await navBar.selectMember(member.memberID);
    }

    await test.step("Add Child Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Child', true);
    });

})

test(fundName() + "Roll In  - With TFN for APRA fund @moneyin", async ({ memberApi, memberOverviewpage, pensionTransactionPage, memberTransactionPage, navBar, globalPage }) => {

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    //when api is set to true, we create a new member for testing.
    if (data.generate_test_data_from_api) {
    
        await test.step("Add new Accumulation Member", async () => {
            let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await navBar.selectMember(memberNo);
        })
        
    }
    //when api is set to false, we will use existing member details for testing.
     else {
            await test.step("Select the accumulation member with valid TFN", async () => {
            await navBar.selectMember(member.memberIDwithTFN);
        });
    }

    await test.step("verify TFN & rolloverin transaction", async () => {
        await memberOverviewpage.verifyTFNStatus(true);
        await globalPage.captureScreenshot("TFN Status");
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        //await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.RolloverIn();
        await memberTransactionPage.rollInTransaction.click();
        await pensionTransactionPage.componentsValidation();
    });
})

test(fundName() + "Roll In  - Without TFN for APRA fund @moneyin", async ({ memberApi, memberOverviewpage, pensionTransactionPage, memberTransactionPage, navBar, globalPage }) => {

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    //when api is set to true, we create a new member for testing.
    if (data.generate_test_data_from_api) {
    
        let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi, true);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 5000));
        await navBar.selectMember(memberNo);

        await test.step("delete TFN", async () => {
            await memberOverviewpage.deleteTFN();
        });
        
    }
    //when api is set to false, we will use existing member details for testing.
     else {
        await test.step("Navigate Accumulation Members list & select the member", async () => {
            //await navBar.navigateToPensionMembersPage();
            await navBar.selectMember(member.memberIDwithoutTFN);
        });
    }

    await test.step("verify TFN & rolloverin transaction", async () => {
        await memberOverviewpage.verifyTFNStatus(false);
        await globalPage.captureScreenshot("TFN Status");
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        //await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.RolloverIn();
        await memberTransactionPage.rollInTransaction.click();
        await pensionTransactionPage.componentsValidation();
    });
})