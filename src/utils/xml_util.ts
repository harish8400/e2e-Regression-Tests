
import * as fs from 'fs';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import * as path from 'path';
import { DateUtils } from './date_utils';
import { DataUtils } from './data_utils';
import * as superStreamData from '../aol/data/superstream_data.json';
import * as superStreamDataCTR from '../aol/data/superstream_CTR_data.json';
import { UtilsAOL } from '../aol/utils_aol';

export class xmlUtility {

    static sourceFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_template');
    static destinationFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_processed');

    static generateXMLFile(templateName: string): string | { destinationFileName: string, firstName: string, lastName: string, dob: string ,tfnIs:boolean} {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'MRRWithTFN.xml':
                return this.generateMRRWithTFNXML(templateName);
            case 'MRRWithoutTFN.xml':
                return this.generateMRRWithoutTFNXML(templateName);
            case 'CTRWithTFN.xml':
                return this.generateCTRWithTFNXML(templateName);
    
        }
        return generatedXMLFileName;
    }
    // Generate XML with TFN for MRR
    static generateMRRWithoutTFNXML(templateFileName: string): { destinationFileName: string, firstName: string, lastName: string, dob: string,tfnIs:boolean } {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const conversationId: string = `Contribution.84111122223.${formattedDate}111812${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `MRR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const firstName = UtilsAOL.randomName();
        const lastName = UtilsAOL.randomSurname(5);
        const year = UtilsAOL.getRandomYear();
        const month = UtilsAOL.getRandomMonth();
        const day = UtilsAOL.getRandomDay();
        const dob = UtilsAOL.formatDate(day, month, year);
        let tfnIs = true;

        /// Prepare nodes list to update
        interface nodes {
            [key: string]: any;
        }

        const nodesToUpdate: nodes = {
            "//messageId[1]/conversationId[1]": conversationId,
            "//headers[1]/conversationId[1]": conversationId,
            "//timeInUTC[1]": timeInUTC,
            "//sourceAbn[1]": superStreamData.sourceAbn,
            "//sourceUsi[1]": superStreamData.sourceUsi,
            "//targetAbn[1]": superStreamData.sourceAbn,
            "//targetUsi[1]": superStreamData.sourceUsi,
            "//employer[1]/organisationName[1]/value[1]": superStreamData.employerOrganisationName,
            "//australianBusinessNumber[1]": superStreamData.australianBusinessNumber,
            "//name[1]/firstName[1]": firstName,
            "//name[1]/lastName[1]": lastName,
            "//taxFileNumberNotProvided[1]": tfnIs,
            "//otherEntityIdentifier[1]": superStreamData.otherEntityIdentifier,
            "//member[1]/dob[1]/year[1]":year,
            "//member[1]/dob[1]/month[1]":month,
            "//member[1]/dob[1]/day[1]":day,
        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

        return {
            destinationFileName,
            firstName,
            lastName,
            dob,tfnIs
        };
    }

    // Generate XML for MRR
    static generateMRRWithTFNXML(templateFileName: string): { destinationFileName: string, firstName: string, lastName: string, dob: string,tfnIs:boolean} {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const conversationId: string = `Contribution.84111122223.${formattedDate}111812${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `MRR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const tfn = UtilsAOL.generateValidTFN(); 
        const firstName = UtilsAOL.randomName();
        const lastName = UtilsAOL.randomSurname(5);
        const year = UtilsAOL.getRandomYear();
        const month = UtilsAOL.getRandomMonth();
        const day = UtilsAOL.getRandomDay();
        const dob = UtilsAOL.formatDate(day, month, year);
        let tfnIs = false;



        /// Prepare nodes list to update
        interface nodes {
            [key: string]: any;
        }

        const nodesToUpdate: nodes = {
            "//messageId[1]/conversationId[1]": conversationId,
            "//headers[1]/conversationId[1]": conversationId,
            "//timeInUTC[1]": timeInUTC,
            "//sourceAbn[1]": superStreamData.sourceAbn,
            "//sourceUsi[1]": superStreamData.sourceUsi,
            "//targetAbn[1]": superStreamData.sourceAbn,
            "//targetUsi[1]": superStreamData.sourceUsi,
            "//employer[1]/organisationName[1]/value[1]": superStreamData.employerOrganisationName,
            "//australianBusinessNumber[1]": superStreamData.australianBusinessNumber,
            "//name[1]/firstName[1]": firstName,
            "//name[1]/lastName[1]": lastName,
            "//taxFileNumberNotProvided[1]": tfnIs,
            "//tfnEntityIdentifier[1]": tfn,
            "//employerProvidedTaxFileNumber[1]": tfn,
            "//member[1]/dob[1]/year[1]":year,
            "//member[1]/dob[1]/month[1]":month,
            "//member[1]/dob[1]/day[1]":day,

        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

        return {
            destinationFileName,
            firstName,
            lastName,
            dob,tfnIs
        };
    }

    // Generate XML for CTR with TFN
    static generateCTRWithTFNXML(templateFileName: string) {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const superGateMessageId=`${formattedDate}.010101.000@superchoice.com.au`;
        const conversationId: string = `Contribution.84111122223.${formattedDate}1618411${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `CTR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const tfn = UtilsAOL.generateValidTFN(); 

        /// Prepare nodes list to update
        interface nodes {
            [key: string]: any;
        }
        const nodesToUpdate: nodes = {
            "//messageId[1]/superGateMessageId[1]": superGateMessageId,
            "//messageId[1]/conversationId[1]": conversationId,
            "//headers[1]/conversationId[1]": conversationId,
            "//timeInUTC[1]": timeInUTC,
            "//sourceAbn[1]": superStreamDataCTR.sourceAbn,
            "//sourceUsi[1]": superStreamDataCTR.sourceUsi,
            "//targetAbn[1]": superStreamDataCTR.targetAbn,
            "//targetUsi[1]": superStreamDataCTR.targetUsi,
            "//paymentReferenceNumber[1]":superStreamDataCTR.paymentReferenceNumber,
            "//receiver[1]/organisationName[1]/value[1]":superStreamDataCTR.receiverOrganisationName,
            "//employer[1]/organisationName[1]/value[1]": superStreamDataCTR.employerOrganisationName,
            "//employer[1]/australianBusinessNumber[1]": superStreamDataCTR.australianBusinessNumber,
            "//employer[1]/context[1]/entityIdentifier[1]":superStreamDataCTR.australianBusinessNumber,
            "//payer[1]/paymentReference[1]":superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/paymentReference[1]":superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/context[1]/entityIdentifier[1]":superStreamDataCTR.targetAbn,
            "//payee[1]/context[1]/superannuationFundUSI[1]":superStreamDataCTR.targetUsi,
            "//name[1]/title[1]/title":superStreamDataCTR.memberTitle,
            "//name[1]/firstName[1]":superStreamDataCTR.memberFirstName,
            "//name[1]/lastName[1]":superStreamDataCTR.memberLastName,
            "//member[1]/gender[1]":superStreamDataCTR.memberGender,
            "//member[1]/dob[1]/year[1]":superStreamDataCTR.memberdobYear,
            "//member[1]/dob[1]/month[1]":superStreamDataCTR.memberdobMonth,
            "//member[1]/dob[1]/day[1]":superStreamDataCTR.memberdobDay,
            "//employerProvidedTaxFileNumber[1]": tfn,
            "//tfnEntityIdentifier[1]": tfn,
            "//employersABN[1]":superStreamDataCTR.australianBusinessNumber,
            "//member[1]//memberNumber[1]":superStreamDataCTR.memberNumber,
            "//member[1]/context[1]/superannuationFundABN[1]":superStreamDataCTR.targetAbn,
            "//member[1]/context[1]/superannuationFundUSI[1]":superStreamDataCTR.targetUsi
        };
        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);
            
    }

     // Generate XML for CTR without TFN
    static generateCTRWithoutTFNXML(templateFileName: string) {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const superGateMessageId=`${formattedDate}.010101.000@superchoice.com.au`;
        const conversationId: string = `Contribution.84111122223.${formattedDate}1618411${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `CTR_${formattedDate}_115734_123_${conversationId}_9.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");

        /// Prepare nodes list to update
        interface nodes {
            [key: string]: any;
        }
        const nodesToUpdate: nodes = {
            "//messageId[1]/superGateMessageId[1]": superGateMessageId,
            "//messageId[1]/conversationId[1]": conversationId,
            "//headers[1]/conversationId[1]": conversationId,
            "//timeInUTC[1]": timeInUTC,
            "//sourceAbn[1]": superStreamDataCTR.sourceAbn,
            "//sourceUsi[1]": superStreamDataCTR.sourceUsi,
            "//targetAbn[1]": superStreamDataCTR.targetAbn,
            "//targetUsi[1]": superStreamDataCTR.targetUsi,
            "//paymentReferenceNumber[1]":superStreamDataCTR.paymentReferenceNumber,
            "//receiver[1]/organisationName[1]/value[1]":superStreamDataCTR.receiverOrganisationName,
            "//employer[1]/organisationName[1]/value[1]": superStreamDataCTR.employerOrganisationName,
            "//employer[1]/australianBusinessNumber[1]": superStreamDataCTR.australianBusinessNumber,
            "//employer[1]/context[1]/entityIdentifier[1]":superStreamDataCTR.australianBusinessNumber,
            "//payer[1]/paymentReference[1]":superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/paymentReference[1]":superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/context[1]/entityIdentifier[1]":superStreamDataCTR.targetAbn,
            "//payee[1]/context[1]/superannuationFundUSI[1]":superStreamDataCTR.targetUsi,
            "//name[1]/title[1]/title":superStreamDataCTR.memberTitle,
            "//name[1]/firstName[1]":superStreamDataCTR.memberFirstName,
            "//name[1]/lastName[1]":superStreamDataCTR.memberLastName,
            "//member[1]/gender[1]":superStreamDataCTR.memberGender,
            "//member[1]/dob[1]/year[1]":superStreamDataCTR.memberdobYear,
            "//member[1]/dob[1]/month[1]":superStreamDataCTR.memberdobMonth,
            "//member[1]/dob[1]/day[1]":superStreamDataCTR.memberdobDay,
            "//tfnEntityIdentifier[1]": superStreamDataCTR.employerProvidedTaxFileNumber,
            "//employersABN[1]":superStreamDataCTR.australianBusinessNumber,
            "//member[1]//memberNumber[1]":superStreamDataCTR.memberNumberwithoutTFN,
            "//member[1]/context[1]/superannuationFundABN[1]":superStreamDataCTR.targetAbn,
            "//member[1]/context[1]/superannuationFundUSI[1]":superStreamDataCTR.targetUsi
        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);
    }

    // Copy Template file to Processed folder
    static copyTemplateFileToProcessedFolder(templateFileName: string, destinationFileName: string) {
        const sourceFolder = this.sourceFolder;
        let destinationFolder = this.destinationFolder;
        fs.copyFileSync(`${sourceFolder}/${templateFileName}`, `${destinationFolder}/${destinationFileName}`);
    }

    // Update nodes and save xml
    static updateAndSaveXML(filePath: string, nodesAndValuesList: any): void {
        try {
            const xmlContent = fs.readFileSync(filePath, 'utf8');
            const xmlDoc = new DOMParser().parseFromString(xmlContent);

            // Looping through the nodes list and update each node
            for (const nodePath in nodesAndValuesList) {

                const value = nodesAndValuesList[nodePath];
                const nodes = xpath.select(nodePath, xmlDoc);
                //console.log(`Key: ${nodePath}, Value: ${value}`);

                // Check if nodes is an array of nodes
                if (Array.isArray(nodes)) {
                    // Iterate over selected nodes
                    for (const node of nodes) {
                        // Access node properties or modify node content as needed
                        const element = node as Element;
                        element.textContent = value;
                    }
                } else if (nodes instanceof Node) { // Check if nodes is a single node
                    // Access node properties or modify node content as needed
                    const element = nodes as Element;
                    element.textContent = value;
                } else {
                    console.log('No nodes found for the XPath expression');
                }
            }

            // Serialize the updated XML document back to string
            const updatedXmlContent = xmlDoc.toString();

            // Write the updated XML content back to file
            fs.writeFileSync(filePath, updatedXmlContent, 'utf-8');

        } catch (error) {
            console.error(`An error occurred while updating XML: ${error}`);
        }
    }

    
}
