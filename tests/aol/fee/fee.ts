import { APIRequestContext, expect } from "@playwright/test";
import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import * as data from "../../../data/aol_test_data.json";
import pensionMember from "../../../data/aol_test_data.json";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";

export const test = base.extend<{ apiRequestContext: APIRequestContext }>({
  apiRequestContext: async ({ }, use) => {
    await use(await initDltaApiContext());
  },
});

test.beforeEach(async ({ navBar }) => {
  test.setTimeout(600000);
  await navBar.selectProduct();
  await allure.suite("Fee");
  await allure.parentSuite(process.env.PRODUCT!);
});

test("Verify admin fee on redemption and application", async ({
  navBar,
  memberTransactionPage,
  globalPage,
  pensionTransactionPage,
  pensionAccountPage,
  apiRequestContext,
  transactionApi,
  //pensionTransactionPage,
}) => {
  {
    let membersId: string | undefined;
    const getMemberId = () => membersId;
    await test.step("Navigate to Pensions Members page", async () => {
      await navBar.navigateToPensionMembersPage();
      await globalPage.captureScreenshot("Pensions Members page");
    });

    //When api is set to true we will use new Shell account creation for testing.
    if (pensionMember.generate_test_data_from_api) {
      // Create New Pension Shell Account
      await test.step("Create New Pension Shell Account", async () => {
        const memberId =
          await pensionTransactionPage.memberPensionShellAccountCreation(
            navBar,
            pensionAccountPage,
            apiRequestContext
          );
        membersId = memberId.linearId.id;
        await globalPage.captureScreenshot("Pension Shell Account Creation");
        await MemberApiHandler.rpbpPayments(apiRequestContext, membersId);
      });

      //when api is set to false, we will use existing member details for testing.
    } else {
      // Select Existing Pension Member
      const memberNo = pensionMember.members.member_Adminfee;
      await test.step("Select Existing Pension Member", async () => {
        await navBar.selectMember(memberNo);
        const linearId = await MemberApiHandler.fetchMemberDetails(
          apiRequestContext,
          memberNo!
        );
        membersId = linearId.id;
        await globalPage.captureScreenshot("Pension Member Selection page");
      });
    }

    // // Commutation Rollout Process
    // await test.step("Perform the Commutation Rollout Process", async () => {
    //   await pensionTransactionPage.commutationRolloverOut(true);
    //   await globalPage.captureScreenshot("Commutation Rollout Process done");
    // });

    await test.step("Verify the Admin fee transaction created for for Pension Commute", async () => {
      await memberTransactionPage.checkAdminFeeTransactionForPensionCommute();
      await globalPage.captureScreenshot(
        "Admin fee transaction"
      );
    });

    // Validate Member Payment Details
    await test.step("Validate Member Fee Details", async () => {
      const linearId = await MemberApiHandler.fetchMemberDetails(
        apiRequestContext,
        data.members.member_Adminfee!
      );
      const memberId = linearId.id;

      if (memberId) {
        const MemberPayments =
          await ShellAccountCreationApiHandler.getMemberPayment(
            transactionApi,
            memberId
          );
        console.log("MemberPayments:", MemberPayments);
      } else {
        console.log("Member ID is undefined. Cannot fetch Member Fee Details.");
      }
    });
  }
});
