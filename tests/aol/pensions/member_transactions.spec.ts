import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { fundName } from "../../../src/aol/utils_aol";
import { TransactionsApiHandler } from "../../../src/aol_api/handler/transaction_api_handler";
import { APIRequestContext, expect } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import pensionMember from "../../../data/aol_test_data.json";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";
import * as data from "../../../data/aol_test_data.json";
import * as member from "../../../src/aol/data/member.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext }>({
  apiRequestContext: async ({}, use) => {
    await use(await initDltaApiContext());
  },
});

test.beforeEach(async ({ navBar }) => {
  test.setTimeout(600000);
  await navBar.selectProduct();
  await allure.suite("Pension");
  await allure.parentSuite(process.env.PRODUCT!);
});



test(fundName() + "-Manual Roll-in - Pension Member @pension", async ({ globalPage, memberPage, accountInfoPage, internalTransferPage, navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
    let membersId: string | undefined;

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Accumulation Account
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.ttrAccountCreation();
            await pensionAccountPage.getMemberId("TTR");
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to TTR Screen", async () => {
                await pensionAccountPage.selectTTRRetirement();
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })
    } 
    //If api is set to false, we will use existing member details for testing.
    else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.navigateToTTRMembersPage();
            await navBar.selectMember(memberNo);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    await allure.step("Add some MoneyIn", async () => {
        await pensionTransactionPage.rollInTransaction();
    })

    await allure.step("Validate the Transaction details", async () => {
        let rollinId = await pensionTransactionPage.transactionView();

      let rollinTransactionId = rollinId!.split(":")[1];
      await TransactionsApiHandler.fetchTransactionDetails(
        apiRequestContext,
        rollinTransactionId!.trim()
      );
    });
  }
);

test(
  fundName() + "-ABP Rollover Out Commutation - Partial @pension",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    transactionApi,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });

      //when api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_And_UNP_Commutation_Partial_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    };

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
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
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(false);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
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
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, false);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await allure.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
  }
);

test(
  fundName() + "-ABP UNP Commutation - Partial @PensionNewTest",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    transactionApi,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });


      //when api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_And_UNP_Commutation_Partial_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            allure.attachment('Investments Info', JSON.stringify(investments, null, 2), 'application/json');
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Payment Process
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationUNPBenefit(false);
        await globalPage.captureScreenshot('Commutation Rollout');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            let paymentId = await pensionTransactionPage.paymentView();
            let paymentTransactionId = paymentId!.split(":")[1];
            const paymentDetails = await TransactionsApiHandler.fetchPaymentDetails(apiRequestContext, paymentTransactionId!.trim());
            console.log('Payments:', paymentDetails);
            allure.attachment('Payments Info', JSON.stringify(paymentDetails, null, 2), 'application/json')
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });
    // Validate Member Payment Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
            allure.attachment('MemberPayments Info', JSON.stringify(MemberPayments, null, 2), 'application/json');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });
    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, false);
            console.log("summary:", summary);
            allure.attachment('summary Info', JSON.stringify(summary, null, 2), 'application/json');
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await allure.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
            console.log('MAAS Report:', MAASReport);
            allure.attachment('MAAS Report Info', JSON.stringify(MAASReport, null, 2), 'application/json');
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
  }
);

test(
  fundName() + "-TTR RLO Commutation - Partial @pension",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    transactionApi,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.

    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const { memberNo, processId} = await ShellAccountApiHandler.createPensionShellAccount(apiRequestContext);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(memberNo);
        });


      //when api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
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
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(false);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, false);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await allure.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MAAS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
  }
);

test(
  fundName() +
    "-ABP UNP Commutation - Review on Step 3 Validate Commutation  - Reject @pension",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.

    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });
        //when api is set to false, we will use existing member details for testing.

    } else {
        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_UNP_Commutation_Partial_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            //const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            //membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    await allure.step("'Commutation UNP Benefit Process", async () => {
        await pensionTransactionPage.commutationUNPBenefitReject(false);
        await globalPage.captureScreenshot('Commutation UNP Benefit');
    });

})

