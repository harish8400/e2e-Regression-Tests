
import * as fs from 'fs';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import * as path from 'path';
import { DateUtils } from './date_utils';
import { DataUtils } from './data_utils';
import * as superStreamData from '../aol/data/superstream_data.json'
import { UtilsAOL } from '../aol/utils_aol';

export class xmlUtility {

    static sourceFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_template');
    static destinationFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_processed');

    static generateXMLFile(templateName: string): void {

        switch (templateName) {
            case 'MRRWithTFN.xml': this.generateMRRWithTFNXML(templateName);
            case 'MRRWithoutTFN.xml': this.generateMRRWithoutTFNXML(templateName);
        }

    }

    // Generate XML with TFN for MRR
    static generateMRRWithoutTFNXML(templateFileName: string) {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const conversationId: string = `Contribution.84111122223.${formattedDate}111812${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `MRR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");

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
            "//name[1]/firstName[1]": superStreamData.memberFirstName,
            "//name[1]/lastName[1]": superStreamData.memberLastName,
            "//taxFileNumberNotProvided[1]": true,
            "//otherEntityIdentifier[1]": superStreamData.otherEntityIdentifier
        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);
    }

    // Generate XML for MRR
    static generateMRRWithTFNXML(templateFileName: string) {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const conversationId: string = `Contribution.84111122223.${formattedDate}111812${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `MRR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");

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
            "//name[1]/firstName[1]": superStreamData.memberFirstName,
            "//name[1]/lastName[1]": superStreamData.memberLastName,
            "//tfnEntityIdentifier[1]": superStreamData.tfnEntityIdentifier,
            "//employerProvidedTaxFileNumber[1]": superStreamData.employerProvidedTaxFileNumber
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
