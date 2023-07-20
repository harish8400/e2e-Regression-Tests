import { expect } from "@playwright/test";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { BeneficaryApiHandler, DltaBeneficary } from "../../../src/dlta/api/handlers/beneficiary_api_handler";
import { CASE_NOTE, CASE_STATUS } from "../../../constants";
import { CaseApiHandler } from "../../../src/dlta/api/handlers/case_api_handler";
import { MolBeneficary } from "../../../src/mol/hfm/pom/beneficiaries_page";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToBeneficiaries();
})

test("MOL view beneficiaries @mol @mol_beneficiaries_view", async ({ beneficiariesPage, caseApi, memberApi, memberId }) => {
    await test.step("Data prep - DLTA delete all beneficiaries", async () => {
        await BeneficaryApiHandler.deleteMemberBeneficiaries(memberApi, caseApi, memberId);
    })

    await test.step("Verify no beneficiaries", async () => {
        await beneficiariesPage.reload();
        await expect(beneficiariesPage.noBeneficiariesHeading).toBeVisible();
        await expect(beneficiariesPage.noBeneficiariesYetParagraph).toBeVisible();
    })

    await test.step("Data prep - DLTA add beneficiaries", async () => {
        let beneficiariesToCreate: Array<DltaBeneficary> = [
            {
                entityName: "Beneficiary One",
                percent: 60,
                dob: "1981-01-01",
                beneficiaryType: "nonBinding",
                relationship: "spouse",
                contactDetails: []
            },
            {
                entityName: "Beneficiary Two",
                percent: 40,
                dob: "2000-12-31",
                beneficiaryType: "nonBinding",
                relationship: "child",
                contactDetails: []
            }
        ]

        await BeneficaryApiHandler.createMemberBeneficiaries(memberApi, caseApi, memberId, beneficiariesToCreate);
    })

    await test.step("Verify has beneficiaries", async () => {
        await beneficiariesPage.reload();

        await expect(beneficiariesPage.beneficiarySummary.first()).toBeVisible();

        let expectedBeneficiaries = [
            { "header": "Beneficiary One: 60%", "description": "Relationship: Spouse" },
            { "header": "Beneficiary Two: 40%", "description": "Relationship: Child" }
        ];
        let actualBeneficiaries = await beneficiariesPage.getBeneficiaries();
        expect(actualBeneficiaries).toEqual(expectedBeneficiaries);
    })
})

test("MOL add beneficiaries @mol @mol_beneficiaries_add", async ({ beneficiariesPage, memberApi, caseApi, memberId }) => {
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

    await test.step("Approve case in DLTA", async () => {
        await CaseApiHandler.waitForCaseGroupStatus(caseApi, caseGroupId, CASE_STATUS.IN_REVIEW);
        await CaseApiHandler.approveCaseGroup(caseApi, caseGroupId);
        await CaseApiHandler.waitForCaseGroupCaseWithNote(caseApi, caseGroupId, CASE_NOTE.NEW_MEMBER_BENEFICIARY_LETTER_PAYLOAD_SENT);
        //TODO check letter payload
        await CaseApiHandler.closeGroupWithSuccess(memberApi, memberId, caseGroupId)
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