test(
  fundName() + "-ABP Rollover Out Commutation - Full exit @validation",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    transactionApi,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.

    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });


      //when api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_Rollover_Full_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const investments = await ShellAccountCreationApiHandler.getMemberInvestments(transactionApi, memberId!);
            console.log('Investments:', investments);
            allure.attachment('Investments Info', JSON.stringify(investments, null, 2), 'application/json');
            await pensionTransactionPage.investementBalances();
            await globalPage.captureScreenshot('investment and Balances');
        } else {
            console.log("Member ID is undefined. Cannot fetch Investments.");
        }
    });

    // Commutation Rollout Process
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const paymentDetails = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('Payments:', paymentDetails);
            allure.attachment('Payments Info', JSON.stringify(paymentDetails, null, 2), 'application/json');
            await pensionTransactionPage.paymentView();
            await globalPage.captureScreenshot('Payment Details');
        } else {
            console.log("Member ID is undefined. Cannot fetch payments.");
        }
    });

    // Validate Unit Prices For the current Transactions
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Fee Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            //await pensionTransactionPage.adminFee();
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
            allure.attachment('Fee Info', JSON.stringify(feeDetails, null, 2), 'application/json');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, true);
            console.log("summary:", summary);
            allure.attachment('summary Info', JSON.stringify(summary, null, 2), 'application/json');
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await allure.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
            console.log('MAAS Report:', MAASReport);
            allure.attachment('MAAS Report:', JSON.stringify(MAASReport, null, 2), 'application/json');
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
  }
);

test(
  fundName() + "-ABP UNP Commutation - Full Exit @commutation",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    transactionApi,
    globalPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToPensionMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });


      //when api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.ABP_Commutation_UNP_Full_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
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
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationUNPBenefit(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
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
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Fee Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.adminFee();
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, true);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }

        // Validate MATS Report
        await allure.step("Validate MATS Report", async () => {
            const memberId = getMemberId();
            if (memberId) {
                const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
                console.log('MAAS Report:', MAASReport);
            } else {
                console.log("memberId is undefined. Cannot fetch MAAS Report.");
            }
        });


    });



})

test(fundName() + "-TTR RLO Commutation - Full Exit @pension", async ({ internalTransferPage, accountInfoPage, memberPage, navBar, pensionTransactionPage, pensionAccountPage, apiRequestContext, transactionApi, globalPage }) => {

    let membersId: string | undefined;

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.ttrAccountCreation();
            await pensionAccountPage.getMemberId("TTR");
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to TTR Screen", async () => {
                await pensionAccountPage.selectTTRRetirement();
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })
    } 
    //If api is set to false, we will use existing member details for testing.
    else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Commutation_Rollout_Partial_And_Full_Member_Number;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.navigateToTTRMembersPage();
            await navBar.selectMember(memberNo);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    const getMemberId = () => membersId;

    // Investments and Balances Page
    await allure.step("Investments and Balances Page", async () => {
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
    await allure.step("Commutation Rollout Process", async () => {
        await pensionTransactionPage.commutationRolloverOut(true);
        await globalPage.captureScreenshot('Activity Data');
    });

    // Validate the Payment Details In Transactions Screen
    await allure.step("Validate the Payment Details In Transactions Screen", async () => {
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
    await allure.step("Validate Unit Prices For the current Transactions", async () => {
        await pensionTransactionPage.unitPriceValidation();
        await globalPage.captureScreenshot('Unit Prices Page');
    });

    // Validate Member Payment Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MemberPayments = await ShellAccountCreationApiHandler.getMemberPayment(transactionApi, memberId);
            console.log('MemberPayments:', MemberPayments);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Fee Details
    await allure.step("Validate Member Fee Details", async () => {
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.adminFee();
            const feeDetails = await ShellAccountCreationApiHandler.getMemberFee(transactionApi, memberId);
            console.log('Fee:', feeDetails);
        } else {
            console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
        }
    });

    // Validate Member Status
    await allure.step("Validate Member Status", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const summary = await MemberApiHandler.fetchMemberSummary(apiRequestContext, memberId, true);
            console.log("summary:", summary);
            await pensionTransactionPage.memberStatus();
            await globalPage.captureScreenshot('Member Summary Page');
        } else {
            console.log("Member ID is undefined. Cannot fetch Member status.");
        }
    });

    // Validate MATS Report
    await allure.step("Validate MATS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MAAS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
  }
);

test(
  fundName() + "-ABP Death Benefit Payment @pension",
  async ({
    navBar,
    pensionTransactionPage,
    pensionAccountPage,
    apiRequestContext,
    globalPage,
  }) => {
    try {

        await allure.step("Navigate to Pensions Members page", async () => {
            await navBar.navigateToPensionMembersPage();
            await globalPage.captureScreenshot('Pensions Members page');
        });

        //When api is set to true we will use new Shell account creation for testing.
        if (pensionMember.generate_test_data_from_api) {

            // Create New Pension Shell Account
            await allure.step("Create New Pension Shell Account", async () => {
                await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
                await globalPage.captureScreenshot('Pension Shell Account Creation');

            });


            //If api is set to false, we will use existing member details for testing.

        } else {

            // Select Existing Pension Member
            const memberNo = pensionMember.members.Death_benefit_member_number;
            await allure.step("Select Existing Pension Member", async () => {
                await navBar.selectMember(memberNo);
                await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
                await globalPage.captureScreenshot('Pension Member Selection page');
            });

        }
        await allure.step("Death Benfit Transactions", async () => {
            //await pensionTransactionPage.deathBenefitTransaction();
            await pensionTransactionPage.deathBenefit();
            await globalPage.captureScreenshot('Death Benefit Payment');

        });
    } catch (error) {
      throw error;
    }
  }
);

