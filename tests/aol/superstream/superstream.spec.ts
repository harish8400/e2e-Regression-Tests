
import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';
import path from 'path';
import * as fs from 'fs';
import { DataUtils } from '../../../src/utils/data_utils';
import assert from 'assert';
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as SelectionOfMember from "../../../src/aol/data/superstream_CTR_data.json"
import * as MemberToBeSelected from "../../../src/aol/data/superstream_RTR_data.json"
import { UtilsAOL } from '../../../src/aol/utils_aol';

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

            generatedXMLFileName = xmlUtility.generateXMLFile("MRRWithTFN.xml");
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

            generatedXMLFileName = xmlUtility.generateXMLFile("MRRWithoutTFN.xml");
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
        generatedXMLFileName = await xmlUtility.generateXMLFileCTR("CTRWithTFN.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
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

test("CTR is processed with TFN and Multiple Contributions-@TFN_Multiple_CTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };
    await test.step("Generate XML file for upload", async () => {
        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileCTR("CTRWithTFN_MultipleContribution.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
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

        await memberPage.multipleContributions();
    });

})

test("CTR is processed without TFN and Single Contribution-@withoutTFN_CTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string };
    await test.step("Generate XML file for upload", async () => {
        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileCTR("CTRWithoutTFN.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
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
        generatedXMLFileName = await xmlUtility.generateXMLFileCTR("CTRWithoutTFN_MultipleContribution.xml", apiRequestContext, SelectionOfMember.isMemberToSelectExsisting, SelectionOfMember.isTFNToBePassed);
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

test("RTR is processed with TFN -@TFN_RTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };
    await test.step("Generate XML file for upload", async () => {

        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileRTR("RTRWithTFN_APRA.xml", apiRequestContext, MemberToBeSelected.isMemberToSelectExsisting, MemberToBeSelected.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member rollover-in by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Rollover In');
    });

    await test.step("Verify Member rollover-in Details In Transactions Screen", async () => {

        if (MemberToBeSelected.isMemberToSelectExsisting === true) {
            await memberPage.memberOverview();
        } else {

            await memberPage.memberNumberLink();

        }

        let xmlData = generatedXMLFileName as { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };

        // Get expected values from generated data

        const expectedFirstName = xmlData.member;
        const expectedLastName = xmlData.surName;
        const expectedDob = xmlData.dob
        const formattedDate = UtilsAOL.dateFormat(expectedDob);
        console.log(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob} `);
        allure.logStep(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob}`);

        // Get expected values from the UI
        const actualFirstName = await memberPage.getFirstName();
        const actualLastName = await memberPage.getLastName();
        const actualDOB = await memberPage.getDOB();
        const tfnStatus = await memberPage.getTFN();
        console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
        allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);

        if (!tfnStatus) {
            assert.equal(tfnStatus, "Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        } else {
            assert.equal(tfnStatus, "Valid");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        }
        await globalPage.captureScreenshot('Members Overview page');

        if (
            actualFirstName === expectedFirstName &&
            actualLastName === expectedLastName &&
            formattedDate === actualDOB
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }


        await memberPage.rollInTransaction();

        // Get expected values from generated data

        const expectedPaymentReferenceNumber = xmlData.paymentReferenceNumber;
        const expectedConversationId = xmlData.conversationId;
        const expectedTaxAmount = xmlData.taxed;
        const expectedNonTaxAmount = xmlData.unTaxed;
        const expectedPreservedAmount = xmlData.preserved;
        const expectedUnPreservedAmount = xmlData.unrestricted;
        const expectedRestrictedAmount = xmlData.restricted;
        console.log(`Expected Member payment Details From XML Is: ${expectedTaxAmount} ,${expectedNonTaxAmount},${expectedPreservedAmount},${expectedUnPreservedAmount},${expectedRestrictedAmount}`);
        const messageType = await memberPage.getMessageType();
        allure.logStep(`Expected Message Type from xml Is: ${messageType}`);
        allure.logStep(`Expected Member payment Details From XML Is: taxedAmount = ${expectedTaxAmount} , nonTaxedAmount = ${expectedNonTaxAmount},preservedAmount = ${expectedPreservedAmount},unPreservedAmount = ${expectedUnPreservedAmount},restrictedAmount = ${expectedRestrictedAmount}`);

        const actualTaxAmount = await memberPage.taxedComponent();
        const actualNonTaxAmount = await memberPage.unTaxedComponent();
        const actualPreservedAmount = await memberPage.preservedComponent();
        const actualUnPreservedAmount = await memberPage.unPreservedComponent();
        const actualRestrictedAmount = await memberPage.unTaxedComponent();
        const actualPaymentReferenceNumber = await memberPage.paymentReference();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member payment Details from UI Is: taxedAmount = ${actualTaxAmount}, nonTaxedAmount = ${actualNonTaxAmount}, preservedAmount = ${actualPreservedAmount},unPreservedAmount = ${actualUnPreservedAmount},restrictedAmount = ${actualRestrictedAmount}`);

        await globalPage.captureScreenshot('Paymnent Details');

        allure.logStep(`Expected PaymentReferenceNumber is: ${expectedPaymentReferenceNumber}, actual PaymentReferenceNumber is: ${actualPaymentReferenceNumber}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Actual Message Type from UI Is: ${message}`);
        allure.logStep(`Expected conversationId is: ${expectedConversationId}, actual conversationId is: ${actualConversationId}`);

        if (
            await actualPaymentReferenceNumber === expectedPaymentReferenceNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

});

test("RTR is processed without TFN -@withoutTFN_RTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };
    await test.step("Generate XML file for upload", async () => {

        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileRTR("RTRWithoutTFN_APRA.xml", apiRequestContext, MemberToBeSelected.isMemberToSelectExsisting, MemberToBeSelected.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member rollover-in by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Rollover In');
    });

    await test.step("Verify Member rollover-in Details In Transactions Screen", async () => {
        if (MemberToBeSelected.isMemberToSelectExsisting === true) {
            await memberPage.memberOverview();
        } else {

            await memberPage.memberNumberLink();

        }

        let xmlData = generatedXMLFileName as { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };

        // Get expected values from generated data

        const expectedFirstName = xmlData.member;
        const expectedLastName = xmlData.surName;
        const expectedDob = xmlData.dob
        const formattedDate = UtilsAOL.dateFormat(expectedDob);
        console.log(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob} `);
        allure.logStep(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob}`);

        // Get expected values from the UI
        const actualFirstName = await memberPage.getFirstName();
        const actualLastName = await memberPage.getLastName();
        const actualDOB = await memberPage.getDOB();
        const tfnStatus = await memberPage.getTFN();
        console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
        allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);

        if (tfnStatus) {
            assert.equal(tfnStatus, "Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        } else {
            assert.equal(tfnStatus, "Valid");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        }
        await globalPage.captureScreenshot('Members Overview page');

        if (
            actualFirstName === expectedFirstName &&
            actualLastName === expectedLastName &&
            formattedDate === actualDOB
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }


        await memberPage.rollInTransaction();

        // Get expected values from generated data

        const expectedPaymentReferenceNumber = xmlData.paymentReferenceNumber;
        const expectedConversationId = xmlData.conversationId;
        const expectedTaxAmount = xmlData.taxed;
        const expectedNonTaxAmount = xmlData.unTaxed;
        const expectedPreservedAmount = xmlData.preserved;
        const expectedUnPreservedAmount = xmlData.unrestricted;
        const expectedRestrictedAmount = xmlData.restricted;
        console.log(`Expected Member payment Details From XML Is: ${expectedTaxAmount} ,${expectedNonTaxAmount},${expectedPreservedAmount},${expectedUnPreservedAmount},${expectedRestrictedAmount}`);
        allure.logStep(`Expected Member payment Details From XML Is: taxedAmount = ${expectedTaxAmount} , nonTaxedAmount = ${expectedNonTaxAmount},preservedAmount = ${expectedPreservedAmount},unPreservedAmount = ${expectedUnPreservedAmount},restrictedAmount = ${expectedRestrictedAmount}`);

        const actualTaxAmount = await memberPage.taxedComponent();
        const actualNonTaxAmount = await memberPage.unTaxedComponent();
        const actualPreservedAmount = await memberPage.preservedComponent();
        const actualUnPreservedAmount = await memberPage.unPreservedComponent();
        const actualRestrictedAmount = await memberPage.unTaxedComponent();
        const actualPaymentReferenceNumber = await memberPage.paymentReference();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member payment Details from UI Is: taxedAmount = ${actualTaxAmount}, nonTaxedAmount = ${actualNonTaxAmount}, preservedAmount = ${actualPreservedAmount},unPreservedAmount = ${actualUnPreservedAmount},restrictedAmount = ${actualRestrictedAmount}`);

        await globalPage.captureScreenshot('Paymnent Details');

        allure.logStep(`Expected PaymentReferenceNumber is: ${expectedPaymentReferenceNumber}, actual PaymentReferenceNumber is: ${actualPaymentReferenceNumber}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Message Type Is: ${message}`);
        allure.logStep(`Expected conversationId is: ${expectedConversationId}, actual conversationId is: ${actualConversationId}`);

        if (
            await actualPaymentReferenceNumber === expectedPaymentReferenceNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

});

test("RTR is processed from SMSF with TFN -@TFN_RTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };
    await test.step("Generate XML file for upload", async () => {

        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileRTR("RTRWithTFN_SMSF.xml", apiRequestContext, MemberToBeSelected.isMemberToSelectExsisting, MemberToBeSelected.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member SMSF rollover-in by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Rollover In');
    });

    await test.step("Verify Member SMSF rollover-in Details In Transactions Screen", async () => {

        if (MemberToBeSelected.isMemberToSelectExsisting === true) {
            await memberPage.memberOverview();
        } else {

            await memberPage.memberNumberLink();

        }

        let xmlData = generatedXMLFileName as { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };

        // Get expected values from generated data

        const expectedFirstName = xmlData.member;
        const expectedLastName = xmlData.surName;
        const expectedDob = xmlData.dob
        const formattedDate = UtilsAOL.dateFormat(expectedDob);
        console.log(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob} `);
        allure.logStep(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob}`);

        // Get expected values from the UI
        const actualFirstName = await memberPage.getFirstName();
        const actualLastName = await memberPage.getLastName();
        const actualDOB = await memberPage.getDOB();
        const tfnStatus = await memberPage.getTFN();
        console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
        allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);

        if (!tfnStatus) {
            assert.equal(tfnStatus, "Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        } else {
            assert.equal(tfnStatus, "Valid");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        }
        await globalPage.captureScreenshot('Members Overview page');

        if (
            actualFirstName === expectedFirstName &&
            actualLastName === expectedLastName &&
            formattedDate === actualDOB
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }


        await memberPage.rollInTransaction();

        // Get expected values from generated data

        const expectedPaymentReferenceNumber = xmlData.paymentReferenceNumber;
        const expectedConversationId = xmlData.conversationId;
        const expectedTaxAmount = xmlData.taxed;
        const expectedNonTaxAmount = xmlData.unTaxed;
        const expectedPreservedAmount = xmlData.preserved;
        const expectedUnPreservedAmount = xmlData.unrestricted;
        const expectedRestrictedAmount = xmlData.restricted;
        console.log(`Expected Member payment Details From XML Is: ${expectedTaxAmount} ,${expectedNonTaxAmount},${expectedPreservedAmount},${expectedUnPreservedAmount},${expectedRestrictedAmount}`);
        const messageType = await memberPage.getMessageType();
        allure.logStep(`Expected Message Type from xml Is: ${messageType}`);
        allure.logStep(`Expected Member payment Details From XML Is: taxedAmount = ${expectedTaxAmount} , nonTaxedAmount = ${expectedNonTaxAmount},preservedAmount = ${expectedPreservedAmount},unPreservedAmount = ${expectedUnPreservedAmount},restrictedAmount = ${expectedRestrictedAmount}`);

        const actualTaxAmount = await memberPage.taxedComponent();
        const actualNonTaxAmount = await memberPage.unTaxedComponent();
        const actualPreservedAmount = await memberPage.preservedComponent();
        const actualUnPreservedAmount = await memberPage.unPreservedComponent();
        const actualRestrictedAmount = await memberPage.unTaxedComponent();
        const actualPaymentReferenceNumber = await memberPage.paymentReference();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member payment Details from UI Is: taxedAmount = ${actualTaxAmount}, nonTaxedAmount = ${actualNonTaxAmount}, preservedAmount = ${actualPreservedAmount},unPreservedAmount = ${actualUnPreservedAmount},restrictedAmount = ${actualRestrictedAmount}`);

        await globalPage.captureScreenshot('Paymnent Details');

        allure.logStep(`Expected PaymentReferenceNumber is: ${expectedPaymentReferenceNumber}, actual PaymentReferenceNumber is: ${actualPaymentReferenceNumber}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Actual Message Type from UI Is: ${message}`);
        allure.logStep(`Expected conversationId is: ${expectedConversationId}, actual conversationId is: ${actualConversationId}`);

        if (
            await actualPaymentReferenceNumber === expectedPaymentReferenceNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

});

test("RTR is processed from SMSF without TFN -@withoutTFN_RTR", async ({ memberPage, superSteam, globalPage, apiRequestContext }) => {

    let generatedXMLFileName: string | { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };
    await test.step("Generate XML file for upload", async () => {

        //Here we have set first parameter as isMemberToSelectExsisting which is passing from JSON, so if we make it as true will select Exsisting Member or else if it will create a New Member from API and perform remaining process
        //Here we have set second parameter as isTFNToBePassed which is passing from JSON, so if we make it as false it will provide a TFN for the New Member created from API If we set to true it will create a new member without TFN from API
        generatedXMLFileName = await xmlUtility.generateXMLFileRTR("RTRWithoutTFN_SMSF.xml", apiRequestContext, MemberToBeSelected.isMemberToSelectExsisting, MemberToBeSelected.isTFNToBePassed);
    });

    await test.step("Upload XML file via File transfer", async () => {
        const xmlFileName = (generatedXMLFileName as { destinationFileName: string }).destinationFileName;
        await superSteam.uploadXMLFile(`${destinationFolder}/${xmlFileName}`, `${remoteFilePath}/${xmlFileName}`, privateKeyPath, privateKeyContent);
    });

    await test.step("Verify member SMSF rollover-in by Superstream", async () => {
        await new Promise((resolve) => setTimeout(resolve, 60000));
        await memberPage.verifySuperstreamProcess('SuperStream - Rollover In');
    });

    await test.step("Verify Member SMSF rollover-in Details In Transactions Screen", async () => {
        if (MemberToBeSelected.isMemberToSelectExsisting === true) {
            await memberPage.memberOverview();
        } else {

            await memberPage.memberNumberLink();

        }

        let xmlData = generatedXMLFileName as { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string };

        // Get expected values from generated data

        const expectedFirstName = xmlData.member;
        const expectedLastName = xmlData.surName;
        const expectedDob = xmlData.dob
        const formattedDate = UtilsAOL.dateFormat(expectedDob);
        console.log(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob} `);
        allure.logStep(`Expected Member Data From XML Is: ${expectedFirstName}, ${expectedLastName}, ${expectedDob}`);

        // Get expected values from the UI
        const actualFirstName = await memberPage.getFirstName();
        const actualLastName = await memberPage.getLastName();
        const actualDOB = await memberPage.getDOB();
        const tfnStatus = await memberPage.getTFN();
        console.log(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`)
        allure.logStep(`Actual Member Data processed from XMl Is: ${actualFirstName}, ${actualLastName}, ${actualDOB}`);

        if (tfnStatus) {
            assert.equal(tfnStatus, "Not Supplied");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        } else {
            assert.equal(tfnStatus, "Valid");
            allure.logStep(`Status of the member TFN Is:  ${tfnStatus}`);
        }
        await globalPage.captureScreenshot('Members Overview page');

        if (
            actualFirstName === expectedFirstName &&
            actualLastName === expectedLastName &&
            formattedDate === actualDOB
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }


        await memberPage.rollInTransaction();

        // Get expected values from generated data

        const expectedPaymentReferenceNumber = xmlData.paymentReferenceNumber;
        const expectedConversationId = xmlData.conversationId;
        const expectedTaxAmount = xmlData.taxed;
        const expectedNonTaxAmount = xmlData.unTaxed;
        const expectedPreservedAmount = xmlData.preserved;
        const expectedUnPreservedAmount = xmlData.unrestricted;
        const expectedRestrictedAmount = xmlData.restricted;
        console.log(`Expected Member payment Details From XML Is: ${expectedTaxAmount} ,${expectedNonTaxAmount},${expectedPreservedAmount},${expectedUnPreservedAmount},${expectedRestrictedAmount}`);
        allure.logStep(`Expected Member payment Details From XML Is: taxedAmount = ${expectedTaxAmount} , nonTaxedAmount = ${expectedNonTaxAmount},preservedAmount = ${expectedPreservedAmount},unPreservedAmount = ${expectedUnPreservedAmount},restrictedAmount = ${expectedRestrictedAmount}`);

        const actualTaxAmount = await memberPage.taxedComponent();
        const actualNonTaxAmount = await memberPage.unTaxedComponent();
        const actualPreservedAmount = await memberPage.preservedComponent();
        const actualUnPreservedAmount = await memberPage.unPreservedComponent();
        const actualRestrictedAmount = await memberPage.unTaxedComponent();
        const actualPaymentReferenceNumber = await memberPage.paymentReference();
        const actualConversationId = await memberPage.getConversationId();

        allure.logStep(`Actual Member payment Details from UI Is: taxedAmount = ${actualTaxAmount}, nonTaxedAmount = ${actualNonTaxAmount}, preservedAmount = ${actualPreservedAmount},unPreservedAmount = ${actualUnPreservedAmount},restrictedAmount = ${actualRestrictedAmount}`);

        await globalPage.captureScreenshot('Paymnent Details');

        allure.logStep(`Expected PaymentReferenceNumber is: ${expectedPaymentReferenceNumber}, actual PaymentReferenceNumber is: ${actualPaymentReferenceNumber}`);
        const message = await memberPage.getMessageType();
        allure.logStep(`Message Type Is: ${message}`);
        allure.logStep(`Expected conversationId is: ${expectedConversationId}, actual conversationId is: ${actualConversationId}`);

        if (
            await actualPaymentReferenceNumber === expectedPaymentReferenceNumber &&
            await actualConversationId === expectedConversationId
        ) {
            allure.logStep("Validation: UI values matched with expected values from XML.");
        } else {
            allure.logStep("Validation: UI values do not match with expected values from XML.");
        }
    });

});


