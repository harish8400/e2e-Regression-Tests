import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from "allure-playwright";
// import { AssertionError } from "assert";
// import * as memberData from "../../../src/aol/data/pension_data.json";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { AssertionError } from "assert";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";
import data from "../../../data/aol_test_data.json"
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";

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


test(fundName() + "-Internal Transfer from Accumulation to ABP-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage, globalPage }) => {

    let createMemberNo: string | undefined;
    let membersId: string | undefined;
    let userId: string | undefined;

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await globalPage.captureScreenshot('Accumulation Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Accumulation Member
            const memberNo = data.members.Accumulation_member;
            await test.step("Select the Exsisting Accumulation Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Accumulation Member Selection page');
            });

            //When api is set to true we will use new Accumulation account creation for testing.

        } else {
            // Create New Accumulation Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
                await globalPage.captureScreenshot('Accumulation Account Creation');
            });
        }

        if (createMemberNo) {
            await test.step("Create Shell Account for same Member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(!!createMemberNo, true);
                await globalPage.captureScreenshot('Shell Account Creation for same Member');
            });

            await test.step("Select the Accumulation Member", async () => {
                await pensionAccountPage.reload();
                await navBar.navigateToAccumulationMembersPage();
                await navBar.selectMember(createMemberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection');
            });

            await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.retirement();
                await globalPage.captureScreenshot('Pension Member Screen');
            });

            await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
                await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
                await globalPage.captureScreenshot('Internal Transfer From Accumulation to ABP ');
            });

            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000);
                await globalPage.captureScreenshot('Payment details  ');
            });
        }


    } catch (Error) {
        throw Error;
    }

})

test(fundName() + "-Internal Transfer from Accumulation to TTR-@PensionNewTest", async ({ navBar, accountInfoPage, internalTransferPage, apiRequestContext, memberPage, pensionAccountPage, pensionTransactionPage, globalPage }) => {

    let createMemberNo: string | undefined;
    let membersId: string | undefined;
    let userId: string | undefined;

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await globalPage.captureScreenshot('Accumulation Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Accumulation Member
            const memberNo = data.members.Accumulation_member;
            await test.step("Select the Exsisting Accumulation Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Accumulation Member Selection page');
            });

            //When api is set to true we will use new Accumulation account creation for testing.

        } else {
            // Create New Accumulation Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                createMemberNo = memberData.createMemberNo;
                await globalPage.captureScreenshot('Accumulation Account Creation');
            });
        }

        if (createMemberNo) {
            await test.step("Create Shell Account for same Member", async () => {
                await pensionAccountPage.ttrAccountCreation(!!createMemberNo, true);
                await globalPage.captureScreenshot('Shell Account Creation for same Member');
            });

            await test.step("Select the Accumulation Member", async () => {
                await pensionAccountPage.reload();
                await navBar.navigateToAccumulationMembersPage();
                await navBar.selectMember(createMemberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection');
            });

            await test.step("Navigate to TTR Screen", async () => {
                await pensionAccountPage.ttrRetirement()
                await globalPage.captureScreenshot('Pension Member Screen');
            });

            await test.step("Perform Internal Transfer From Accumulation to TTR ", async () => {
                await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
                await globalPage.captureScreenshot('Internal Transfer From Accumulation to TTR');
            });

            await test.step("Validate the payment details & components ", async () => {
                await pensionTransactionPage.transactionView();
                await pensionTransactionPage.componentsValidation();
                await pensionTransactionPage.sleep(5000);
                await globalPage.captureScreenshot('Payment details  ');
            });
        }


    } catch (Error) {
        throw Error;
    }

})