test(
  fundName() +
    "-Lump sum withdrawals from pre-retirement income streams are not permitted - TTR @pension",
  async ({
    navBar,
    pensionTransactionPage,
    globalPage,
    apiRequestContext,
    pensionAccountPage,
  }) => {
    let membersId: string | undefined;

    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            const memberId = await pensionTransactionPage.memberPensionShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            membersId = memberId.linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
            await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
        });


      //If api is set to false, we will use existing member details for testing.
    } else {

        // Select Existing Pension Member
        const memberNo = pensionMember.members.TTR_Lump_Sum_Unrestricted_Unreserved_Fund_Withdrawal_Error;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    await allure.step("Verify Error Message For Member Balance Not to be 100% UNP", async () => {
        await pensionTransactionPage.verifyErrorMessageForMemberBalanceNotHundredPercentUNP();
        await globalPage.captureScreenshot('Error Message');


    });
  }
);

test(fundName() + "-ABP Pension commencement WITH PTB @pension", async ({ navBar, memberPage, accountInfoPage, internalTransferPage, pensionTransactionPage, pensionAccountPage, apiRequestContext }) => {
 //Creating test data from api   
if (data.generate_test_data_from_api) {
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
    })
    let linearId: string | undefined;
    await test.step("Create Shell Account for same Member", async () => {
        await navBar.navigateToAccumulationMembersPage();
        //await memberPage.selectMember(createMemberNo!);
        await navBar.selectMember(createMemberNo!);
        await pensionAccountPage.createShellAccountExistingMember();
        let memberCreated  = await pensionAccountPage.getMemberId("ABP");
        const memberId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberCreated!)
        linearId = memberId.id;
        console.log(linearId);
    })
    await test.step("Select the Accumulation Member", async () => {
        await pensionAccountPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
    })

    await test.step("Navigate to ABP Screen", async () => {
            await pensionAccountPage.selectABPTab()
    })

    await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
        await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
    })

    await test.step("Add PTB & Validate the payment details and components ", async () => {
        await MemberApiHandler.ptbTransactions(apiRequestContext, linearId);
        await pensionTransactionPage.transactionView();
        await pensionTransactionPage.componentsValidation();
        await pensionTransactionPage.sleep(5000)
    })
    await test.step("commence pension and validate member is active", async () => {
        //await MemberApiHandler.ptbTransactions(apiRequestContext, linearId!);
        await pensionTransactionPage.pensionCommence();
        await pensionTransactionPage.memberStatus();
    })
}
//Using existing member data
else{
    await test.step("Select Pension Member", async () => {
        await navBar.navigateToPensionMembersPage();
        const memberId = data.members.Pension_Commencement_with_PTB;
        await navBar.selectMember(memberId);
    })

    await test.step("verify PTB transaction & Commence pension and validate member is Active", async () => {
        await pensionTransactionPage.verifyPTBtransaction(true);
        await pensionTransactionPage.pensionCommence();
        await pensionTransactionPage.memberStatus();
    })    
}

    await test.step("Validate balance from investment and balance & Correpondence payload is generated", async () => {
        await pensionTransactionPage.investementBalances();
    })

    await test.step("Validate Pension Commencement & Investment Switch status", async () =>{
        await pensionTransactionPage.InvestmentSwitchTransactionStatus();
        await pensionTransactionPage.componentsValidation();
    })
})

test(fundName() + "Verify the updating of member's CRN in the account details @pension", async ({ apiRequestContext, internalTransferPage, navBar, accountInfoPage, memberPage, globalPage }) => {

    await allure.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await globalPage.captureScreenshot('Accumulation Members page');
    });

    //when api is set to true, we new member for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Member Account
        await allure.step("Create New Member Account", async () => {
            const { createMemberNo } = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            await navBar.selectMember(createMemberNo);
            await globalPage.captureScreenshot('New Member Account account ');
        });


      //when api is set to false, we will use existing member details for testing.
    } else {

        // Create New Member Account
        await allure.step("Create New Member Account", async () => {
            const memberId = data.members.Accum_Member_PTB;
        await navBar.selectMember(memberId);
            await globalPage.captureScreenshot('New Member Account account ');
        });

    }

    await allure.step("Update CRN for the member", async () => {
        await accountInfoPage.updateCRN();
        await globalPage.captureScreenshot('CRN Updation');
    });
})

