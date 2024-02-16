import path from 'path';
import { aolTest as test } from '../src/aol/base_aol_test';
import { UtilsAOL } from '../src/aol/utils_aol';
import { readXml, validateXmlChanges } from '../src/utils/xml_utils';
import { Builder } from 'xml2js';
import * as fs from 'fs';


let xmlFilePath = path.join(__dirname, '../src/aol/data/xml_files/data.xml');
let member = UtilsAOL.randomName();
let surname = UtilsAOL.randomSurname(5);

test('xml file validation', async ({ }) => {
  // Read existing values from the XML file
  const existingValues: any = await readXml(xmlFilePath);
  const xmlMessage = existingValues.message || existingValues['message:superGateXmlMessage'];

  if (xmlMessage && xmlMessage.request && xmlMessage.request.mrr && xmlMessage.request.mrr.headers) {

    xmlMessage.request.mrr.headers.senderName = member;

    if (xmlMessage.superGateXmlMessage && xmlMessage.superGateXmlMessage.content) {
      const content = xmlMessage.superGateXmlMessage.content;

      if (content.receiver && content.receiver.organisationName) {
        content.receiver.organisationName.value = 'Vanguard';
      }

      if (content.employer && content.employer.organisationName) {
        content.employer.organisationName.value = 'Grow';
      }

      if (content.member && content.member.name) {
        content.member.name.firstName = member;
        content.member.name.lastName = surname;
      }

      if (content.member && content.member.dob) {
        content.member.dob.year = '1955';
        content.member.dob.month = 'Feb';
        content.member.dob.day = '15';
      }

      if (content.member && content.member.address && content.member.address.australianAddress) {
        content.member.address.australianAddress.type = 'Resident';
      }

      if (content.member && content.member.name) {
        // Ensure that content.member.name is defined
        content.member.name.title = 'Mr.';
        content.member.name.firstName = 'John'; 
        content.member.name.lastName = 'Doe'; 
      } else {
        console.error('content.member.name is undefined or null.');
      }

      if (content.member && content.member.phoneNumber) {
        content.member.phoneNumber = content.member.phoneNumber.map((phone: any) => {
          if (phone.phoneNumberType === 'MOBILE_PHONE' && phone.phoneNumberUsage === 'Personal') {
            return {
              ...phone,
              mobileNumber: '+610417977573',
            };
          }
          return phone;
        });
      }

      // Update the values
      if (content.member && content.member.annualSalaryforBenefits) {
        content.member.annualSalaryforBenefits.value = '850';
        content.member.annualSalaryforBenefits.currency = 'AUD';
      }

      if (content.member && content.member.annualSalaryforContributions) {
        content.member.annualSalaryforContributions.value = '200';
        content.member.annualSalaryforContributions.currency = 'AUD';
      }

      if (content.member && content.member.annualSalaryforInsurance) {
        content.member.annualSalaryforInsurance.value = '100';
        content.member.annualSalaryforInsurance.currency = 'AUD';
      }

      if (content.member && content.member.gender) {
        content.member.gender = 'MALE';
      }

      if (content.member && content.member.taxFileNumberNotProvided) {
        content.member.taxFileNumberNotProvided = false;
      }
    }

    // Convert JSON to XML using xml2js
    const xmlBuilder = new Builder();
    const xmlContent = xmlBuilder.buildObject(existingValues);

    // Log the modified XML content
    console.log('Modified XML content:', xmlContent);

    // Write the modified values back to the XML file
    fs.writeFileSync(xmlFilePath, xmlContent);

    // Read values from the modified XML file
    const finalValues = await readXml(xmlFilePath);

    // Log or use the read values as needed
    console.log('Read XML values:', finalValues);
    console.dir(finalValues['message:superGateXmlMessage'].request.mrr, { depth: null });

    if (await validateXmlChanges(finalValues, member)) {
      console.log('XML is successfully updated with the written values.');
    } else {
      console.error('XML update validation failed.');
      console.log('Expected senderName:', member);
      console.log(
        'Actual senderName:',
        finalValues['message:superGateXmlMessage'].request.mrr.headers.senderName
      );
    }
  } else {
    console.error('XML update validation failed.');
  }
});
