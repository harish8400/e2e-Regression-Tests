import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { AssertionError } from "assert";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";
import *  as data from "../../../data/aol_test_data.json"

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "-Internal Transfer from Accumulation to ABP-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage }) => {
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let memberID: string;

    if (data.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            memberID = createMemberNo;
        })
    }
    else {
        memberID = data.members.Internal_Transfer_Accumulation_To_ABP_Source_Account;
    }

    await test.step("Select the Accumulation Member", async () => {
        await navBar.selectMember(memberID!);
    });

    await test.step("Create Shell Account for accumulation member", async () => {
        await pensionAccountPage.createShellAccountExistingMember();
    });

    await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(memberID!);
        await pensionAccountPage.selectABPTab()
        await internalTransferPage.internalTransferMember('Accumulation', memberID!);
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionTransactionPage.transactionView();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(2000)
    });
})

test(fundName() + "-Internal Transfer from Accumulation to TTR-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage }) => {
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let memberID: string;

    if (data.generate_test_data_from_api) {
        await test.step("Add new Accumulation Member", async () => {
            let { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            memberID = createMemberNo;
        })
    }
    else {
        memberID = data.members.Internal_Transfer_Accumulation_To_TTR_Source_Account;
    }

    await test.step("Select the Accumulation Member", async () => {
        await navBar.selectMember(memberID);
    });

    await test.step("Create TTR Account for Accumulation Member", async () => {
        await pensionAccountPage.ttrAccountCreation();
    });

    await test.step("Perform Internal Transfer From Accumulation to TTR ", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(memberID!);
        await pensionAccountPage.selectTTRRetirement();
        await internalTransferPage.internalTransferMember('Accumulation', memberID);
    });

    await test.step("Validate the payment details & components ", async () => {
        await pensionTransactionPage.transactionView();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(5000)
    });
})

test(fundName() + "-Internal Transfer from ABP to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
    });

    let memberID: string;

    if (data.generate_test_data_from_api) {
        await test.step("Add new ABP Member", async () => {
            let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            memberID = memberData.memberNo;
        })
    }
    else {
        memberID = data.members.Internal_Transfer_ABP_To_Accumulation_Source_Account;
    }

    await test.step("Select the ABP Member", async () => {
        await navBar.selectMember(memberID);
    });

    await test.step("Create accumulation account for same Member", async () => {
        await internalTransferPage.accumulationAccountCreation(true, false);
    });

    await test.step("Select the Accumulation Member and perform Internal Transfer", async () => {
        await navBar.selectMember(memberID);
        await pensionAccountPage.selectABPTab();
        await internalTransferPage.internalTransferMember('ABP', memberID);
    });

    await test.step("Validate the payment details & components ", async () => {
        await internalTransferPage.transferOut();
        await pensionTransactionPage.transactions();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(5000);
    });
});

test(fundName() + "-Internal Transfer from TTR to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, globalPage, apiRequestContext }) => {
    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
    });

    let memberID: string;

    if (data.generate_test_data_from_api) {
        await test.step("Add new TTR Member", async () => {
            const memberData = await ShellAccountApiHandler.ttrShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            await globalPage.captureScreenshot('TTR Account Creation');
            memberID = memberData.memberNo;
        });
    }
    else {
        memberID = data.members.Internal_Transfer_TTR_To_Accumulation_Source_Account;
    }

    await test.step("Select the TTR Member", async () => {
        await navBar.selectMember(memberID);
    });

    await test.step("Create accumulation account for same Member", async () => {
        await internalTransferPage.accumulationAccountCreation(true, false);
    });

    await test.step("Select the Accumulation Member and perform Internal Transfer", async () => {
        await navBar.selectMemberSurName(memberID);
        await internalTransferPage.internalTransferMember('TTR', memberID);

    });

    await test.step("Validate the payment details & components ", async () => {
        await internalTransferPage.transferOutTTR();
        await pensionTransactionPage.transactions();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(5000);
    });
})

test(fundName() + "-Validate Retirement Transition process is successful where PTB transaction is processed on TTR account prior to conversion", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, internalTransferPage }) => {
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
            await pensionAccountPage.createShellAccountExistingMember();
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
})

test(fundName() + "-Validate Retirement Transition process completes successfully on TTR account with CoR and NO PTB transaction", async ({ navBar, pensionAccountPage, apiRequestContext, internalTransferPage, relatedInformationPage, pensionTransactionPage }) => {
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
            await pensionAccountPage.createShellAccountExistingMember();
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
})