test(fundName() + "-Validate Retirement Transition process is sucessful where PTB transactionm is processed on TTR account prior to conversion @PTB", async ({ navBar, pensionTransactionPage, globalPage, apiRequestContext, pensionAccountPage, transactionApi, memberApi }) => {

    let membersId: string | undefined;
    let memberNo: string | undefined;


    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            let { memberNo } = await pensionTransactionPage.memberWithPTBTransactions(navBar, pensionAccountPage, apiRequestContext);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
        });


        //If api is set to false, we will use existing member details for testing.


    } else {

        // Select Existing Pension Member
        memberNo = pensionMember.members.Member_TTR_PTB;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo!);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            const memberPTBTransactions = await MemberApiHandler.ptbTransactions(apiRequestContext, membersId);
            allure.attachment('PTB Transactions Data', JSON.stringify(memberPTBTransactions, null, 2), 'application/json');
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }

    await allure.step("Validate PTB Transactions for the same member", async () => {
        allure.logStep("Verify PTB Transactionsn are displayed");
        await pensionTransactionPage.verifyPTBtransaction(true);
        await globalPage.captureScreenshot('PTB Transactions');
    });

    await allure.step("Validate member age for Condition of Release", async () => {
        allure.logStep("Verify member age for Condition of Release is displayed correctly");
        await pensionTransactionPage.memberAge(63);
        await globalPage.captureScreenshot('Error Message');
    });

    await allure.step("Run the Cohort Process for the same member", async () => {
        await pensionTransactionPage.cohortProcess(memberNo!);
        await globalPage.captureScreenshot('Cohort Process for the same member');

    });

    await allure.step("Validate Retirement Transistion Case is Triggered", async () => {
        allure.logStep("Verify Retirement Transistion Case is displayed correctly");
        await pensionTransactionPage.retirementToTransistionProcess();
        await globalPage.captureScreenshot('Retirement Transistion Case');

    });

    await allure.step("Validate Condition of Release is Updated", async () => {
        allure.logStep("Verify Condition of Release Case is displayed correctly");
        await pensionTransactionPage.conditionOfRelease();
        await globalPage.captureScreenshot('Condition of Release Case');

    });

    const getMemberId = () => membersId;

    await allure.step("Validate Investment Switch PTB cash is initiated", async () => {
        allure.logStep("Verify Investment Switch PTB Case is displayed correctly");
        const memberId = getMemberId();
        if (memberId) {
            //await MemberApiHandler.memberInvestmentSwitch(memberApi, memberId);
            const investemntsSwitchInfo = await MemberApiHandler.getMemberInvestmentSwitch(memberApi, memberId, 0, 50);
            await pensionTransactionPage.investmentSwitch(true);
            allure.attachment('investmentSwitch Account Info', JSON.stringify(investemntsSwitchInfo, null, 2), 'application/json');
            console.log('investemntsSwitchInfo', investemntsSwitchInfo);
        } else {
            console.log("memberId is undefined. Cannot fetch investemntsSwitchInfo Report.");
        }

        await globalPage.captureScreenshot('investemntsSwitchInfo');

    });

    await allure.step("Validate Investment Rebalance is switched", async () => {
        allure.logStep("Verify Investment Rebalance PTB Case is displayed correctly");
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.investmentsRebalance(true);
            const InvestmentsRebalance = await MemberApiHandler.getMemberInvestmentRebalance(memberApi, memberId, 0, 50);
            allure.attachment('InvestmentsRebalance Transactions Data', JSON.stringify(InvestmentsRebalance, null, 2), 'application/json');
            console.log('InvestmentsRebalance', InvestmentsRebalance);
        } else {
            console.log("memberId is undefined. Cannot fetchInvestmentsRebalance.");
        }

        await globalPage.captureScreenshot('InvestmentsRebalance');

    });

    await allure.step("Validate whether Investments are switched from  Taxed to Untaxed", async () => {
        allure.logStep("Verify whether Funds are moved to Unrestricted non-preserved");
        const memberId = getMemberId();
        if (memberId) {
            
            await pensionTransactionPage.accountBalance();
        } else {
            console.log("memberId is undefined. Cannot fetch account balance.");
        }

        await globalPage.captureScreenshot('investemntsSwitchInfo');

    });

    await allure.step("Validate MAAS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MAAS Submit');
            allure.attachment('MAAS Report Data', JSON.stringify(MAASReport, null, 2), 'application/json');
            expect(MAASReport.type).toEqual('MAAS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });
})

