import { allure } from "allure-playwright";
import { aolTest as test } from "../src/aol/base_aol_test"
import SftpClient from 'ssh2-sftp-client';
import path from "path";
import { readXml } from '../src/utils/xml_utils';
import { UtilsAOL } from "../src/aol/utils_aol";
import { Builder, BuilderOptions } from "xml2js";
import * as fs from 'fs';
import superStreamData from "../src/aol/data/super_stream.json"
import { FUND } from "../constants";
import employeeData from "../src/aol/data/employers.json"

let currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
let superGateMessageId = `${currentDate}.115734.123@superchoice.com.au`;
let randomSuffix = Math.floor(Math.random() * 100);
let conversationId = `Contribution.84111122223.${currentDate}1118125${randomSuffix}`;
let xmlFileName = `MRR_${currentDate}_115734_123_${conversationId}.xml`;
//let xmlFilePath = path.join(__dirname, `../src/aol/data/processed_templates/mrr/${xmlFileName}`);
let xmlFilePath = path.join(__dirname, `../src/aol/data/${xmlFileName}`);
let remoteFilePath = `/home/saturn-dev-contribution/inbox/${xmlFileName}`;
let privateKeyPath = path.join(__dirname, '../src/aol/data/saturn-sftp_key.pem');
let privateKeyContent = fs.readFileSync(privateKeyPath, 'utf8');

test.beforeEach(async ({ navBar }) => {
  test.setTimeout(600000);
  await navBar.selectProduct();
  await allure.suite("Super Stream");
  await allure.parentSuite(process.env.PRODUCT!);
});

