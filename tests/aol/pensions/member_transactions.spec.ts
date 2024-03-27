import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler"
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import pensionMember from "../../../data/aol_test_data.json"


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



test(fundName() + "-Manual Roll-in - Pension Member @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
    })

    await test.step("Add a New Pensions Member", async () => {
        await pensionTransactionPage.shellAccount(navBar, pensionAccountPage, apiRequestContext);
    })

    await test.step("Add some MoneyIn", async () => {
        await pensionTransactionPage.rollInTransaction();
    })

    await test.step("Validate the Transaction details", async () => {
        let rollinId = await pensionTransactionPage.transactionView();

        let rollinTransactionId = rollinId!.split(":")[1];
        await TransactionsApiHandler.fetchTransactionDetails(apiRequestContext, rollinTransactionId!.trim());
    })
})

test(fundName() + "-ABP Rollover Out Commutation - Partial @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {

    let membersId: string | undefined;


    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_And_UNP_Commutation_Partial_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Payment Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(false);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            let paymentId = await pensionTransactionPage.paymentView();
            let paymentTransactionId = paymentId!.split(":")[1];
            const paymentDetails = await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());;
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await test.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });


})

test(fundName() + "-ABP UNP Commutation - Partial @PensionNewTest", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {
    let membersId: string | undefined;
   



    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_And_UNP_Commutation_Partial_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId ;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Payment Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationUNPBenefit(false);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            let paymentId = await pensionTransactionPage.paymentView();
            let paymentTransactionId = paymentId!.split(":")[1];
            const paymentDetails = await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });
    // Validate Member Payment Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });
    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await test.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });

})

test(fundName() + "-TTR RLO Commutation - Partial @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {

    let membersId: string | undefined;
    

    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Rollout Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(false);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await test.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });

})

test(fundName() + "-ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, globalPage }) => {
    let membersId: string | undefined;
    


    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_UNP_Commutation_Partial_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    await test.step("'Commutation UNP Benefit Process", async () => {
        await pensionTransactionPage.commutationUNPBenefitReject(false);
        await globalPage.captureScreenshot('Commutation UNP Benefit');


    });


})

test(fundName() + "-ABP Rollover Out Commutation - Full exit @validation", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {
    let membersId: string | undefined;
    



    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_Full_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Rollout Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const paymentDetails = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Fee Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await test.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });

});


test(fundName() + "-ABP UNP Commutation - Full Exit @commutation", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {

    let membersId: string | undefined;
   



    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_UNP_Full_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId ;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Payment Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationUNPBenefit(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            let paymentId = await pensionTransactionPage.paymentView();
            let paymentTransactionId = paymentId!.split(":")[1];
            const paymentDetails = await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());;
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Fee Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }

        // Validate MATS Report
        await test.step("Validate MATS Report", async () => {
            const memberId = getMemberId();
            if (memberId) {
                const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
                console.log('MAAS Report:', MAASReport);
            } else {
                console.log("memberId is undefined. Cannot fetch MAAS Report.");
            }
        });


    });



})

test(fundName() + "-TTR RLO Commutation - Full Exit @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {

    let membersId: string | undefined;
   



    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    const getMemberId = () => membersId ;

    // Investments and Balances Page
    await test.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Rollout Process
    await test.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await test.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            let paymentId = await pensionTransactionPage.paymentView();
            let paymentTransactionId = paymentId!.split(":")[1];
            const paymentDetails = await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
            console.log('Payments:', paymentDetails);
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await test.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Fee Details
    await test.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await test.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await test.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId);
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });


})

test(fundName() + "-ABP Death Benefit Payment @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, globalPage }) => {
    try {

        await test.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
            await globalPage.captureScreenshot('Pensions Members page');
        });

        //when api is set to false, we will use existing member details for testing.
        if (pensionMember.generate_test_data_from_api) {

            // Select Existing Pension Member
            const memberNo = pensionMember.members.Death_benefit_member_number;
            await test.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

            //When api is set to true we will use new Shell account creation for testing.

        } else {
            // Create New Pension Shell Account
            await test.step("Create New Pension Shell Account", async () => {
                await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                await globalPage.captureScreenshot('Pension Shell Account Creation');

            });
        }
        await test.step("Death Benfit Transactions", async () => {
            await pensionTransactionPage.deathBenefitTransaction();
            await globalPage.captureScreenshot('Death Benefit Payment');

        });
    } catch (error) {
        throw error
    }
})

test(fundName() + "-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension", async ({ navBar, pensionTransactionPage, globalPage, apiRequestContext, pensionAccountPage }) => {

    let membersId: string | undefined;
    

    await test.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Lump_Sum_Unrestricted_Unreserved_Fund_Withdrawal_Error;
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
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
    }

    await test.step("Verify Error Message For Member Balance Not to be 100% UNP", async () => {
        await pensionTransactionPage.verifyErrorMessageForMemberBalanceNotHundredPercentUNP();
        await globalPage.captureScreenshot('Error Message');


    });

})

test(fundName() + "-ABP Pension commencement WITH PTB @pension", async ({ navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    await navBar.navigateToPensionMembersPage();
    await pensionTransactionPage.ptbTransactions(navBar, pensionAccountPage, apiRequestContext);
    await pensionTransactionPage.verifyPTBtransaction(true);
    await pensionTransactionPage.pensionCommence();
})

test(fundName() + "Verify the updating of member's CRN in the account details @pension", async ({ navBar, accountInfoPage, memberPage, apiRequestContext, internalTransferPage, globalPage }) => {

    

    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Members page');
    });

    //when api is set to false, we will use existing member details for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Select Existing Accumulation Member
        const memberNo = pensionMember.members.Accumulation_member;
        await test.step("Select Existing Accumulation_member Member", async () => {
            await navBar.selectMember(memberNo);
            await globalPage.captureScreenshot('AccumulationMember Selection page');
        });

        //When api is set to true we will use new Member Account account creation for testing.

    } else {
        // Create New Member Account
        await test.step("Create New Member Account", async () => {
            const { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            await navBar.selectMember(createMemberNo);
            await globalPage.captureScreenshot('New Member Account account ');
        });
    }

    await test.step("Update CRN for the member", async () => {
        await accountInfoPage.updateCRN();
        await globalPage.captureScreenshot('CRN Updation');


    });
})