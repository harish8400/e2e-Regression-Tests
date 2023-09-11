import { expect } from "@playwright/test";
import { BeneficaryApiHandler } from "../../../src/dlta/api/handlers/beneficiary_api_handler";
import { molVgAccumTest as test } from "./setup/mol_vg_test"
import { MolBeneficary } from "../../../src/mol/common/pom/mol_beneficiaries_base_page";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { CASE_NOTE } from "../../../constants";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.sideNavbar.clickBeneficiaries();
})

test("VG MOL view beneficiaries @mol @mol_beneficiaries_view", async ({ beneficiariesPage, caseApi, memberApi, memberId }) => {

    //TODO: handle if update already in progress
    await test.step("Data prep - DLTA delete all beneficiaries", async () => {
        await BeneficaryApiHandler.deleteMemberBeneficiaries(memberApi, caseApi, memberId);
        await beneficiariesPage.reload();
    })

    let beneficiariesToAdd: MolBeneficary[] = [
        {
            relationship: "Spouse",
            name: "Spouse Beneficiary",
            dateOfBirth: "01/01/1981",
            percentage: 75
        },
        {
            relationship: "Child",
            name: "Child Beneficiary",
            dateOfBirth: "30/01/2002",
            percentage: 25
        }
    ];
    await test.step("Add non-binding beneficiaries", async () => {
        await beneficiariesPage.addNonBindingBeneficiaries(beneficiariesToAdd);
    })

    let caseGroupId = await beneficiariesPage.waitForBeneficiariesPostResponseCaseGroupId();

    await test.step("Check successfully submitted message", async () => {
        let expectedSuccessText = "Request successfully submitted.";
        await expect(beneficiariesPage.messageItem).toHaveText(expectedSuccessText);
    })

    await test.step("Wait for DLTA processing", async () => {
        await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.NEW_MEMBER_BENEFICIARY_LETTER_PAYLOAD_SENT);
        //TODO check letter payload
    })

    await test.step("Check beneficiaries updated in MOL", async () => {
        await beneficiariesPage.reload();
        await expect(beneficiariesPage.beneficiarySummary.first()).toBeVisible();

        let expectedBeneficiaries = beneficiariesToAdd.map(ben => {
            return { "header": `${ben.name}: ${ben.percentage}%`, "description": `Relationship: ${ben.relationship}` }
        })
        let actualBeneficiaries = await beneficiariesPage.getBeneficiaries();
        expect(actualBeneficiaries).toEqual(expectedBeneficiaries);
    })

})
