import { allure } from "allure-playwright";
import { aolTest as test } from "../src/aol/base_aol_test"
import SftpClient from 'ssh2-sftp-client';
import path from "path";
import { readXml, writeXml } from '../src/utils/xml_utils';
import { UtilsAOL } from "../src/aol/utils_aol";
import { Builder } from "xml2js";
import * as fs from 'fs';
import superStreamData from "../src/aol/data/super_stream.json"
import { FUND } from "../constants";
import employeeData from "../src/aol/data/employers.json"


test.beforeEach(async ({ navBar }) => {
  test.setTimeout(600000);
  await navBar.selectProduct();
  await allure.suite("Super Stream");
  await allure.parentSuite(process.env.PRODUCT!);
});

test("SFTP Test -To download the file", async () => {
  // Generate today's date in the required format (YYYYMMDD)
  const today = new Date();
  const fileDate = today.toISOString().slice(0,10).replace(/-/g,"");
  const xmlFileName = `MRR_${fileDate}_115734_123_Contribution.84111122223.${fileDate}111812555_1.xml`;
  const xmlFilePath = path.join(__dirname, `../src/aol/data/${xmlFileName}`);
  const remoteFilePath = `/home/saturn-dev-contribution/inbox/${xmlFileName}`;
  const privateKeyPath = path.join(__dirname, '../src/aol/data/saturn-sftp_key.pem');
  const privateKeyContent = fs.readFileSync(privateKeyPath, 'utf8');

  async function main() {
    const sftp = new SftpClient();
    console.log('Private Key Content:', privateKeyContent);
    try {
      await sftp.connect({
        host: 'superchoice-sftp.dev.tinasuper.com',
        port: 22,
        username: 'saturn-dev-contribution',
        password: 'oghaim8aeNgei1aeho',
        privateKey: privateKeyContent,
        passphrase: 'oghaim8aeNgei1aeho'
      });
      // Perform SFTP operations here
      await sftp.fastGet(remoteFilePath, xmlFilePath);
      console.log('File downloaded successfully.');
    } catch (err: any) {
      console.error('Error:', err.message);
    } finally {
      await sftp.end();
    }
  }

  await main();
});

test("SFTP Test -To upload the file", async () => {
  // Generate today's date in the required format (YYYYMMDD)
  const today = new Date();
  const fileDate = today.toISOString().slice(0,10).replace(/-/g,"");
  const xmlFileName = `MRR_${fileDate}_115734_123_Contribution.84111122223.${fileDate}111812555_1.xml`;
  const xmlFilePath = path.join(__dirname, `../src/aol/data/${xmlFileName}`);
  const remoteFilePath = `/home/saturn-dev-contribution/inbox/${xmlFileName}`;
  const privateKeyPath = path.join(__dirname, '../src/aol/data/saturn-sftp_key.pem');
  const privateKeyContent = fs.readFileSync(privateKeyPath, 'utf8');

  async function main() {
    const sftp = new SftpClient();
    console.log('Private Key Content:', privateKeyContent);
    try {
      await sftp.connect({
        host: 'superchoice-sftp.dev.tinasuper.com',
        port: 22,
        username: 'saturn-dev-contribution',
        password: 'oghaim8aeNgei1aeho',
        privateKey: privateKeyContent,
        passphrase: 'oghaim8aeNgei1aeho'
      });
      
      // Perform SFTP upload operation
      await sftp.fastPut(xmlFilePath, remoteFilePath);
      console.log('File uploaded successfully.');
    } catch (err: any) {
      console.error('Error:', err.message);
    } finally {
      await sftp.end();
    }
  }

  await main();
});

