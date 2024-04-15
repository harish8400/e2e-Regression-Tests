import fs from 'fs';
import { promisify } from 'util';
import xml2js from 'xml2js';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists); // Add this line to import the 'exists' function

export async function readXml(filePath: string): Promise<any> {
  try {
    const fileExists = await existsAsync(filePath); // Check if the file exists
    if (!fileExists) {
      throw new Error(`File not found at path: ${filePath}`);
    }
    const data = await readFileAsync(filePath, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: false });
    return new Promise((resolve, reject) => {
      parser.parseString(data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error reading XML file:', error);
    throw error; // Re-throw the error to handle it in the caller function
  }
}

export async function writeXml(filePath: string, data: any): Promise<void> {
  try {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(data);
    await writeFileAsync(filePath, xml);
  } catch (error) {
    console.error('Error writing XML file:', error);
    throw error; // Re-throw the error to handle it in the caller function
  }
}

export async function validateXmlChanges(finalValues: any, expectedSenderName: string): Promise<boolean> {
  try {
    return finalValues['message:superGateXmlMessage'].request.mrr.headers.senderName === expectedSenderName;
  } catch (error) {
    console.error('Error validating XML changes:', error);
    throw error; // Re-throw the error to handle it in the caller function
  }
}
