import fs from 'fs';
import { promisify } from 'util';
import xml2js from 'xml2js';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export async function readXml(filePath: string): Promise<any> {
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
}

export async function writeXml(filePath: string, data: any): Promise<void> {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(data);
  await writeFileAsync(filePath, xml);
}

export async function validateXmlChanges(finalValues: any, expectedSenderName: string): Promise<boolean> {
  return (
    finalValues['message:superGateXmlMessage'].request.mrr.headers.senderName === expectedSenderName
  );
}