test('xml file validation', async () => {
  try {
    // Define dynamic values
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
    const superGateMessageId = `${currentDate}.115734.123@superchoice.com.au`;
    const randomSuffix = Math.floor(Math.random() * 1000); // 
    const conversationId = `Contribution.84111122223.${currentDate}1118${randomSuffix}_1`;
    const xmlFileName = `MRR_${currentDate}_115734_123_Contribution.84111122223.${currentDate}1118${randomSuffix}_1.xml`;
    const xmlFilePath = path.join(__dirname, `../src/aol/data/${xmlFileName}`);
    let title = UtilsAOL.randomTitle();
    let name  = UtilsAOL.randomName();
    let surName = UtilsAOL.randomSurname(5);

    let sourceAbn, sourceUsi, organisationName, value, entityIdentifier; 

    if (process.env.PRODUCT === FUND.HESTA) {
      ({ sourceAbn, sourceUsi } = superStreamData['HESTA for Mercy']);
      organisationName = superStreamData['organisationName']['HESTA for Mercy']; 
      const hestaForMercyValues = employeeData.Employee['HESTA for Mercy'];
      value = hestaForMercyValues[0].value; 
      entityIdentifier = hestaForMercyValues[0].entity; 
    } else if (process.env.PRODUCT === FUND.VANGUARD) {
      ({ sourceAbn, sourceUsi } = superStreamData['Vanguard Super']);
      organisationName = superStreamData['organisationName']['Vanguard Super']; 
      const vanguardValues = employeeData.Employee['Vanguard Super'];
      value = vanguardValues[0].value; 
      entityIdentifier = vanguardValues[0].entity; 
    } else {
      ({ sourceAbn, sourceUsi } = superStreamData['Australian Ethical Super']);
      organisationName = superStreamData['organisationName']['Australian Ethical Super'];
      const aeValues = employeeData.Employee['Australian Ethical Super'];
      value = aeValues[0].value; 
      entityIdentifier = aeValues[0].entity; 
    }
    

    // Define XML builder
    const xmlBuilder = new Builder();

    // Define XML structure with dynamic and static values
    const xmlObject = {
      'message:superGateXmlMessage': {
        $: {
          xmlns: 'http://integration.universal.superchoice.com.au/messages/message'
        },
        xsdVersion: 'VERSION 2.0.0',
        request: {
          mrr: {
            messageId: {
              superGateMessageId,
              conversationId
            },
            timeInUTC: new Date().toISOString(),
            headers: {
              conversationId
            },
            source: {
              sourceAbn,
              sourceUsi,
              electronicServiceAddress: '172.10.10.3' 
            },
            target: {
              targetAbn: sourceAbn, 
              targetUsi: sourceUsi, 
              electronicServiceAddress: '172.10.10.4' 
            },
            organisationName: {
              type: 'Main or legal name',
              value: organisationName ? organisationName.value : '' 
            },
            context: {
              contextIdentifier: 'RCR01',
              entityIdentifier: sourceAbn 
            },
            employer: { 
              organisationName: {
                type: 'Main or legal name',
                value: value ? value : '' 
              },
              australianBusinessNumber: entityIdentifier, 
              context: {
                contextIdentifier: 'Employer1',
                entityIdentifier: entityIdentifier 
              }
            }
          }
        }
      }
    };

    // Convert XML object to string
    const xmlString = xmlBuilder.buildObject(xmlObject);

    // Write XML string to file
    fs.writeFileSync(xmlFilePath, xmlString);

    console.log(`XML file '${xmlFileName}' generated successfully.`);

    // Introduce a timeout to ensure the file is saved before it's read
    await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the timeout value as needed

    // Read existing values from the saved XML file
    const readXmlValues = await readXml(xmlFilePath);

    // Log the read XML content
    console.log('Read XML values:', readXmlValues);

    // Perform XML validation as needed
    if (readXmlValues.root && readXmlValues.root.request && readXmlValues.root.request.mrr) {
      console.log('XML is successfully validated with the generated values.');
    } else {
      console.error('XML validation failed.');
      console.log('Actual XML structure:', readXmlValues); // Log the actual structure
    }
  } catch (error) {
    console.error('Error handling XML:', error);
  }
});
