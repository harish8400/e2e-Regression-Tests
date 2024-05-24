import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import *  as data from "../../../data/aol_test_data.json"
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

/** Test Case: Maintain Income Stream Account: Bank account details (Edit) */
test(fundName() + "- Maintain Income Stream Account (documentation required): Bank account details @pension", async ({ navBar, accountInfoPage, apiRequestContext, globalPage, pensionTransactionPage, pensionAccountPage }) => {

    try {

        await test.step("Navigate to Pension Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let membersId: string | undefined;

        if (data.generate_test_data_from_api) {
            await test.step("Add new ABP Member", async () => {
                let memberData = await pensionTransactionPage.memberShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                membersId = memberData.memberNo;

                await globalPage.captureScreenshot('TTR Account Creation');
            });
        }
        else {
            membersId = data.members.Maintain_Income_Stream_Account_Bank_Account;

            await test.step("Select the ABP Member", async () => {

                await navBar.selectMember(membersId!);
            });
        }

        await test.step("Validate Bank Account-Update", async () => {
            await accountInfoPage.editBankAccount();
        })

    } catch (Error) {
        throw Error;
    }

})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Monthly' */
test(fundName() + "- Maintain Income Steam Account - Payment details (payment amount, frequency, payment draw down options) @pension", async ({ navBar, pensionAccountPage, pensionTransactionPage, apiRequestContext, globalPage, memberApi }) => {

    try {

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let membersId: string | undefined;

        if (data.generate_test_data_from_api) {
            // Create New Pension Shell Account
            await allure.step("Create New Pension Shell Account", async () => {
                const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                    membersId = memberId.linearId.id;
                await globalPage.captureScreenshot('New ABP Member');
            });
        }
        else {
            let memberNo = data.members.Maintain_Income_Stream_Account_Payment_Details;
            await test.step("Select the ABP Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
                membersId = linearId.id;
            });
        }

        await test.step("Validate Pension - Update Payment Details is processed", async () => {
            await pensionAccountPage.editPaymentDetails();
        })

        const getMemberId = () => membersId;
        const memberId = getMemberId();
        if (memberId) {
        await test.step("Validate Re-calculation of regular pension payment amount", async () => {
            var recalculatedPensionAmount = await MemberApiHandler.getRegularPensionPaymentAmount(memberApi, memberId!);
            allure.logStep("Re-calculated regular pension payment from DLTA -" + recalculatedPensionAmount);
            await globalPage.captureScreenshot("Re-calculated regular pension payment");
        })
    }

    } catch (Error) {
        throw Error;
    }

})

/** Test Case: Maintain Income Stream Account: Edit Payment details freqeuncy 'Quarterly' */
test(fundName() + "- Verify Pension Payment is executed successful for Half-yearly frequency @pension", async ({ navBar, pensionAccountPage, pensionTransactionPage, apiRequestContext, memberApi, globalPage }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let membersId: string | undefined;

        if (data.generate_test_data_from_api) {
            await allure.step("Create New Pension Shell Account", async () => {
                const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                    membersId = memberId.linearId.id;
                await globalPage.captureScreenshot('New ABP Member');
            });
        }
        else {
            let memberNo = data.members.Maintain_Income_Stream_Account_Payment_Details;
            await test.step("Select the ABP Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
                membersId = linearId.id;
            });
        }

        await test.step("Validate Pension - Update Payment Details is processed", async () => {
            await pensionAccountPage.editPaymentDetails('Bi-Annualy');
        })

        const getMemberId = () => membersId;
        const memberId = getMemberId();
        if (memberId) {
        await test.step("Validate Re-calculation of regular pension payment amount", async () => {
            var recalculatedPensionAmount = await MemberApiHandler.getRegularPensionPaymentAmount(memberApi, memberId!);
            allure.logStep("Re-calculated regular pension payment from DLTA -" + recalculatedPensionAmount);
            await globalPage.captureScreenshot("Re-calculated regular pension payment");
        })
    }

    } catch (Error) {
        throw Error;
    }

})

/** Test Case: Maintain Income Stream Account: Edit Payment details frequency 'Annually' */
test(fundName() + "- Verify Pension Payment is executed successful for Quarterly frequency @pension", async ({ navBar, pensionAccountPage, pensionTransactionPage, apiRequestContext, memberApi, globalPage }) => {

    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToPensionMembersPage();
        })

        let membersId: string | undefined;
        if (data.generate_test_data_from_api) {
            await test.step("Add new ABP Member", async () => {
                const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                    membersId = memberId.linearId.id;
                await globalPage.captureScreenshot('New ABP Member');
            });
        }
        else {
            let memberNo = data.members.Maintain_Income_Stream_Account_Payment_Details;
            await test.step("Select the ABP Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo);
                membersId = linearId.id;
            });
        }

        await test.step("Validate Pension - Update Payment Details is processed", async () => {
            await pensionAccountPage.editPaymentDetails('Quarterly');
        })

        const getMemberId = () => membersId;
        const memberId = getMemberId();
        if (memberId) {
        await test.step("Validate Re-calculation of regular pension payment amount", async () => {
            var recalculatedPensionAmount = await MemberApiHandler.getRegularPensionPaymentAmount(memberApi, memberId!);
            allure.logStep("Re-calculated regular pension payment from DLTA -" + recalculatedPensionAmount);
            await globalPage.captureScreenshot("Re-calculated regular pension payment");
        })
    }

    } catch (Error) {
        throw Error;
    }

})
