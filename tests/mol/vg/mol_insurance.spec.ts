import { expect } from "@playwright/test";
import { CASE_STATUS, LINK_TYPE } from "../../../constants";
import { molVgAccumTest as test } from "./setup/mol_vg_test"
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { InsuranceApiHandler, InsurancePolicy } from "../../../src/dlta/api/handlers/insurance_api_handler";
import { LinkApiHandler } from "../../../src/dlta/api/handlers/link_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.sideNavbar.clickInsurance();
})

test("MOL insurance opt-in @mol @mol_insurance_opt-in", async ({ insurancePage, memberApi, caseApi, memberId }) => {
    await test.step("Data prep - DLTA delete existing insurance and opt-in", async () => {
        await InsuranceApiHandler.deleteAllPolicies(memberApi, caseApi, memberId);
        await LinkApiHandler.deleteLinkType(memberApi, caseApi, memberId, LINK_TYPE.INSURANCE_OPT_IN);
    });

    //assuming 42 years old
    let policies: Array<InsurancePolicy> = [
        { category: "Default age based Death", coverAmount: 263290.00, premium: 14.22 },
        { category: "Default age based TPD", coverAmount: 131645.00, premium: 3.55 },
    ]
    await test.step("Data prep - DLTA create default pending insurance", async () => {
        await InsuranceApiHandler.createDefaultAiaPendingPolicies(memberApi, caseApi, memberId, policies);
    });

    await test.step("Opt in for insurance", async () => {
        await insurancePage.reload();
        // await expect(insurancePage.optInHeader).toBeVisible();
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
        // await expect(insurancePage.applicationInProgressHeader).toBeVisible();
    });

    await test.step("Data prep - DLTA commence insurance", async () => {
        await InsuranceApiHandler.commenceInsuranceForMember(memberApi, caseApi, memberId);
    });

    await test.step("Check active insurance displayed", async () => {
        await insurancePage.reload();
        let expectedInsurance = {
            death: { cover: "$263,290.00", premium: "$14.22" },
            tpd: { cover: "$131,645.00", premium: "$3.55" },
            ip: { cover: "No cover", premium: "$0.00" }
        };
        let actualInsurance = await insurancePage.getInsurance();
        expect(actualInsurance).toEqual(expectedInsurance);
    });
})