import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';
import path from 'path';
import * as fs from 'fs';
import { DataUtils } from '../../../src/utils/data_utils';

let remoteFilePath = `/home/saturn-dev-contribution/inbox`;
let privateKeyPath = path.join(__dirname, '../../../src/aol/data/saturn-sftp_key.pem');
let privateKeyContent = fs.readFileSync(privateKeyPath, 'utf8');
let destinationFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_processed');

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Superstream");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("MRR is processed with TFN", async ({ memberPage, superSteam }) => {

    try {

        let generatedXMLFileName: string | { destinationFileName: string, firstName: string, lastName: string, dob: string };
        await test.step("Generate XML file for upload", async () => {

            generatedXMLFileName = xmlUtility.generateXMLFile("MRRWithTFN.xml");
        });

        await test.step("Upload XML file via File transfer", async () => {
            await superSteam.uploadXMLFile(`${destinationFolder}/${generatedXMLFileName}`, `${remoteFilePath}/${generatedXMLFileName}`, privateKeyPath, privateKeyContent);
        });

        await test.step("Verify member created by Superstream", async () => {
            await new Promise((resolve) => setTimeout(resolve, 20000));
            await memberPage.superstreamMRR();

        });

        await test.step("Verify member creation by Superstream in overview screen", async () => {
            await memberPage.memberOverview();

        });

        await test.step("Validate member creation by Superstream in overview screen", async () => {
            let generatedData;
            if (typeof generatedXMLFileName === "string") {
                generatedData = { destinationFileName: generatedXMLFileName, firstName: '', lastName: '', dob: '' };
            } else {
                // Handle the case where generatedXMLFileName is an object
                generatedData = generatedXMLFileName;
            }

            // Get expected values from generated data
            const expectedFirstName = generatedData.firstName;
            console.log(expectedFirstName);
            const expectedLastName = generatedData.lastName;
            console.log(expectedLastName)
            const expectedDOB = generatedData.dob;
            console.log(expectedDOB)

            // Get expected values from the UI
            const actualFirstName = await memberPage.getFirstName();
            console.log(actualFirstName)
            const actualLastName = await memberPage.getLastName();
            console.log(actualLastName)
            const actualDOB = await memberPage.getDOB();
            console.log(actualDOB)
            if (
                actualFirstName === expectedFirstName &&
                actualLastName === expectedLastName &&
                actualDOB === expectedDOB
            ) {
                console.log("Validation: UI values match with expected values from XML.");
            } else {
                console.error("Validation: UI values do not match with expected values from XML.");
            }
        });



    } catch (error) {
        throw error;
    }

})

test("MRR is processed with out TFN", async () => {

    xmlUtility.generateXMLFile("MRRWithoutTFN.xml");

})
test.only("CTR is processed with TFN", async () => {
    xmlUtility.generateCTRWithTFNXML("CTRWithTFN.xml");
})