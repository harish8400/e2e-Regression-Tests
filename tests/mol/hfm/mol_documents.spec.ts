import { expect } from "@playwright/test";
import { MOL_DOCUMENT_TYPE } from "../../../constants";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { ENVIRONMENT_CONFIG } from "../../../config/environment_config";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateToDocuments();
})

test("MOL documents filter @mol @mol_documents", async ({ documentsPage }) => {
    test.skip(ENVIRONMENT_CONFIG.name !== "uat", `Can not test MOL documents in '${ENVIRONMENT_CONFIG.name}' environment yet`);

    let expectedDocTitles = ["Beneficiaries Confirmation", "Insurance Commencement", "Investment Change"];
    await test.step(`Check '${expectedDocTitles}' document titles among those displayed`, async () => {
        let actualDocumentTitles = await documentsPage.getDocumentsTitles();
        let uniqueTitles = [...new Set(actualDocumentTitles)];
        let errors: Array<string> = [];
        expectedDocTitles.forEach(expectedTitle => {
            if (!uniqueTitles.includes(expectedTitle)) {
                errors.push(`Expected title '${expectedTitle}' not found`);
            }
        })
        expect(errors, `Expected title/s not found among displayed: ${uniqueTitles}`).toEqual([])
    });

    //TODO: resolve dup steps
    let docType = MOL_DOCUMENT_TYPE.BENEFICIARIES;
    await test.step(`Filter documents list to '${docType}'`, async () => {
        await documentsPage.filterByDocumentType(docType);
    });
    expectedDocTitles = ["Beneficiaries Confirmation"];
    await test.step(`Check only '${expectedDocTitles}' document titles displayed`, async () => {
        let actualDocumentTitles = await documentsPage.getDocumentsTitles();
        let uniqueTitles = [...new Set(actualDocumentTitles)];
        expect(uniqueTitles).toEqual(expectedDocTitles);
    });

    docType = MOL_DOCUMENT_TYPE.INSURANCE;
    await test.step(`Filter documents list to '${docType}'`, async () => {
        await documentsPage.filterByDocumentType(docType);
    });
    expectedDocTitles = ["Insurance Commencement"];
    await test.step(`Check only '${expectedDocTitles}' document titles displayed`, async () => {
        let actualDocumentTitles = await documentsPage.getDocumentsTitles();
        let uniqueTitles = [...new Set(actualDocumentTitles)];
        expect(uniqueTitles).toEqual(expectedDocTitles);
    });

    docType = MOL_DOCUMENT_TYPE.INVESTMENTS;
    await test.step(`Filter documents list to '${docType}'`, async () => {
        await documentsPage.filterByDocumentType(docType);
    });
    expectedDocTitles = ["Investment Change"];
    await test.step(`Check only '${expectedDocTitles}' document titles displayed`, async () => {
        let actualDocumentTitles = await documentsPage.getDocumentsTitles();
        let uniqueTitles = [...new Set(actualDocumentTitles)];
        expect(uniqueTitles).toEqual(expectedDocTitles);
    });

    docType = MOL_DOCUMENT_TYPE.ALL;
    await test.step(`Filter documents list to '${docType}'`, async () => {
        await documentsPage.filterByDocumentType(docType);
    });
    expectedDocTitles = ["Beneficiaries Confirmation", "Insurance Commencement", "Investment Change"];
    await test.step(`Check '${expectedDocTitles}' document titles among those displayed`, async () => {
        let actualDocumentTitles = await documentsPage.getDocumentsTitles();
        let uniqueTitles = [...new Set(actualDocumentTitles)];
        let errors: Array<string> = [];
        expectedDocTitles.forEach(expectedTitle => {
            if (!uniqueTitles.includes(expectedTitle)) {
                errors.push(`Expected title '${expectedTitle}' not found`);
            }
        })
        expect(errors, `Expected title/s not found among displayed: ${uniqueTitles}`).toEqual([])
    });

})