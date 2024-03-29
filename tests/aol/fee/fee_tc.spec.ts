import { expect } from "@playwright/test";
import { aolTest as test } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { AssertionError } from "assert";
import * as data from "../../../data/aol_test_data.json";

test.beforeEach(async ({ navBar }) => {
  test.setTimeout(600000);
  await navBar.selectProduct();
  await allure.suite("Fee");
  await allure.parentSuite(process.env.PRODUCT!);
});

test("Verify admin able create fee transaction for commute pention", async ({
  navBar,
  memberTransactionPage,
  //pensionTransactionPage,
}) => {
  {
    // await navBar.navigateToAccumulationMembersPage();
    await navBar.navigateToPensionMembersPage();
    await navBar.selectMember(data.members.member_Adminfee);
    //await pensionTransactionPage.commutationRolloverOut(true);
    await memberTransactionPage.checkAdminFeeTransactionForPensionCommute();
  }
});
