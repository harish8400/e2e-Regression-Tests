
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

    let templateFilePath = (path.join(__dirname, `${templateFileName}`));
    const absolutePath = `${DataUtils.dataFilesPath}/${templateFileName}`;
    console.log(absolutePath)
    //const templateFilePath: string ="./src/aol/data/superstream_template/XMLFileTemplate.xml"
    let destifolder = (path.join(__dirname, `aol/data/superstream_processed`))

    let formattedDate: string = getCurrentDateFormatted();
    const conversationId: string = `Contribution.84111122223.${formattedDate}111812599`;
    const superGateMessageId: string = `${formattedDate}.115734.123@superchoice.com.au`

    const fileName: string = `MRR_${formattedDate}_115734_123_${conversationId}.XML`;
    const fullFileName: string = copyGeneratedFile(templateFilePath, templateFileName, fileName, destifolder);

    if (fullFileName) {
        console.error("Failed to copy the template file to template File path folder");
    } else {
        updateXML(`${destifolder}\\${fileName}`, superGateMessageId, conversationId);
    }
}

function getCurrentDateFormatted(): string {
    return DateUtils.ddmmyyyStringDate(0);
}


///code for copying the file from local folder to shared folder 



export function copyGeneratedFile(templateFilePath: string, templateFileName: string, fileName: string, destifolder: string) {
    try {
        const files = fs.readdirSync(templateFilePath);

        console.log(files)
        for (const file of files) {
            if (file.includes(templateFileName)) {
                const fullFilePath = path.join(templateFilePath, file);
                const destinationPath = path.join(destifolder, fileName);

                fs.copyFileSync(fullFilePath, destinationPath);
                console.log(`File ${file} copied successfully to ${destinationPath}`);
                return file;
            }
        }

        console.log(`File with name ${templateFileName} was not found in the path ${templateFilePath}`);
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

    setListOfXmlValue(filePath, messageId_nodePath, conversationId);
    setListOfXmlValue(filePath, conversationId_nodePath, superGateMessageId);
    setListOfXmlValue(filePath, tfn_nodePath, "57885");

    console.log("XML file updated successfully");
}

function setListOfXmlValue(filePath: string, nodePath: string, value: string): void {
    try {
        const xmlContent = fs.readFileSync(filePath, 'utf-8');
        const xmlDoc = new DOMParser().parseFromString(xmlContent);

        const nodes = xpath.select(nodePath, xmlDoc);

        for (const node of nodes!) {
            node.textContent = value;
        }

        const builder = new xml2js.Builder();
        const updatedXmlContent = builder.buildObject(xmlDoc);

        fs.writeFileSync(filePath, updatedXmlContent, 'utf-8');
        console.log(`Values updated successfully for nodes at path: ${nodePath}`);
    } catch (error) {
        console.error(`An error occurred while updating XML: ${error}`);
    }
}
