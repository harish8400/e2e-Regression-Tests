
import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';
import path from 'path';
import * as fs from 'fs';
import { DataUtils } from '../../../src/utils/data_utils';
import assert from 'assert';
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as SelectionOfMember from "../../../src/aol/data/superstream_vg_data.json";



export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});


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

test("MRR is processed with TFN -@MRR", async ({ memberPage, superSteam, globalPage }) => {

    try {

        let generatedXMLFileName: string | { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean };
        await test.step("Generate XML file for upload", async () => {

            generatedXMLFileName = xmlUtility.generateXMLFileForVG("MRRWithTFN_VG.xml");
        });

        await test.step("Upload XML file via File transfer", async () => {
            const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
            await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
        });

        await test.step("Verify member created by Superstream", async () => {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            await memberPage.verifySuperstreamProcess('SuperStream - MRR');


        });

        await test.step("Verify Member Details of Superstream member creation", async () => {
            await memberPage.memberOverview();
            let xmlData = generatedXMLFileName as { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean };

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

            if (tfn == true) {
                assert.equal(tfnStatus, "Not Supplied");
                allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            } else {
                assert.equal(tfnStatus, "Valid");
                allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            }
        });



    } catch (error) {
        throw error;
    }

})

test("MRR is processed with out TFN-@MRR", async ({ memberPage, superSteam, globalPage }) => {

    try {

        let generatedXMLFileName: string | { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean };
        await test.step("Generate XML file for upload", async () => {

            generatedXMLFileName = xmlUtility.generateXMLFileForVG("MRRWithoutTFN_VG.xml");
        });

        await test.step("Upload XML file via File transfer", async () => {
            const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
            await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
        });

        await test.step("Verify member created by Superstream", async () => {
            await new Promise((resolve) => setTimeout(resolve, 50000));
            await memberPage.verifySuperstreamProcess('SuperStream - MRR');


        });

        await test.step("Verify Member Details of Superstream member creation", async () => {
            await memberPage.memberOverview();
            let xmlData = generatedXMLFileName as { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean };

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

            if (tfn === true) {
                assert.equal(tfnStatus, "Not Supplied");
                allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
            } else {
                assert.equal(tfnStatus, "Valid");
            }
        });



    } catch (error) {
        throw error;
    }

})

test("CTR is processed with TFN and Single Contribution-@TFN_CTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };
    await test.step("Generate XML file for upload", async () => {

        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileCTRForVG("CTRWithTFN_VG.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member contribution by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 70000));
        await memberPage.verifySuperstreamProcess('SuperStream - Contribution');
    });

    await test.step("Verify Member Contribution Details In Transactions Screen", async () => {
        await memberPage.memberTransaction();
        let xmlData = generatedXMLFileName as { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };

        // Get expected values from generated data
        const expectedEmployerOrganisationName = xmlData.employerOrganisationName;
        const expectedAustralianBusinessNumber = xmlData.australianBusinessNumber;
        const expectedConversationId = xmlData.conversationId;
        console.log(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);
        allure.logStep(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);


        // Get expected values from the UI
        const actualEmployerOrganisationName = await memberPage.getEmployerOrganisationName();
        const actualAustralianBusinessNumber = await memberPage.getAustralianBusinessNumber();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member Data processed from UI Is: ${actualEmployerOrganisationName}, ${actualAustralianBusinessNumber}, ${actualConversationId}`);
        await globalPage.captureScreenshot('Paymnent Details');

        const amount = await memberPage.getAmountContributed();
        allure.logStep(`Amount contributed to the member is: ${amount}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Message Type Is: ${message}`);

        if (
            actualEmployerOrganisationName === expectedEmployerOrganisationName &&
            actualAustralianBusinessNumber === expectedAustralianBusinessNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

})

test("CTR is processed without TFN and Single Contribution-@withoutTFN_CTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };
    await test.step("Generate XML file for upload", async () => {
        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileCTRForVG("CTRWithoutTFN_VG.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member contribution by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Contribution');
    });

    await test.step("Verify Member Contribution Details In Transactions Screen", async () => {
        await memberPage.memberTransaction();
        let xmlData = generatedXMLFileName as { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };

        // Get expected values from generated data
        const expectedEmployerOrganisationName = xmlData.employerOrganisationName;
        const expectedAustralianBusinessNumber = xmlData.australianBusinessNumber;
        const expectedConversationId = xmlData.conversationId;
        console.log(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);
        allure.logStep(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);


        // Get expected values from the UI
        const actualEmployerOrganisationName = await memberPage.getEmployerOrganisationName();
        const actualAustralianBusinessNumber = await memberPage.getAustralianBusinessNumber();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member Data processed from UI Is: ${actualEmployerOrganisationName}, ${actualAustralianBusinessNumber}, ${actualConversationId}`);
        await globalPage.captureScreenshot('Paymnent Details');

        const amount = await memberPage.getAmountContributed();
        allure.logStep(`Amount contributed to the member is: ${amount}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Message Type Is: ${message}`);

        if (
            actualEmployerOrganisationName === expectedEmployerOrganisationName &&
            actualAustralianBusinessNumber === expectedAustralianBusinessNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

})

test("CTR is processed without TFN and Multiple Contributions-@withoutTFN_Multiple_CTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };
    await test.step("Generate XML file for upload", async () => {
        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileCTRForVG("CTRMultiple.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member contribution by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Contribution');
    });

    await test.step("Verify Member Contribution Details In Transactions Screen", async () => {
        await memberPage.memberTransaction();
        let xmlData = generatedXMLFileName as { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };

        // Get expected values from generated data
        const expectedEmployerOrganisationName = xmlData.employerOrganisationName;
        const expectedAustralianBusinessNumber = xmlData.australianBusinessNumber;
        const expectedConversationId = xmlData.conversationId;
        console.log(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);
        allure.logStep(`Expected Member Data From XML Is: ${expectedEmployerOrganisationName}, ${expectedAustralianBusinessNumber}, ${expectedConversationId}`);

        // Get expected values from the UI
        const actualEmployerOrganisationName = await memberPage.getEmployerOrganisationName();
        const actualAustralianBusinessNumber = await memberPage.getAustralianBusinessNumber();
        const amount = await memberPage.getAmountContributed();
        allure.logStep(`Amount contributed to the member is: ${amount}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Message Type Is: ${message}`);
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member Data processed from UI Is: ${actualEmployerOrganisationName}, ${actualAustralianBusinessNumber}, ${actualConversationId}`);
        await globalPage.captureScreenshot('Paymnent Details');

        if (
            actualEmployerOrganisationName === expectedEmployerOrganisationName &&
            actualAustralianBusinessNumber === expectedAustralianBusinessNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }

        await memberPage.memberWithoutTFNMultipleContributions();
    });

})


