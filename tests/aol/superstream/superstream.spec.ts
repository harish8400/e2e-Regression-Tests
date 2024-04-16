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

        let generatedXMLFileName: string;
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

    } catch (error) {
        throw error;
    }

})

test("MRR is processed with out TFN", async () => {

    xmlUtility.generateXMLFile("MRRWithoutTFN.xml");

})
test("CTR is processed with TFN", async () => {
    xmlUtility.generateCTRWithTFNXML("CTRWithTFN.xml");
})