test(fundName() + "-Internal Transfer from ABP to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext, globalPage }) => {

    let membersId: string | undefined;
    let userId: string | undefined;
    let memberNo: string | undefined;
    let surname: string | undefined;

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await globalPage.captureScreenshot('Accumulation Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Pension Member
            const memberNo = data.members.ABP_Pension_Active_Member;
            await test.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

            //When api is set to true we will use new Shell account creation for testing.

        } else {
            // Create New Pension Shell Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                memberNo = memberData.memberNo;
                surname = memberData.surname;
                await globalPage.captureScreenshot('Pension Shell Account Creation');
            });
        }

        if (memberNo && surname) {
            await test.step("Create accumulation account for same Member", async () => {
                await internalTransferPage.internalTransferProcess(true, false);
                await globalPage.captureScreenshot('Accumulation Member Creation Page');
            });

            await test.step("Select the Accumulation Member and perform Internal Transfer", async () => {
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('ABP', memberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection Page');
            });

            await test.step("Validate the payment details & components ", async () => {
                await internalTransferPage.transferOut();
                await pensionTransactionPage.transactions();
                await pensionTransactionPage.componentsValidation();
                await globalPage.captureScreenshot('components Validation Page');
                await pensionTransactionPage.sleep(5000);
                await globalPage.captureScreenshot('Payment Details Page');
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }

});

test(fundName() + "-Internal Transfer from TTR to Accumulation", async ({ navBar, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext, globalPage }) => {

    let createMemberNo: string | undefined;
    let membersId: string | undefined;
    let userId: string | undefined;
    let memberNo: string | undefined;
    let surname: string | undefined;

    try {

        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
            await globalPage.captureScreenshot('Pensions Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Pension Member
            const memberNo = data.members.TTR_Pension_Active_Member;
            await test.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

            //When api is set to true we will use new Shell account creation for testing.

        } else {
            // Create New Pension Shell Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await ShellAccountApiHandler.ttrShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                memberNo = memberData.memberNo;
                surname = memberData.surname;
                await globalPage.captureScreenshot('Pension Shell Account Creation');
            });
        }

        if (memberNo && surname) {
            await test.step("Create accumulation account for same Member", async () => {
                await internalTransferPage.internalTransferProcess(true, false);
                await globalPage.captureScreenshot('Accumulation Member Creation Page');
            });

            await test.step("Select the pension Member and perform Internal Transfer", async () => {
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection Page');
            });

            await test.step("Validate the payment details & components ", async () => {
                await internalTransferPage.transferOut();
                await pensionTransactionPage.transactions();
                await pensionTransactionPage.componentsValidation();
                await globalPage.captureScreenshot('components Validation Page');
                await pensionTransactionPage.sleep(5000);
                await globalPage.captureScreenshot('Payment Details Page');
            });
        } else {
            throw new AssertionError({ message: "Test Execution Failed : Missing member data" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }


})

test(fundName() + "-Validate Retirement Transition process is successful where PTB transaction is processed on TTR account prior to conversion", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, internalTransferPage, globalPage, relatedInformationPage }) => {

    let createMemberNo: string | undefined;
    let membersId: string | undefined;
    let userId: string | undefined;
    let memberNo: string | undefined;
    let surname: string | undefined;

    try {

        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
            await globalPage.captureScreenshot('Pensions Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Pension Member
            const memberNo = data.members.TTR_Pension_Active_Member;
            await test.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await MemberApiHandler.ptbTransactions(apiRequestContext, membersId);
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

            //When api is set to true we will use new Shell account creation for testing.

        } else {
            // Create New Pension Shell Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await ShellAccountApiHandler.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
                memberNo = memberData.memberNo;
                surname = memberData.surname;
                await globalPage.captureScreenshot('Pension Shell Account Creation');
            });
        }

        await test.step("Verify PTB Transactions from Transactions Table", async () => {
            await pensionTransactionPage.verifyPTBtransaction(false);
        });
        await test.step("Add condition of Release for the same member", async () => {
            await relatedInformationPage.addConditionOfRelease();

        });

        if (memberNo && surname) {
            await test.step("Add new Pension Shellaccount For same member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(!!createMemberNo, true);
            });

            await test.step("Select the pension Member and perform Internal Transfer", async () => {
                await pensionAccountPage.reload();
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection Page');
            });

            await test.step("Validate the payment details & components ", async () => {

                await pensionTransactionPage.transactionView();
                await globalPage.captureScreenshot('Payment Details Page');
                await pensionTransactionPage.componentsValidation();
                await globalPage.captureScreenshot('components Validation Page');
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

test(fundName() + "-Validate Retirement Transition process completes successfully on TTR account with CoR and NO PTB transaction", async ({ navBar, pensionAccountPage, apiRequestContext, internalTransferPage, relatedInformationPage, pensionTransactionPage, globalPage }) => {

    let createMemberNo: string | undefined;
    let membersId: string | undefined;
    let userId: string | undefined;
    let memberNo: string | undefined;
    let surname: string | undefined;

    try {

        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToTTRMembersPage();
            await globalPage.captureScreenshot('Pensions Members page');
        })

        //when api is set to false, we will use existing member details for testing.
        if (data.generate_test_data_from_api) {

            // Select Existing Pension Member
            const memberNo = data.members.TTR_Pension_Active_Member;
            await test.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

            //When api is set to true we will use new Shell account creation for testing.

        } else {
            // Create New Pension Shell Account
            await test.step("Create New Pension Shell Account", async () => {
                const memberData = await ShellAccountApiHandler.ttrShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                memberNo = memberData.memberNo;
                surname = memberData.surname;
                await globalPage.captureScreenshot('Pension Shell Account Creation');
            });
        }

        await test.step("Add condition of Release for the same member", async () => {
            await relatedInformationPage.addConditionOfRelease();

        });

        if (memberNo && surname) {
            await test.step("Add new Pension Shellaccount For same member", async () => {
                await pensionAccountPage.createShellAccountExistingMember(!!createMemberNo, true);
            });

            await test.step("Select the pension Member and perform Internal Transfer", async () => {
                await pensionAccountPage.reload();
                await navBar.selectMemberSurName(surname!);
                await internalTransferPage.internalTransferMember('TTR', memberNo!);
                await globalPage.captureScreenshot('Accumulation Member Selection Page');
            });

            await test.step("Validate the payment details & components ", async () => {

                await pensionTransactionPage.transactionView();
                await globalPage.captureScreenshot('Payment Details Page');
                await pensionTransactionPage.componentsValidation();
                await globalPage.captureScreenshot('components Validation Page');
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