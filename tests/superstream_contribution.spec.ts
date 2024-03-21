import { allure } from "allure-playwright";
import { aolTest as test } from "../src/aol/base_aol_test"
import SftpClient from 'ssh2-sftp-client';
import path from "path";
import { readXml } from '../src/utils/xml_utils';
import { UtilsAOL } from "../src/aol/utils_aol";
import { Builder } from "xml2js";
import * as fs from 'fs';
import superStreamData from "../src/aol/data/super_stream.json"
import { FUND } from "../constants";
import employeeData from "../src/aol/data/employers.json"

let currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD
let superGateMessageId = `${currentDate}.115734.123@superchoice.com.au`;
let randomSuffix = Math.floor(Math.random() * 1000); // 
let conversationId = `Contribution.84111122223.${currentDate}111812${randomSuffix}`;
let xmlFileName = `MRR_${currentDate}_115734_123_${conversationId}.xml`;
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

test('superstream-MRR', async ({memberPage,superSteam}) => {
 
  try {

    let title = UtilsAOL.randomTitle();
    let name = UtilsAOL.randomName();
    let surName = UtilsAOL.randomSurname(5);
    let dob = UtilsAOL.memberDob();
    let gender = UtilsAOL.randomGender();
    let tfn = UtilsAOL.generateValidTFN();
    const isTFNProvided = true;
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

    // Define XML builder
    const xmlBuilder = new Builder();

    // Define XML structure with dynamic and static values
    const xmlObject = {
      'message:superGateXmlMessage': {
        $: {
          xmlns: 'http://integration.universal.superchoice.com.au/messages/message',
          xmlnsAddress: 'http://integration.universal.superchoice.com.au/domain/address/address',
          xmlnsAmount: 'http://integration.universal.superchoice.com.au/domain/amount/amount',
          xmlnsAustralianBusinessNumber: 'http://integration.universal.superchoice.com.au/domain/government/australianBusinessNumber',
          xmlnsAustralianTaxFileNumber: 'http://integration.universal.superchoice.com.au/domain/government/australianTaxFileNumber',
          xmlnsBankAccount: 'http://integration.universal.superchoice.com.au/domain/banking/bankAccount',
          xmlnsBankStateBranch: 'http://integration.universal.superchoice.com.au/domain/banking/bankStateBranch',
          xmlnsBasicMember: 'http://integration.universal.superchoice.com.au/domain/member/basicMember',
          xmlnsCompany: 'http://integration.universal.superchoice.com.au/domain/company/company',
          xmlnsContributionTransaction: 'http://integration.universal.superchoice.com.au/domain/transaction/contributionTransaction',
          xmlnsContributionTransactionResponse: 'http://integration.universal.superchoice.com.au/domain/transaction/contributionTransactionResponse',
          xmlnsConversationIdentifier: 'http://integration.universal.superchoice.com.au/domain/identifiers/conversationIdentifier',
          xmlnsCountryCode: 'http://integration.universal.superchoice.com.au/domain/country/countryCode',
          xmlnsCurrency: 'http://integration.universal.superchoice.com.au/domain/amount/currency',
          xmlnsDateTime: 'http://integration.universal.superchoice.com.au/domain/moment/dateTime',
          xmlnsDayOfMonth: 'http://integration.universal.superchoice.com.au/domain/moment/dayOfMonth',
          xmlnsDefinedBenefits: 'http://integration.universal.superchoice.com.au/domain/employment/definedBenefits',
          xmlnsEmailAddress: 'http://integration.universal.superchoice.com.au/domain/email/emailAddress',
          xmlnsEmployer: 'http://integration.universal.superchoice.com.au/domain/employer/employer',
          xmlnsEmploymentAttributes: 'http://integration.universal.superchoice.com.au/domain/employment/employmentAttributes',
          xmlnsEmploymentPayrollNumber: 'http://integration.universal.superchoice.com.au/domain/employment/employmentPayrollNumber',
          xmlnsEmploymentStatus: 'http://integration.universal.superchoice.com.au/domain/employment/employmentStatus',
          xmlnsGender: 'http://integration.universal.superchoice.com.au/domain/person/gender',
          xmlnsMemberContributionsContext: 'http://integration.universal.superchoice.com.au/domain/member/memberContributionsContext',
          xmlnsMemberNumber: 'http://integration.universal.superchoice.com.au/domain/member/memberNumber',
          xmlnsMemberTransaction: 'http://integration.universal.superchoice.com.au/domain/transaction/memberTransaction',
          xmlnsMemberTransactionResponse: 'http://integration.universal.superchoice.com.au/domain/transaction/memberTransactionResponse',
          xmlnsMessageIdentifier: 'http://integration.universal.superchoice.com.au/domain/identifiers/messageIdentifier',
          xmlnsMonth: 'http://integration.universal.superchoice.com.au/domain/moment/month',
          xmlnsName: 'http://integration.universal.superchoice.com.au/domain/person/name',
          xmlnsNameCurrency: 'http://integration.universal.superchoice.com.au/domain/person/nameCurrency',
          xmlnsNameType: 'http://integration.universal.superchoice.com.au/domain/person/nameType',
          xmlnsNameUsageCode: 'http://integration.universal.superchoice.com.au/domain/person/nameUsageCode',
          xmlnsNegativeAmounts: 'http://integration.universal.superchoice.com.au/domain/employment/negativeAmounts',
          xmlnsParameters: 'http://integration.universal.superchoice.com.au/domain/framework/parameters',
          xmlnsPartIdentifier: 'http://integration.universal.superchoice.com.au/domain/identifiers/partIdentifier',
          xmlnsPayee: 'http://integration.universal.superchoice.com.au/domain/payment/payee',
          xmlnsPayer: 'http://integration.universal.superchoice.com.au/domain/payment/payer',
          xmlnsPaymentReferenceNumber: 'http://integration.universal.superchoice.com.au/domain/payment/paymentReferenceNumber',
          xmlnsPaymentType: 'http://integration.universal.superchoice.com.au/domain/payment/paymentType',
          xmlnsPerson: 'http://integration.universal.superchoice.com.au/domain/person/person',
          xmlnsPersonAttributes: 'http://integration.universal.superchoice.com.au/domain/person/personAttributes',
          xmlnsPhoneNumber: 'http://integration.universal.superchoice.com.au/domain/phoneNumber/phoneNumber',
          xmlnsReceiver: 'http://integration.universal.superchoice.com.au/domain/receiver/receiver',
          xmlnsSender: 'http://integration.universal.superchoice.com.au/domain/sender/sender',
          xmlnsStandardMember: 'http://integration.universal.superchoice.com.au/domain/member/standardMember',
          xmlnsStandardMemberAttributes: 'http://integration.universal.superchoice.com.au/domain/member/standardMemberAttributes',
          xmlnsStandardMemberContribution: 'http://integration.universal.superchoice.com.au/domain/member/standardMemberContribution',
          xmlnsStandardMemberEmployment: 'http://integration.universal.superchoice.com.au/domain/member/standardMemberEmployment',
          xmlnsStandardRequestTransactionContent: 'http://integration.universal.superchoice.com.au/domain/transaction/standardRequestTransactionContent',
          xmlnsStandardTransaction: 'http://integration.universal.superchoice.com.au/domain/transaction/standardTransaction',
          xmlnsState: 'http://integration.universal.superchoice.com.au/domain/country/state',
          xmlnsSuperFundGeneratedEmployerIdentifier: 'http://integration.universal.superchoice.com.au/domain/funds/superFundGeneratedEmployerIdentifier',
          xmlnsText: 'http://integration.universal.superchoice.com.au/domain/framework/text',
          xmlnsTransactionResponse: 'http://integration.universal.superchoice.com.au/domain/transaction/transactionResponse',
          xmlnsTransportHeaders: 'http://integration.universal.superchoice.com.au/domain/transport/transportHeaders',
          xmlnsUniqueSuperFundIdentifier: 'http://integration.universal.superchoice.com.au/domain/government/uniqueSuperFundIdentifier',
          xmlnsVersion: 'http://integration.universal.superchoice.com.au/domain/version/version',
          xmlnsWithDate: 'http://integration.universal.superchoice.com.au/domain/framework/withDate',
          xmlnsWorkingHours: 'http://integration.universal.superchoice.com.au/domain/employment/workingHours',
          xmlnsXsi: 'http://www.w3.org/2001/XMLSchema-instance',
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
                  taxFileNumberNotProvided: isTFNProvided,
                  ...(isTFNProvided ? {} : { tfnEntityIdentifier: tfn }),
                  employerProvidedTaxFileNumber: '286380519',
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
  await superSteam.performUpload(xmlFilePath, remoteFilePath, privateKeyPath, privateKeyContent);
  console.log('Uploaded file:', remoteFilePath);
} catch (error) {
  console.error('Error performing file upload:', error);
}

await new Promise((resolve) => setTimeout(resolve, 20000));
await memberPage.superstreamMRR();
});