test("SFTP Test -To download the file", async () => {

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

test('superstream-MRR', async ({ memberPage, superSteam }) => {

  try {

    let title = UtilsAOL.randomTitle();
    let name = UtilsAOL.randomName();
    let surName = UtilsAOL.randomSurname(5);
    let dob = UtilsAOL.memberDob();
    let gender = UtilsAOL.randomGender();
    let tfn = UtilsAOL.generateValidTFN();
    const isTFNProvided = false;
    let number = UtilsAOL.randomNumber(20);

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


    const xmlBuilderOptions: BuilderOptions = {
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      }
    };
    // Define XML builder with options
    const xmlBuilder = new Builder(xmlBuilderOptions);


    // Define XML structure with dynamic and static values
    const xmlObject = {
      'message:superGateXmlMessage': {
        $: {
          'xmlns:address': 'http://integration.universal.superchoice.com.au/domain/address/address',
          'xmlns:amount': 'http://integration.universal.superchoice.com.au/domain/amount/amount',
          'xmlns:australianBusinessNumber': 'http://integration.universal.superchoice.com.au/domain/government/australianBusinessNumber',
          'xmlns:australianTaxFileNumber': 'http://integration.universal.superchoice.com.au/domain/government/australianTaxFileNumber',
          'xmlns:bankAccount': 'http://integration.universal.superchoice.com.au/domain/banking/bankAccount',
          'xmlns:bankStateBranch': 'http://integration.universal.superchoice.com.au/domain/banking/bankStateBranch',
          'xmlns:basicMember': 'http://integration.universal.superchoice.com.au/domain/member/basicMember',
          'xmlns:company': 'http://integration.universal.superchoice.com.au/domain/company/company',
          'xmlns:contributionTransaction': 'http://integration.universal.superchoice.com.au/domain/transaction/contributionTransaction',
          'xmlns:contributionTransactionResponse': 'http://integration.universal.superchoice.com.au/domain/transaction/contributionTransactionResponse',
          'xmlns:conversationIdentifier': 'http://integration.universal.superchoice.com.au/domain/identifiers/conversationIdentifier',
          'xmlns:countryCode': 'http://integration.universal.superchoice.com.au/domain/country/countryCode',
          'xmlns:currency': 'http://integration.universal.superchoice.com.au/domain/amount/currency',
          'xmlns:dateTime': 'http://integration.universal.superchoice.com.au/domain/moment/dateTime',
          'xmlns:dayOfMonth': 'http://integration.universal.superchoice.com.au/domain/moment/dayOfMonth',
          'xmlns:definedBenefits': 'http://integration.universal.superchoice.com.au/domain/employment/definedBenefits',
          'xmlns:emailAddress': 'http://integration.universal.superchoice.com.au/domain/email/emailAddress',
          'xmlns:employer': 'http://integration.universal.superchoice.com.au/domain/employer/employer',
          'xmlns:employmentAttributes': 'http://integration.universal.superchoice.com.au/domain/employment/employmentAttributes',
          'xmlns:employmentPayrollNumber': 'http://integration.universal.superchoice.com.au/domain/employment/employmentPayrollNumber',
          'xmlns:employmentStatus': 'http://integration.universal.superchoice.com.au/domain/employment/employmentStatus',
          'xmlns:gender': 'http://integration.universal.superchoice.com.au/domain/person/gender',
          'xmlns:memberContributionsContext': 'http://integration.universal.superchoice.com.au/domain/member/memberContributionsContext',
          'xmlns:memberNumber': 'http://integration.universal.superchoice.com.au/domain/member/memberNumber',
          'xmlns:memberTransaction': 'http://integration.universal.superchoice.com.au/domain/transaction/memberTransaction',
          'xmlns:memberTransactionResponse': 'http://integration.universal.superchoice.com.au/domain/transaction/memberTransactionResponse',
          'xmlns:message': 'http://integration.universal.superchoice.com.au/messages/message',
          'xmlns:messageIdentifier': 'http://integration.universal.superchoice.com.au/domain/identifiers/messageIdentifier',
          'xmlns:month': 'http://integration.universal.superchoice.com.au/domain/moment/month',
          'xmlns:name': 'http://integration.universal.superchoice.com.au/domain/person/name',
          'xmlns:nameCurrency': 'http://integration.universal.superchoice.com.au/domain/person/nameCurrency',
          'xmlns:nameType': 'http://integration.universal.superchoice.com.au/domain/person/nameType',
          'xmlns:nameUsageCode': 'http://integration.universal.superchoice.com.au/domain/person/nameUsageCode',
          'xmlns:negativeAmounts': 'http://integration.universal.superchoice.com.au/domain/employment/negativeAmounts',
          'xmlns:parameters': 'http://integration.universal.superchoice.com.au/domain/framework/parameters',
          'xmlns:partIdentifier': 'http://integration.universal.superchoice.com.au/domain/identifiers/partIdentifier',
          'xmlns:payee': 'http://integration.universal.superchoice.com.au/domain/payment/payee',
          'xmlns:payer': 'http://integration.universal.superchoice.com.au/domain/payment/payer',
          'xmlns:paymentReferenceNumber': 'http://integration.universal.superchoice.com.au/domain/payment/paymentReferenceNumber',
          'xmlns:paymentType': 'http://integration.universal.superchoice.com.au/domain/payment/paymentType',
          'xmlns:person': 'http://integration.universal.superchoice.com.au/domain/person/person',
          'xmlns:personAttributes': 'http://integration.universal.superchoice.com.au/domain/person/personAttributes',
          'xmlns:phoneNumber': 'http://integration.universal.superchoice.com.au/domain/phoneNumber/phoneNumber',
          'xmlns:receiver': 'http://integration.universal.superchoice.com.au/domain/receiver/receiver',
          'xmlns:sender': 'http://integration.universal.superchoice.com.au/domain/sender/sender',
          'xmlns:standardMember': 'http://integration.universal.superchoice.com.au/domain/member/standardMember',
          'xmlns:standardMemberAttributes': 'http://integration.universal.superchoice.com.au/domain/member/standardMemberAttributes',
          'xmlns:standardMemberContribution': 'http://integration.universal.superchoice.com.au/domain/member/standardMemberContribution',
          'xmlns:standardMemberEmployment': 'http://integration.universal.superchoice.com.au/domain/member/standardMemberEmployment',
          'xmlns:standardRequestTransactionContent': 'http://integration.universal.superchoice.com.au/domain/transaction/standardRequestTransactionContent',
          'xmlns:standardTransaction': 'http://integration.universal.superchoice.com.au/domain/transaction/standardTransaction',
          'xmlns:state': 'http://integration.universal.superchoice.com.au/domain/country/state',
          'xmlns:superFundGeneratedEmployerIdentifier': 'http://integration.universal.superchoice.com.au/domain/funds/superFundGeneratedEmployerIdentifier',
          'xmlns:text': 'http://integration.universal.superchoice.com.au/domain/framework/text',
          'xmlns:transactionResponse': 'http://integration.universal.superchoice.com.au/domain/transaction/transactionResponse',
          'xmlns:transportHeaders': 'http://integration.universal.superchoice.com.au/domain/transport/transportHeaders',
          'xmlns:uniqueSuperFundIdentifier': 'http://integration.universal.superchoice.com.au/domain/government/uniqueSuperFundIdentifier',
          'xmlns:version': 'http://integration.universal.superchoice.com.au/domain/version/version',
          'xmlns:withDate': 'http://integration.universal.superchoice.com.au/domain/framework/withDate',
          'xmlns:workingHours': 'http://integration.universal.superchoice.com.au/domain/employment/workingHours',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
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
              conversationId,
              partId: '1',
              from: {
                value: '84111122223'
              },
              to: {
                value: '92381911598'
              },
              agreementReference: {
                value: 'http://sbr.gov.au/agreement/Gateway/1.0/Push/PKI'
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
              electronicErrorMessaging: 'true',
              noOfParts: '1',
              senderAbn: '84111122223',
              senderName: 'Header Sender Name'
            },

            content: {
              sender: {
                organisationName: {
                  type: 'Main or legal name',
                  value: 'David Alexander Baxter Superannuation Fund'
                },
                personName: {
                  firstName: 'SFirstname',
                  lastName: 'SLastname'
                },
                emailAddress: {
                  emailAddressUsage: 'Contact',
                  value: 'senderfirstnam.senderlastname@vesper.com.au'
                },
                phoneNumber: {
                  phoneNumberType: 'LAND_LINE',
                  phoneNumberUsage: 'Contact',
                  landLineNumber: {
                    areaCode: '07',
                    landLineNumber: '94587412'
                  }
                },

                context: {
                  contextIdentifier: 'SND01',
                  entityIdentifier: '78109509739'
                }
              },
              receiver: {
                organisationName: {
                  type: 'Main or legal name',
                  value: organisationName ? organisationName.value : ''
                },
                context: {
                  contextIdentifier: 'RCR01',
                  entityIdentifier: sourceAbn
                }
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
              },
              member: {
                name: {
                  title,
                  firstName: name,
                  lastName: surName
                },
                gender: gender,
                dob: {
                  year: dob.year,
                  month: dob.month,
                  day: dob.day
                },
                address: {
                  australianAddress: {
                    type: 'RES',
                    line1: '842 Amely Landing',
                    suburb: 'New Brent',
                    postCode: '4000',
                    stateOrTerritory: 'QLD',
                    countryCode: 'AU'
                  }
                },
                email: {
                  emailAddressUsage: 'Contact',
                  value: 'gopu.balu@grow.inc'
                },
                phoneNumber: [
                  {
                    phoneNumberType: 'MOBILE_PHONE',
                    phoneNumberUsage: 'Personal',
                    mobileNumber: '0430187865'
                  },
                  {
                    phoneNumberType: 'MOBILE_PHONE',
                    phoneNumberUsage: 'Contact',
                    mobileNumber: '0430187123'
                  }
                ],
                taxFileNumberNotProvided: isTFNProvided.toString(),
                employerProvidedTaxFileNumber: tfn,
                employmentPayrollNumber: '001',
                employmentStartDate: '2022-06-30T12:00:00',
                annualSalaryforBenefits: {
                  value: '850',
                  currency: 'AUD'
                },
                annualSalaryforContributions: {
                  value: '200',
                  currency: 'AUD'
                },
                annualSalaryforInsurance: {
                  value: '100',
                  currency: 'AUD'
                },
                employmentStatus: 'Contractor',
                context: {
                  contextIdentifier: 'Member1',
                  ...(isTFNProvided
                    ? { otherEntityIdentifier: number }
                    : { tfnEntityIdentifier: tfn }),
                  employersABN: entityIdentifier,
                  superannuationFundABN: '60905115061',
                  superannuationFundUSI: '60905115061001'
                }
              }
            }
          }
        }
      }
    }

    // Convert XML object to string

    const xmlString = xmlBuilder.buildObject(xmlObject);

    // Write XML string to file
    fs.writeFileSync(xmlFilePath, xmlString);

    console.log(`XML file '${xmlFileName}' generated successfully.`);

    // Read existing values from the saved XML file
    const readXmlValues = await readXml(xmlFilePath);

    // Log the read XML content
    console.log('Read XML values:', readXmlValues);

    // Perform XML validation as needed
    if (readXmlValues.root && readXmlValues.root.request && readXmlValues.root.request.mrr) {
      console.log('XML is successfully validated with the generated values.');
    } else {

      console.log('Actual XML structure:', readXmlValues); // Log the actual structure
    }


  } catch (error) {
    console.error('Error handling XML:', error);
  }
  try {
    //let existingXMLFile = path.join(__dirname, `../src/aol/data/xmlFileTemplateTest.xml`);
    await superSteam.uploadXMLFile(xmlFilePath, remoteFilePath, privateKeyPath, privateKeyContent)
      .then(() => console.log('XML file upload completed successfully'))
      .catch(error => console.error('Failed to upload XML file:', error));


  } catch (error) {
    console.error('Error performing file upload:', error);
  }

  await new Promise((resolve) => setTimeout(resolve, 20000));
  await memberPage.superstreamMRR();
});

