
import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';
import path from 'path';
import * as fs from 'fs';
import { DataUtils } from '../../../src/utils/data_utils';
import assert from 'assert';

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

test("MRR is processed with TFN -@MRR", async ({ memberPage, superSteam ,globalPage}) => {

    try {

        let generatedXMLFileName: string | { destinationFileName: string, firstName: string, lastName: string, dob: string ,tfnIs:boolean};
        await test.step("Generate XML file for upload", async () => {

            generatedXMLFileName = xmlUtility.generateXMLFile("MRRWithTFN.xml");
        });

        await test.step("Upload XML file via File transfer", async () => {
            const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
            await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
        });

        await test.step("Verify member created by Superstream", async () => {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            await memberPage.verifySuperstreamMRRProcess();
           

        });

        await test.step("Verify Member Details of Superstream member creation", async () => {
            await memberPage.memberOverview();
            let xmlData = generatedXMLFileName as { destinationFileName: string, firstName: string, lastName: string, dob: string ,tfnIs:boolean};

            // Get expected values from generated data
            const expectedFirstName = xmlData.firstName;
            const expectedLastName = xmlData.lastName;
            const expectedDOB = xmlData.dob;
            const tfn = xmlData.tfnIs;
            console.log(`Expected Member Data From UI Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDOB}`)
            allure.logStep(`Expected Member Data From UI Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDOB}`);

            // Get expected values from the UI
            const actualFirstName = await memberPage.getFirstName();
            const actualLastName = await memberPage.getLastName();
            const actualDOB = await memberPage.getDOB();
            const tfnStatus = await memberPage.getTFN();
            console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
            allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);
            await globalPage.captureScreenshot('Members Overview page');
        
        

            if (
                actualFirstName === expectedFirstName &&
                actualLastName === expectedLastName &&
                actualDOB === expectedDOB
            ) {
                allure.logStep("Validation: UI values matched with expected values from XML.");
            } else {
                allure.logStep("Validation: UI values do not match with expected values from XML.");
            }

            if(tfn == true){
                assert.equal(tfnStatus,"Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            }else {
                assert.equal(tfnStatus,"Valid");
                allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            }
        });



    } catch (error) {
        throw error;
    }

})

test("MRR is processed with out TFN", async ({memberPage, superSteam ,globalPage}) => {

    try {

        let generatedXMLFileName: string | { destinationFileName: string, firstName: string, lastName: string, dob: string,tfnIs:boolean};
        await test.step("Generate XML file for upload", async () => {

            generatedXMLFileName = xmlUtility.generateXMLFile("MRRWithoutTFN.xml");
        });

        await test.step("Upload XML file via File transfer", async () => {
            const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
            await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
        });

        await test.step("Verify member created by Superstream", async () => {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            await memberPage.verifySuperstreamMRRProcess();
           

        });

        await test.step("Verify Member Details of Superstream member creation", async () => {
            await memberPage.memberOverview();
            let xmlData = generatedXMLFileName as { destinationFileName: string, firstName: string, lastName: string, dob: string,tfnIs:boolean };

            // Get expected values from generated data
            const expectedFirstName = xmlData.firstName;
            const expectedLastName = xmlData.lastName;
            const expectedDOB = xmlData.dob;
            const tfn = xmlData.tfnIs;
            console.log(`Expected Member Data From UI Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDOB}`)
            allure.logStep(`Expected Member Data From UI Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDOB}`);

            // Get expected values from the UI
            const actualFirstName = await memberPage.getFirstName();
            const actualLastName = await memberPage.getLastName();
            const actualDOB = await memberPage.getDOB();
            const tfnStatus = await memberPage.getTFN();
            console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
            allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);
            await globalPage.captureScreenshot('Members Overview page');
        
        

            if (
                actualFirstName === expectedFirstName &&
                actualLastName === expectedLastName &&
                actualDOB === expectedDOB
            ) {
                allure.logStep("Validation: UI values matched with expected values from XML.");
            } else {
                allure.logStep("Validation: UI values do not match with expected values from XML.");
            }

            if(tfn == true){
                assert.equal(tfnStatus,"Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            }else {
                assert.equal(tfnStatus,"Valid");
            }
        });



    } catch (error) {
        throw error;
    }

})
test.only("CTR is processed with TFN", async () => {
    xmlUtility.generateCTRWithTFNXML("CTRWithTFN.xml");
})