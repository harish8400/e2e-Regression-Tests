import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json";
import pensionMember from "../../../data/aol_test_data.json";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import * as data from "../../../data/aol_test_data.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
        apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await allure.suite("Money_In");
    await navBar.selectProduct();
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "Contribution with TFN - Verify if contribution is processed successfully ", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

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

test(fundName() + " Contribution without TFN - Verify if contribution is process failed for accum member doesn't have TFN where contribution type as Non Government ", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

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
        await memberTransactionPage.memberRolloverIn('Personal Contribution', false, false);
        globalPage.captureScreenshot('Personal Contribution');
    });

})

test(fundName() + " Contribution without TFN - Verify if contribution is process failed for accum member doesn't have TFN where contribution type as Government ", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

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
        await memberTransactionPage.memberRolloverIn('Personal Contribution', false, true);
        globalPage.captureScreenshot('Personal Contribution');
    });

})

test(fundName() + " Verify if Personal contribution is processed successfully for Accum member ", async ({ navBar, memberPage, memberTransactionPage, pensionTransactionPage, globalPage, pensionAccountPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
        console.log(addedMember);
    });

    await test.step("Add Personal Contribution and Validate Investments & Balances", async () => {
        await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Personal Contribution', true);
        await pensionTransactionPage.investementBalances();
        await globalPage.captureScreenshot('Investments & Balances');
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionAccountPage.transactionsTab.click();
        await globalPage.TransactionReference.click();
        await pensionTransactionPage.componentsValidation();

    })

})

test(fundName() + "Salary Sacrifice Contribution - Verify if contribution is processed successfully ", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Salary Sacrifice Contribution", async () => {
        await navBar.selectMemberSurName(addedMember);
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

test(fundName() + "Super Guarantee Contribution - Verify if contribution is processed successfully ", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Super Guarantee Contribution", async () => {
        await navBar.selectMemberSurName(addedMember);
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

test(fundName() + " Spouse Contribution - Verify if contribution is processed successfully ", async ({ internalTransferPage, apiRequestContext, accountInfoPage, pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let createMemberNo: string | undefined;
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
    })

    await test.step("Add Spouse Contribution", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
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

test(fundName() + "Retirement Contribution - Verify if contribution is processed successfully ", async ({ pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Super Guarantee Contribution", async () => {
        await navBar.selectMemberSurName(addedMember);
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

test(fundName() + "Verify if Child contribution is processed successfully for Accum member when the age is below 18 ", async ({ memberOverviewpage, internalTransferPage, apiRequestContext, accountInfoPage, pensionTransactionPage, pensionAccountPage, globalPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    await test.step("Add new Accumulation Member & select the created member", async () => {
        await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
    })

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

test(fundName() + "Verify if Child contribution is processed successfully for Accum member when the age is above 18 ", async ({ internalTransferPage, apiRequestContext, accountInfoPage, navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    await test.step("Add new Accumulation Member & select the created member", async () => {
        await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
    })

    await test.step("Add Child Contribution", async () => {
        //await navBar.selectMemberSurName(addedMember);
        await memberTransactionPage.memberRolloverIn('Child', true);
    });

})

test(fundName() + "Roll In  - With TFN for APRA fund @MoneyIn", async ({ relatedInformationPage, internalTransferPage, apiRequestContext, accountInfoPage, memberPage, memberOverviewpage, pensionTransactionPage, memberTransactionPage, navBar, globalPage }) => {

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

    await test.step("verify TFN & rolloverin transaction", async () => {
        await memberOverviewpage.verifyTFNStatus(true);
        await globalPage.captureScreenshot("TFN Status");
        await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.RolloverIn();
        await memberTransactionPage.rollInTransaction.click();
        await pensionTransactionPage.componentsValidation();
    });
})

test(fundName() + "Roll In  - Without TFN for APRA fund @MoneyIn", async ({ relatedInformationPage, memberPage, accountInfoPage, internalTransferPage, memberOverviewpage, pensionTransactionPage, memberTransactionPage, apiRequestContext, navBar, globalPage }) => {
    
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    //when api is set to true, we create a new member for testing.
    if (data.generate_test_data_from_api) {
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member & selct the created member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })

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
        await relatedInformationPage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.RolloverIn();
        await memberTransactionPage.rollInTransaction.click();
        await pensionTransactionPage.componentsValidation();
    });
})