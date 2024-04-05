
import * as fs from 'fs';
import xml2js from 'xml2js';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import * as path from 'path';
import { DateUtils } from '../../../src/utils/date_utils';
import { DataUtils } from '../../../src/utils/data_utils';

////main code

export function updateFile(): void {
    const templateFileName: string = "xmlFileTemplate.xml";
    console.log(templateFileName)

    //const templateFilePath = path.join(__dirname, `../../src/aol/data/${templateFileName}`);
    const absolutePath = path.join(DataUtils.dataFilesPath);
    console.log(absolutePath)
    let destifolder = path.join(DataUtils.dataDestiFilePath);
    console.log(destifolder)

    let formattedDate: string = getCurrentDateFormatted();
    const conversationId: string = `Contribution.84111122223.${formattedDate}111812604`;
    const superGateMessageId: string = `${formattedDate}.115734.123@superchoice.com.au`

    const fileName: string = `MRR_${formattedDate}_115734_123_${conversationId}.XML`;
    const fullFileName: string = copyGeneratedFile(absolutePath, templateFileName, fileName, destifolder);
    updateXML(`${destifolder}/${fileName}`, superGateMessageId, conversationId);

    // if (fullFileName) {
    //  console.error("Failed to copy the template file to template File path folder");
    //} else {
    //    updateXML(`${destifolder}\\${fileName}`, superGateMessageId, conversationId);
    // }
}

function getCurrentDateFormatted(): string {
    return DateUtils.yyyymmddStringDate();
}


///code for copying the file from local folder to shared folder 

export function copyGeneratedFile(absolutePath: string, templateFileName: string, fileName: string, destifolder: string) {
    try {
        const files = fs.readdirSync(`/home/minal.tate/MinalAutomation/e2e-regression-tests/src/aol/data/superstream_template`);

        console.log(files)
        for (const file of files) {
            //  if (file.includes(templateFileName)) {
            const fullFilePath = path.join(absolutePath, file);
            console.log(fullFilePath)
            const destinationPath = path.join(destifolder, fileName);
            console.log(destinationPath)
            fs.copyFileSync(fullFilePath, destinationPath);
            // console.log(`File ${file} copied successfully to ${destinationPath}`);
            return file;
            //}
        }

        console.log(`File with name ${absolutePath} was not found in the path ${destifolder}`);
        return "Fail";
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        return "Fail";
    }
}


///update node value

export function updateXML(filePath: string, conversationId: string, superGateMessageId: string): void {
    console.log("Updating the XML File content for edi config");

    const messageId_nodePath: string = "//*[text()='messageId']";
    const conversationId_nodePath: string = "//*[text()='conversationId']";
    const tfn_nodePath: string = "//*[text()='tfn']";

    setListOfXmlValue(filePath, messageId_nodePath, superGateMessageId);
    setListOfXmlValue(filePath, conversationId_nodePath, conversationId);
    setListOfXmlValue(filePath, tfn_nodePath, "57885");

    console.log("XML file updated successfully");
}

function setListOfXmlValue(filePath: string, nodePath: string, value: string): void {
    try {
        // const xmlContent = fs.readFileSync(filePath, 'utf-8');
        // const xmlDoc = new DOMParser().parseFromString(xmlContent);

        // // const nodes = xpath.select(nodePath, xmlDoc)?.toString();
        // // console.log(nodes);
        // // for (let node of nodes!) {
        // //     node = value;
        // // }
        // const nodesToUpdate = xmlDoc.getElementsByTagName(`superGateMessageId`);
        // for (let i = 0; i < nodesToUpdate.length; i++) {
        //     // Modify the node as required
        //     nodesToUpdate[i].textContent = `testSGM`;
        // }
        // const updatedXmlContent = new XMLSerializer().serializeToString(xmlDoc);
        // require('fs').writeFileSync(filePath, updatedXmlContent);
        // const builder = new xml2js.Builder();
        // const updatedXmlContent = builder.buildObject(xmlDoc);

        // fs.writeFileSync(filePath, updatedXmlContent, 'utf-8');

       // Read the XML file
        const xmlContent = require('fs').readFileSync(filePath, 'utf-8');

        // Parse XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

        // Update nodes
        const nodesToUpdate = xmlDoc.getElementsByTagName('genre');
        for (let i = 0; i < nodesToUpdate.length; i++) {
            // Modify the node text content as required
            nodesToUpdate[i].textContent = "geography";
        }

        // Serialize the updated XML content
        // let updatedXmlContent = new XMLSerializer();
        // updatedXmlContent.serializeToString(xmlDoc);
        const builder = new xml2js.Builder();
        const updatedXmlContent = builder.buildObject(xmlDoc);


        // Write the updated XML content back to the file
        require('fs').writeFileSync(filePath, updatedXmlContent);
        console.log(`Values updated successfully for nodes at path: ${nodePath}`);
    } catch (error) {
        console.error(`An error occurred while updating XML: ${error}`);
    }
}
