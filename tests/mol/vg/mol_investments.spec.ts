import { expect } from "@playwright/test";
import { CASE_NOTE, INVESTMENT_CHANGE_TYPE, INVESTMENT_OPTIONS } from "../../../constants";
import { molVgAccumTest as test } from "./setup/mol_vg_test"
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { DltaInvestmentSelection, InvestmentApiHandler } from "../../../src/dlta/api/handlers/investment_api_handler";
import { InvestmentChange } from "../../../src/mol/common/pom/mol_investments_base_page";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.sideNavbar.clickInvestments();
})

test("MOL change future investment @mol @mol_future_investments_switch", async ({ investmentsPage, memberApi, caseApi, memberId }) => {
    // data prep - change future investment to something else first
    await test.step("Data prep - DLTA update future investments", async () => {
        let investments: Array<DltaInvestmentSelection> = [{ id: INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.ETHICALLY_CONSCIOUS_GROWTH.ID, percent: 100 }]
        await InvestmentApiHandler.changeFutureInvestment(memberApi, caseApi, memberId, investments);
        await investmentsPage.reload();
        await expect(investmentsPage.futureInvestmentChart).toBeVisible();
        let actualFutureAllocation = await investmentsPage.getFutureAllocation();
        expect(actualFutureAllocation).toEqual([`100.00% ${INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.ETHICALLY_CONSCIOUS_GROWTH.NAME}`]);
    })

    let investmentsChanges: InvestmentChange[] = [
        {
            changeType: INVESTMENT_CHANGE_TYPE.FUTURE_INVESTMENTS,
            investments: [
                { name: INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.CONSERVATIVE.NAME, percentage: 31 },
                { name: INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.AUSTRALIAN_SHARES.NAME, percentage: 34 },
                { name: INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.CASH.NAME, percentage: 35 },
            ]
        }
    ];

    await test.step("Change investments", async () => {
        await investmentsPage.changeInvestments(investmentsChanges);
    })

    let caseGroupId = await investmentsPage.waitForInvestmentsPutCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Request successfully submitted.";
        await expect(investmentsPage.messageItem).toHaveText(expectedSuccessText);
    })

    await test.step("Wait for DLTA processing and close", async () => {
        if (ENVIRONMENT_CONFIG.name === "dev") {
            await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.MEMBER_PROFILE_TYPE_SWITCH_INITIATED);
            await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.UNAUTHORISED);
            await CaseApiHandler.closeGroupWithError(memberApi, memberId, caseGroupId)
        } else {
            await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.INVESTMENT_CHANGE_LETTER_PAYLOAD_SENT);
            //TODO check letter payload
            await CaseApiHandler.closeGroupWithSuccess(memberApi, memberId, caseGroupId)
        }
    })

    await test.step("Check investments updated in MOL", async () => {
        await investmentsPage.reload();
        let expectedFutureAllocation = investmentsChanges
            .find(change => change.changeType === INVESTMENT_CHANGE_TYPE.FUTURE_INVESTMENTS)!!
            .investments.map(investment => { return `${investment.percentage}.00% ${investment.name}` })
            .sort().reverse();

        await expect(investmentsPage.futureInvestmentChart).toBeVisible();
        let actualFutureAllocation = await investmentsPage.getFutureAllocation();
        expect(actualFutureAllocation).toEqual(expectedFutureAllocation);
    })
})