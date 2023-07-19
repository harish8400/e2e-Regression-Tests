import { expect } from "@playwright/test";
import { CASE_STATUS, InsurancePolicy, LINK_TYPE } from "../../../types";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { LinkApiHandler } from "../../../src/dlta/api/handlers/link_api_handler";
import { InsuranceApiHandler } from "../../../src/dlta/api/handlers/insurance_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToInsurance();
})

test("MOL insurance opt-in @mol @mol_insurance_opt-in", async ({ insurancePage, memberApi, caseApi, memberId }) => {
    await test.step("Data prep - DLTA delete existing insurance and opt-in", async () => {
        await InsuranceApiHandler.deleteAllPolicies(memberApi, caseApi, memberId);
        await LinkApiHandler.deleteLinkType(memberApi, caseApi, memberId, LINK_TYPE.INSURANCE_OPT_IN);
    });

    let policies: Array<InsurancePolicy> = [
        { category: "STD Death", coverAmount: 390000, premium: 20.8 },
        { category: "STD TPD", coverAmount: 390000, premium: 27.5925 },
        { category: "STD IP 2y 60d", coverAmount: 30000, premium: 17.05 }
    ]
    await test.step("Data prep - DLTA create standard pending insurance", async () => {
        await InsuranceApiHandler.createStandardPendingPolicies(memberApi, caseApi, memberId, policies);
    });

    await test.step("Opt in for insurance", async () => {
        await insurancePage.reload();
        await expect(insurancePage.optInHeader).toBeVisible();
        await insurancePage.optInToInsurance();
    });

    let caseGroupId = await insurancePage.waitForInsuranceOptInPutCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Your request has been successfully submitted.";
        await expect(insurancePage.messageItem).toHaveText(expectedSuccessText);
    });

    await test.step("Wait for DLTA processing", async () => {
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.COMPLETE);
    });

    await test.step("Check insurance application is in progress", async () => {
        await insurancePage.reload();
        await expect(insurancePage.applicationInProgressHeader).toBeVisible();
    });

    await test.step("Data prep - DLTA commence insurance", async () => {
        await InsuranceApiHandler.commenceInsuranceForMember(memberApi, caseApi, memberId);
    });

    await test.step("Check active insurance displayed", async () => {
        await insurancePage.reload();
        let expectedInsurance = {
            death: { cover: "$390,000.00", fee: "$20.80" },
            tpd: { cover: "$390,000.00", fee: "$27.59" },
            ip: { cover: "up to $2,500.00\nper month\nup to 2 years\nbenefit period\n60 days\nwaiting period", fee: "$17.05" }
        };
        let actualInsurance = await insurancePage.getInsurance();
        expect(actualInsurance).toEqual(expectedInsurance);
    });
})
