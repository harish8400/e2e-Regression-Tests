import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
// import { AssertionError } from "assert";
// import * as memberData from "../../../src/aol/data/pension_data.json";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { AssertionError } from "assert";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";


export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});


test(fundName() + "-Internal Transfer from Accumulation to ABP-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage }) => {

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        let createMemberNo: string | undefined;

        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        if (createMemberNo) {
            await test.step("Create Shell Account for same Member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(createMemberNo!);
            });

            await test.step("Select the Accumulation Member", async () => {
                await pensionAccountPage.reload();
                await navBar.navigateToAccumulationMembersPage();
                await navBar.selectMember(createMemberNo!);
            });

            await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.retirement()
            });

            await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
                await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
            });

            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000)
            });
        }


    } catch (Error) {
        throw Error;
    }

})

test(fundName() + "-Internal Transfer from Accumulation to TTR-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage }) => {

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        let createMemberNo: string | undefined;
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        if (createMemberNo) {
            await test.step("Create Shell Account for same Member", async () => {
                await pensionAccountPage.ttrAccountCreation(createMemberNo!);
            });

            await test.step("Select the Accumulation Member", async () => {
                await pensionAccountPage.reload();
                await navBar.navigateToAccumulationMembersPage();
                await navBar.selectMember(createMemberNo!);
            });

            await test.step("Navigate to TTR Screen", async () => {
                await pensionAccountPage.ttrRetirement()
            });
            await test.step("Perform Internal Transfer From Accumulation to TTR ", async () => {
                await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
            });
            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000)
            });
        }

    } catch (Error) {
        throw Error;
    }

})

test(fundName() + "-Internal Transfer from ABP to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {

    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        });

        let memberNo: string | undefined;
        let surname: string | undefined;

        await test.step("Add new Pension Shellaccount Member", async () => {
            const memberData = await pensionTransactionPage.accumulationAccount(navBar, pensionAccountPage, apiRequestContext);
            memberNo = memberData.memberNo;
            surname = memberData.surname;
        });

        if (memberNo && surname) {
            await test.step("Create accumulation account for same Member", async () => {
                await internalTransferPage.internalTransferProcess(true, false);
            });

            await test.step("Select the Accumulation Member and perform Internal Transfer", async () => {
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('ABP', memberNo!);
            });

            await test.step("Validate the payment details & components ", async () => {
                await internalTransferPage.transferOut();
                await pensionTransactionPage.transactions();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000);
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }

});

test(fundName() + "-Internal Transfer from TTR to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {

    try {
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
        });

        let memberNo: string | undefined;
        let surname: string | undefined;

        await test.step("Add new Pension Shellaccount Member", async () => {
            const memberData = await ShellAccountApiHandler.process(navBar, pensionAccountPage, apiRequestContext);
            memberNo = memberData.memberNo;
            surname = memberData.surname;
        });

        if (memberNo && surname) {
            await test.step("Create accumulation account for same Member", async () => {
                await internalTransferPage.internalTransferProcess(true, false);
            });

            await test.step("Select the Accumulation Member and perform Internal Transfer", async () => {
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);

            });

            await test.step("Validate the payment details & components ", async () => {
                await internalTransferPage.transferOutTTR();
                await pensionTransactionPage.transactions();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000);
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }


})

test(fundName() + "-Validate Retirement Transition process is successful where PTB transaction is processed on TTR account prior to conversion", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, internalTransferPage }) => {

    try {
        //navigating to TTR source member and verifying PTB
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
        })

        let memberNo: string | undefined;
        let surname: string | undefined;
        await test.step("Add new Pension Shellaccount Member and add PTB Transactions", async () => {
            const memberData = await ShellAccountApiHandler.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
            memberNo = memberData.memberNo;
            surname = memberData.surname;
        })
        await test.step("Verify PTB Transactions from Transactions Table", async () => {
            await pensionTransactionPage.verifyPTBtransaction(true);
        });

        if (memberNo && surname) {
            await test.step("Add new Pension Shellaccount For same member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(memberNo!);
            });

            await test.step("Select the pension Member and perform Internal Transfer", async () => {
                await pensionAccountPage.reload();
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);

            });

            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000)
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        throw error;
    }

})

test(fundName() + "-Validate Retirement Transition process completes successfully on TTR account with CoR and NO PTB transaction", async ({ navBar, pensionAccountPage, apiRequestContext, internalTransferPage, relatedInformationPage, pensionTransactionPage }) => {

    try {
        //navigating to TTR source member and verifying PTB
        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
        })

        let memberNo: string | undefined;
        let surname: string | undefined;
        await test.step("Add new Pension Shellaccount Member and add PTB Transactions", async () => {
            const memberData = await ShellAccountApiHandler.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
            memberNo = memberData.memberNo;
            surname = memberData.surname;
        })
        await test.step("Verify PTB Transactions from Transactions Table", async () => {
            await pensionTransactionPage.verifyPTBtransaction(false);
        });
 	await test.step("Add condition of Release for the same member", async () => {
            await relatedInformationPage.addConditionOfRelease();

        });

        if (memberNo && surname) {
            await test.step("Add new Pension Shellaccount For same member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(memberNo!);
            });

            await test.step("Select the pension Member and perform Internal Transfer", async () => {
                await pensionAccountPage.reload();
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);

            });

            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000)
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        throw error;
    }

})
