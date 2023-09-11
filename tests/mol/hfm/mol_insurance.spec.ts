import { expect } from "@playwright/test";
import { CASE_STATUS, LINK_TYPE } from "../../../constants";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { LinkApiHandler } from "../../../src/dlta/api/handlers/link_api_handler";
import { InsuranceApiHandler, InsurancePolicy } from "../../../src/dlta/api/handlers/insurance_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navbar.clickInsurance();
})

test("MOL insurance opt-in @mol @mol_insurance_opt-in", async ({ insurancePage, memberApi, caseApi, memberId }) => {
    await test.step("Data prep - DLTA delete existing insurance and opt-in", async () => {
        await InsuranceApiHandler.deleteAllPolicies(memberApi, caseApi, memberId);
        await LinkApiHandler.deleteLinkType(memberApi, caseApi, memberId, LINK_TYPE.INSURANCE_OPT_IN);
    });

    //assuming 61 years old
    let policies: Array<InsurancePolicy> = [
        { category: "STD Death", coverAmount: 45000, premium: 12.09 },
        { category: "STD TPD", coverAmount: 45000, premium: 31.10 },
        { category: "STD IP 2y 60d", coverAmount: 30000, premium: 83.48 }
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
            death: { cover: "$45,000.00", fee: "$12.09" },
            tpd: { cover: "$45,000.00", fee: "$31.10" },
            ip: { cover: "up to $2,500.00\nper month\nup to 2 years\nbenefit period\n60 days\nwaiting period", fee: "$83.48" }
        };
        let actualInsurance = await insurancePage.getInsurance();
        expect(actualInsurance).toEqual(expectedInsurance);
    });
})