test(fundName() + "-Validate Retirement Transition process completes sucessfully on TTR account with COR and No PTB Transactions @PTB", async ({ navBar, pensionTransactionPage, globalPage, apiRequestContext, pensionAccountPage, transactionApi, memberApi }) => {

    let membersId: string | undefined;
    let memberNo: string | undefined;
    let getMemberId = () => membersId;


    await allure.step("Navigate to Pensions Members page", async () => {
        await navBar.navigateToTTRMembersPage();
        await globalPage.captureScreenshot('Pensions Members page');
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {

        // Create New Pension Shell Account
        await allure.step("Create New Pension Shell Account", async () => {
            let {memberNo} = await ShellAccountApiHandler.ttrShellAccountCreation(navBar, pensionAccountPage, apiRequestContext);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Shell Account Creation');
        });


        //If api is set to false, we will use existing member details for testing.


    } else {

        // Select Existing Pension Member
        memberNo = pensionMember.members.Member_TTR_PTB;
        await allure.step("Select Existing Pension Member", async () => {
            await navBar.selectMember(memberNo!);
            const linearId = await ShellAccountApiHandler.fetchMemberDetails(apiRequestContext, memberNo!);
            membersId = linearId.id;
            await globalPage.captureScreenshot('Pension Member Selection page');
        });

    }


    await allure.step("Validate member age for Condition of Release", async () => {
        const memberId = getMemberId();
        if (pensionMember.generate_test_data_from_api && memberId) {
            const { memberAge } = await MemberApiHandler.memberCorrespondenceInfo(memberApi, memberId);

            await pensionTransactionPage.memberAge(memberAge);
        } else {
            await pensionTransactionPage.memberAge(pensionMember.members.MemberAge[0]);
        }
        await globalPage.captureScreenshot('Member Summary');
    });

    await allure.step("Run the Cohort Process for the same member", async () => {
        await pensionTransactionPage.cohortProcess(memberNo!);
        await globalPage.captureScreenshot('Cohort Process for the same member');

    });

    await allure.step("Validate Retirement Transistion Case is Triggered", async () => {
        allure.logStep("Verify Retirement Transistion Case is displayed correctly");
        await pensionTransactionPage.retirementToTransistionProcess();
        await globalPage.captureScreenshot('Retirement Transistion Case');

    });

    await allure.step("Validate Condition of Release is Updated", async () => {
        allure.logStep("Verify Condition of Release Case is displayed correctly");
        await pensionTransactionPage.conditionOfRelease();
        await globalPage.captureScreenshot('Condition of Release Case');

    });

    await allure.step("Validate Investment Rebalance is switched", async () => {
        allure.logStep("Verify Investment Rebalance PTB Case is displayed correctly");
        const memberId = getMemberId();
        if (memberId) {
            await pensionTransactionPage.investmentsRebalance(true);
            const InvestmentsRebalance = await MemberApiHandler.getMemberInvestmentRebalance(memberApi, memberId, 0, 50);
            allure.attachment('InvestmentsRebalance Transactions Data', JSON.stringify(InvestmentsRebalance, null, 2), 'application/json');
            console.log('InvestmentsRebalance', InvestmentsRebalance);
        } else {
            console.log("memberId is undefined. Cannot fetchInvestmentsRebalance.");
        }

        await globalPage.captureScreenshot('InvestmentsRebalance');

    });

    await allure.step("Validate whether Investments are switched from  Taxed to Untaxed", async () => {
        allure.logStep("Verify whether Funds are moved to Unrestricted non-preserved");
        const memberId = getMemberId();
        if (memberId) {
            
            await pensionTransactionPage.accountBalance();
        } else {
            console.log("memberId is undefined. Cannot fetch account balance.");
        }

        await globalPage.captureScreenshot('investemntsSwitchInfo');

    });

    await allure.step("Validate MAAS Report", async () => {
        const memberId = getMemberId();
        if (memberId) {
            const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MAAS Submit');
            allure.attachment('MAAS Report Data', JSON.stringify(MAASReport, null, 2), 'application/json');
            expect(MAASReport.type).toEqual('MAAS Submit');
            console.log('MAAS Report:', MAASReport);
        } else {
            console.log("memberId is undefined. Cannot fetch MAAS Report.");
        }
    });


})