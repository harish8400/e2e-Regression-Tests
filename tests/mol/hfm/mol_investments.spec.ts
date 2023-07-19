import { expect } from "@playwright/test";
import { CASE_NOTE, INVESTMENT_CHANGE_TYPE, INVESTMENT_OPTIONS } from "../../../constants";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { DltaInvestmentSelection, InvestmentApiHandler } from "../../../src/dlta/api/handlers/investment_api_handler";
import { InvestmentChange } from "../../../src/mol/hfm/pom/investments_page";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToInvestments();
})

test("MOL change future investment @mol @mol_future_investments_switch", async ({ investmentsPage, memberApi, caseApi, memberId }) => {
    // data prep - change future investment to something else first
    await test.step("Data prep - DLTA update future investments", async () => {
        let investments: Array<DltaInvestmentSelection> = [{ id: INVESTMENT_OPTIONS.MERCY.ACCUMULATION.DIVERSIFIED_BONDS.ID, percent: 100 }]
        await InvestmentApiHandler.changeFutureInvestment(memberApi, caseApi, memberId, investments);
        await investmentsPage.reload();
        await expect(investmentsPage.futureInvestmentChart).toBeVisible();
        let actualFutureAllocation = await investmentsPage.getFutureAllocation();
        expect(actualFutureAllocation).toEqual([`100.00% ${INVESTMENT_OPTIONS.MERCY.ACCUMULATION.DIVERSIFIED_BONDS.NAME}`]);
    })

    let investmentsChanges: InvestmentChange[] = [
        {
            changeType: INVESTMENT_CHANGE_TYPE.FUTURE_INVESTMENTS,
            investments: [
                { name: INVESTMENT_OPTIONS.MERCY.ACCUMULATION.BALANCED_GROWTH.NAME, percentage: 31 },
                { name: INVESTMENT_OPTIONS.MERCY.ACCUMULATION.AUSTRALIAN_SHARES.NAME, percentage: 34 },
                { name: INVESTMENT_OPTIONS.MERCY.ACCUMULATION.PROPERTY_AND_INFRASTRUCTURE.NAME, percentage: 35 },
            ]
        }
    ];

    await test.step("Change investments", async () => {
        await investmentsPage.changeInvestments(investmentsChanges);
    })

    let caseGroupId = await investmentsPage.waitForInvestmentsPutCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        //success message different in environmentes
        let expectedSuccessText = ENVIRONMENT_CONFIG.name === "uat" ? "Request successfully submitted." : "Your request has been successfully submitted.";
        await expect(investmentsPage.messageItem).toHaveText(expectedSuccessText);
    })

    await test.step("Wait for DLTA processing and close", async () => {
        await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.INVESTMENT_CHANGE_LETTER_PAYLOAD_SENT);
        //TODO check letter payload
        await CaseApiHandler.closeGroupWithSuccess(memberApi, memberId, caseGroupId)
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