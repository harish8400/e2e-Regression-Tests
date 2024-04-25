/// <reference lib="dom" />

import xpath from 'xpath';
import * as fs from 'fs';
import { DOMParser } from 'xmldom';
import * as path from 'path';
import { DateUtils } from './date_utils';
import { DataUtils } from './data_utils';
import * as superStreamData from '../aol/data/superstream_data.json';
import * as superStreamDataCTR from '../aol/data/superstream_CTR_data.json';
import { UtilsAOL } from '../aol/utils_aol';
import { MemberPage } from '../aol/pom/member_page';
import { APIRequestContext, Page } from 'playwright';
import { MemberApiHandler } from '../aol_api/handler/member_api_handler';
import { MemberApi } from '../aol_api/member_api';
import { allure } from 'allure-playwright';
import * as superStreamDataRTR from '../aol/data/superstream_RTR_data.json';
import * as superStreamDataIRR from '../aol/data/superstream_IRR_data.json';
import { ShellAccountApiHandler } from '../aol_api/handler/internal_transfer_in_handler';

export class xmlUtility {

    static memberPage: MemberPage;
    static memberApi: MemberApi;
    static sourceFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_template');
    static destinationFolder = path.join(DataUtils.testsDir, 'src/aol/data/superstream_processed');
    static today: Date;

    constructor(page: Page) {
        xmlUtility.memberPage = new MemberPage(page);


    }
    static generateXMLFile(templateName: string): string | { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean } {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'MRRWithTFN.xml':
                return this.generateMRRWithTFNXML(templateName);
            case 'MRRWithoutTFN.xml':
                return this.generateMRRWithoutTFNXML(templateName);
            default:
                return generatedXMLFileName;
        }

    }


    static async generateXMLFileCTR(templateName: string, apiRequestContext: APIRequestContext, isNewMember: boolean, isTFNToBePassed: boolean): Promise<string | { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string }> {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'CTRWithTFN.xml':
                if (!isNewMember) {
                    return await this.generateCTRWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateCTRWithTFNXML(templateName);
                }
            case 'CTRWithTFN_MultipleContribution.xml':
                if (!isNewMember) {
                    return await this.generateCTRWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateCTRWithTFNXML(templateName);
                }
            case 'CTRWithoutTFN.xml':
                if (!isNewMember) {
                    return await this.generateCTRWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateCTRWithoutTFNXML(templateName);
                }
            case 'CTRWithoutTFN_MultipleContribution.xml':
                if (!isNewMember) {
                    return await this.generateCTRWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateCTRWithoutTFNXML(templateName);
                }
            default:
                return generatedXMLFileName;
        }
    }

    static async generateXMLFileRTR(templateName: string, apiRequestContext: APIRequestContext, isNewMember: boolean, isTFNToBePassed: boolean): Promise<string | { destinationFileName: string, paymentReferenceNumber: string, conversationId: string, member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string }> {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'RTRWithTFN_APRA.xml':
                if (!isNewMember) {
                    return await this.generateRTRWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateRTRWithTFNXML(templateName);
                }
            case 'RTRWithoutTFN_APRA.xml':
                if (!isNewMember) {
                    return await this.generateRTRWithoutTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateRTRWithoutTFNXML(templateName);
                }
            case 'RTRWithTFN_SMSF.xml':
                if (!isNewMember) {
                    return await this.generateRTRForSMSFWithTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateRTRForSMSFWithTFNXML(templateName);
                }
            case 'RTRWithoutTFN_SMSF.xml':
                if (!isNewMember) {
                    return await this.generateRTRForSMSFWithoutTFNXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateRTRForSMSFWithoutTFNXML(templateName);
                }

            default:
                return generatedXMLFileName;
        }
    }

    static async generateXMLFileIRR(templateName: string, apiRequestContext: APIRequestContext, isNewMember: boolean, isTFNToBePassed: boolean, transferWholeBalance: boolean, wholeBalanceTransfer: string): Promise<{ destinationFileName: string; conversationId: string; member: string; surName: string; dob: string; }> {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'IRR_APRA.xml':
                if (!isNewMember) {
                    return await this.generateIRRWithRolloverOutForNewMember(templateName, apiRequestContext, transferWholeBalance, wholeBalanceTransfer, isTFNToBePassed);

                } else {
                    return this.generateIRRWithRolloverOut(templateName, apiRequestContext, transferWholeBalance, wholeBalanceTransfer);
                }
            default:
                return { destinationFileName: generatedXMLFileName, conversationId: "", member: "", surName: "", dob: "" }; // Adjust the default return type according to your needs
        }
    }

    static async generateXMLFileGCTR(templateName: string, apiRequestContext: APIRequestContext, isNewMember: boolean, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; payrollNumber: string; member: string; surName: string; year: number; month: string; day: number }> {
        let generatedXMLFileName: string = templateName;
        switch (templateName) {
            case 'GCTR.xml':
                if (!isNewMember) {
                    return await this.generateGCTRXMLForNewMember(templateName, apiRequestContext, isTFNToBePassed);
                } else {
                    return this.generateGCTRXMLForExsistingMember(templateName);
                }
            default:
                // Return a promise that resolves to an object with placeholder values
                return Promise.resolve({
                    destinationFileName: '',
                    paymentReferenceNumber: '',
                    conversationId: '',
                    payrollNumber: '',
                    member: '',
                    surName: '',
                    year: 0,
                    month: '',
                    day: 0
                });
        }
    }
    
    


    // Generate XML with TFN for MRR
    static generateMRRWithoutTFNXML(templateFileName: string): { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean } {

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
            "//member[1]/dob[1]/year[1]": year,
            "//member[1]/dob[1]/month[1]": month,
            "//member[1]/dob[1]/day[1]": day,
        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

        return {
            destinationFileName,
            firstName,
            lastName,
            dob, tfnIs
        };
    }

    // Generate XML for MRR
    static generateMRRWithTFNXML(templateFileName: string): { destinationFileName: string, firstName: string, lastName: string, dob: string, tfnIs: boolean } {

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
            "//member[1]/dob[1]/year[1]": year,
            "//member[1]/dob[1]/month[1]": month,
            "//member[1]/dob[1]/day[1]": day,

        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

        return {
            destinationFileName,
            firstName,
            lastName,
            dob, tfnIs
        };
    }

    // Generate XML for CTR with TFN
    static generateCTRWithTFNXML(templateFileName: string): { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string } {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
        const conversationId: string = `Contribution.84111122223.${formattedDate}1618411${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `CTR_${formattedDate}_115734_123_${conversationId}_1.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const tfn = UtilsAOL.generateValidTFN();
        const employerOrganisationName = superStreamDataCTR.employerOrganisationName;
        const australianBusinessNumber = superStreamDataCTR.australianBusinessNumber;

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
            "//paymentReferenceNumber[1]": superStreamDataCTR.paymentReferenceNumber,
            "//receiver[1]/organisationName[1]/value[1]": superStreamDataCTR.receiverOrganisationName,
            "//employer[1]/organisationName[1]/value[1]": employerOrganisationName,
            "//employer[1]/australianBusinessNumber[1]": australianBusinessNumber,
            "//employer[1]/context[1]/entityIdentifier[1]": australianBusinessNumber,
            "//payer[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/context[1]/entityIdentifier[1]": superStreamDataCTR.targetAbn,
            "//payee[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi,
            "//name[1]/title[1]/title": superStreamDataCTR.memberTitle,
            "//name[1]/firstName[1]": superStreamDataCTR.memberFirstName,
            "//name[1]/lastName[1]": superStreamDataCTR.memberLastName,
            "//member[1]/gender[1]": superStreamDataCTR.memberGender,
            "//member[1]/dob[1]/year[1]": superStreamDataCTR.memberdobYear,
            "//member[1]/dob[1]/month[1]": superStreamDataCTR.memberdobMonth,
            "//member[1]/dob[1]/day[1]": superStreamDataCTR.memberdobDay,
            "//employerProvidedTaxFileNumber[1]": tfn,
            "//tfnEntityIdentifier[1]": tfn,
            "//employersABN[1]": australianBusinessNumber,
            "//member[1]//memberNumber[1]": superStreamDataCTR.memberNumber,
            "//member[1]/context[1]/superannuationFundABN[1]": superStreamDataCTR.targetAbn,
            "//member[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi
        };
        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);
        return {
            destinationFileName, employerOrganisationName, australianBusinessNumber, conversationId

        };
    }

    // Generate XML for CTR without TFN
    static generateCTRWithoutTFNXML(templateFileName: string): { destinationFileName: string, employerOrganisationName: string, australianBusinessNumber: string, conversationId: string } {

        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
        const conversationId: string = `Contribution.84111122223.${formattedDate}1618411${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `CTR_${formattedDate}_115734_123_${conversationId}_9.xml`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const employerOrganisationName = superStreamDataCTR.employerOrganisationName;
        const australianBusinessNumber = superStreamDataCTR.australianBusinessNumber;

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
            "//paymentReferenceNumber[1]": superStreamDataCTR.paymentReferenceNumber,
            "//receiver[1]/organisationName[1]/value[1]": superStreamDataCTR.receiverOrganisationName,
            "//employer[1]/organisationName[1]/value[1]": superStreamDataCTR.employerOrganisationName,
            "//employer[1]/australianBusinessNumber[1]": australianBusinessNumber,
            "//employer[1]/context[1]/entityIdentifier[1]": australianBusinessNumber,
            "//payer[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
            "//payee[1]/context[1]/entityIdentifier[1]": superStreamDataCTR.targetAbn,
            "//payee[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi,
            "//name[1]/title[1]/title": superStreamDataCTR.memberTitle,
            "//name[1]/firstName[1]": superStreamDataCTR.withoutTFNMemberFirstName,
            "//name[1]/lastName[1]": superStreamDataCTR.withoutTFNMemberLastName,
            "//member[1]/gender[1]": superStreamDataCTR.memberGender,
            "//member[1]/dob[1]/year[1]": superStreamDataCTR.withoutTFNMemberdobYear,
            "//member[1]/dob[1]/month[1]": superStreamDataCTR.withoutTFNMemberdobMonth,
            "//member[1]/dob[1]/day[1]": superStreamDataCTR.withoutTFNMemberdobDay,
            "//tfnEntityIdentifier[1]": superStreamDataCTR.employerProvidedTaxFileNumber,
            "//employersABN[1]": australianBusinessNumber,
            "//member[1]//memberNumber[1]": superStreamDataCTR.memberNumberwithoutTFN,
            "//member[1]/context[1]/superannuationFundABN[1]": superStreamDataCTR.targetAbn,
            "//member[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi
        };

        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

        return {
            destinationFileName, employerOrganisationName, australianBusinessNumber, conversationId
        };
    }

    // Copy Template file to Processed folder
    static copyTemplateFileToProcessedFolder(templateFileName: string, destinationFileName: string) {
        const sourceFolder = this.sourceFolder;
        let destinationFolder = this.destinationFolder;
        fs.copyFileSync(`${sourceFolder}/${templateFileName}`, `${destinationFolder}/${destinationFileName}`);
    }


    // Generate XML for CTR with TFN
    static async generateCTRWithTFNXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; employerOrganisationName: string; australianBusinessNumber: string; conversationId: string; }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const conversationId: string = `Contribution.84111122223.${formattedDate}1618411${UtilsAOL.generateRandomThreeDigitNumber()}`;
            const destinationFileName: string = `CTR_${formattedDate}_115734_123_${conversationId}_1.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const employerOrganisationName = superStreamDataCTR.employerOrganisationName;
            const australianBusinessNumber = superStreamDataCTR.australianBusinessNumber;

            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);

            // Extract year, month, and day from dateOfBirth
            let parts = dob.split('-');
            let year = parseInt(parts[0], 10);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            // Extract month name from numeric month
            const month = monthNames[parseInt(parts[1], 10) - 1];
            let day = parseInt(parts[2], 10);


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
                "//paymentReferenceNumber[1]": superStreamDataCTR.paymentReferenceNumber,
                "//receiver[1]/organisationName[1]/value[1]": superStreamDataCTR.receiverOrganisationName,
                "//employer[1]/organisationName[1]/value[1]": employerOrganisationName,
                "//employer[1]/australianBusinessNumber[1]": australianBusinessNumber,
                "//employer[1]/context[1]/entityIdentifier[1]": australianBusinessNumber,
                "//payer[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
                "//payee[1]/paymentReference[1]": superStreamDataCTR.paymentReferenceNumber,
                "//payee[1]/context[1]/entityIdentifier[1]": superStreamDataCTR.targetAbn,
                "//payee[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi,
                "//name[1]/title[1]/title": superStreamDataCTR.memberTitle,
                "//name[1]/firstName[1]": member,
                "//name[1]/lastName[1]": surName,
                "//member[1]/gender[1]": superStreamDataCTR.memberGender,
                "//member[1]/dob[1]/year[1]": year,
                "//member[1]/dob[1]/month[1]": month,
                "//member[1]/dob[1]/day[1]": day,
                "//employerProvidedTaxFileNumber[1]": tfn,
                "//tfnEntityIdentifier[1]": tfn,
                "//employersABN[1]": australianBusinessNumber,
                "//member[1]//memberNumber[1]": memberNo,
                "//member[1]/context[1]/superannuationFundABN[1]": superStreamDataCTR.targetAbn,
                "//member[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi
            };
            allure.logStep(`contribution happened for the member is: ${memberNo}, ${member}, ${surName}, ${year} ${month} ${day}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, employerOrganisationName, australianBusinessNumber, conversationId };
        } catch (error) {
            console.error("Error occurred while generating CTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR with TFN
    static generateRTRWithTFNXML(templateFileName: string): { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string } {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const tfn = UtilsAOL.generateValidTFN();
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            const surName = superStreamDataRTR.memberLastName;
            const member = superStreamDataRTR.memberFirstName;
            const dob = superStreamDataRTR.dob;
            const memberNo = superStreamDataRTR.memberNumber;
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {

                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataCTR.sourceAbn,
                "//*[local-name()='sourceUsi'][1]": superStreamDataCTR.sourceUsi,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": tfn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };


            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);

            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR with TFN for a New Member
    static async generateRTRWithTFNXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);



            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            this.today = new Date();
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;



            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataCTR.sourceAbn,
                "//*[local-name()='sourceUsi'][1]": superStreamDataCTR.sourceUsi,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": tfn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };
            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };


        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR without TFN
    static generateRTRWithoutTFNXML(templateFileName: string): { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string } {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const Id = 'id';
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            const surName = superStreamDataRTR.memberLastNameWithoutTFN;
            const member = superStreamDataRTR.memberFirstNameWithoutTFN;
            const dob = superStreamDataRTR.dobWithoutTFN;
            const memberNo = superStreamDataRTR.memberNumberWithoutTFN;
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {

                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataCTR.sourceAbn,
                "//*[local-name()='sourceUsi'][1]": superStreamDataCTR.sourceUsi,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": Id,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": Id,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };

            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${Id}`);

            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR with TFN for a New Member
    static async generateRTRWithoutTFNXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const Id = 'id';
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            this.today = new Date();
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;



            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataCTR.sourceAbn,
                "//*[local-name()='sourceUsi'][1]": superStreamDataCTR.sourceUsi,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": Id,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": Id,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };
            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };


        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for CTR with TFN
    static generateRTRForSMSFWithTFNXML(templateFileName: string): { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string } {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const tfn = UtilsAOL.generateValidTFN();
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            const surName = superStreamDataRTR.memberLastName;
            const member = superStreamDataRTR.memberFirstName;
            const dob = superStreamDataRTR.dob;
            const memberNo = superStreamDataRTR.memberNumber;
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {

                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": tfn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };


            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);

            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for CTR without TFN
    static generateRTRForSMSFWithoutTFNXML(templateFileName: string): { destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string } {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const Id = 'id';
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            const surName = superStreamDataRTR.memberLastNameWithoutTFN;
            const member = superStreamDataRTR.memberFirstNameWithoutTFN;
            const dob = superStreamDataRTR.dobWithoutTFN;
            const memberNo = superStreamDataRTR.memberNumberWithoutTFN;
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {

                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": Id,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": Id,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };

            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${Id}`);

            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR with TFN for a New Member
    static async generateRTRForSMSFWithTFNXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);



            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            this.today = new Date();
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;



            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": tfn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };
            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };


        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for RTR with TFN for a New Member
    static async generateRTRForSMSFWithoutTFNXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; member: string, surName: string, dob: string, taxed: string, unTaxed: string, preserved: string, unrestricted: string, restricted: string }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.26382680883.${formattedDate}1623341${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-RTR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const Id = 'id';
            const paymentReferenceNumber = superStreamDataRTR.paymentReferenceNo;
            this.today = new Date();
            const taxed = superStreamDataRTR.taxedComponent;
            const unTaxed = superStreamDataRTR.nonTaxableComponent;
            const preserved = superStreamDataRTR.benefitComponentsPreserved;
            const unrestricted = superStreamDataRTR.benefitComponentsUnrestricted;
            const restricted = superStreamDataRTR.benefitComponentsRestricted;



            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);


            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='targetAbn'][1]": superStreamDataCTR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataCTR.targetUsi,
                "//clientRTR/*[local-name()='paymentReferenceNumber'][1]": paymentReferenceNumber,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": Id,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": Id,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='clientRTR']//*[local-name()='memberClientIdentifier'][1]": memberNo,
                "//rolloverComponents/taxableComponentTaxed[1]": taxed,
                "//rolloverComponents/taxableComponentUntaxed[1]": unTaxed,
                "//rolloverComponents/benefitComponentsPreserved[1]": preserved,
                "//rolloverComponents/benefitComponentsUnrestricted[1]": unrestricted,
                "//rolloverComponents/benefitComponentsRestricted[1]": restricted,


            };
            allure.logStep(`Rollover-In happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, member, surName, dob, conversationId, taxed, unTaxed, preserved, unrestricted, restricted };


        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for IRR 
    static generateIRRWithRolloverOut(templateFileName: string, apiRequestContext: APIRequestContext, transferWholeBalance: boolean, wholeBalanceTransfer: string): { destinationFileName: string; conversationId: string; member: string, surName: string, dob: string } {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.11789425178.${formattedDate}050450${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-IRR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const surName = superStreamDataIRR.memberLastName;
            const member = superStreamDataIRR.memberFirstName;
            const dob = superStreamDataIRR.dob;
            const memberNo = superStreamDataIRR.memberNumber;
            const tfn = UtilsAOL.generateValidTFN();
            const familyName = 'Seaborn';

            if (transferWholeBalance) {
                wholeBalanceTransfer = 'YES';
            } else {
                wholeBalanceTransfer = 'NO';
            }



            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {

                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataIRR.sourceAbn,
                "//*[local-name()='targetAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataIRR.targetUsi,
                "//*[local-name()='messageSenderContext']/*[local-name()='entityId']": superStreamDataIRR.sourceAbn,
                "//*[local-name()='messageReceiverContext']/*[local-name()='entityId']": superStreamDataIRR.sourceAbn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": memberNo,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentTransferringFundAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentTransferringFundUsi'][1]": superStreamDataIRR.targetUsi,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentReceivingFundAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='otherGivenName']": familyName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='transferWholeBalance']": wholeBalanceTransfer,



            };

            allure.logStep(`Rollover-Out happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}`);

            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, member, surName, dob, conversationId };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for IRR for a New Member
    static async generateIRRWithRolloverOutForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, transferWholeBalance: boolean, wholeBalanceTransfer: string, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; conversationId: string; member: string; surName: string; dob: string; }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.010101.000@superchoice.com.au`;
            const randomThreeDigitNumber = UtilsAOL.generateRandomThreeDigitNumber();
            const conversationId = `Rollover.11789425178.${formattedDate}050450${randomThreeDigitNumber}`;
            const destinationFileName = `SUPERCHOICE_CLIENT-IRR_${formattedDate}_1234567891${randomThreeDigitNumber}.xml`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);



            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");

            if (transferWholeBalance) {
                wholeBalanceTransfer = 'YES';
            } else {
                wholeBalanceTransfer = 'NO';
            }



            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);


            // Extract member data
            const { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);
            const linearId = await ShellAccountApiHandler.getMemberInfo(apiRequestContext, memberNo);
            await ShellAccountApiHandler.addRollIn(apiRequestContext, linearId.id);

            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//*[local-name()='messageId'][1]": superGateMessageId,
                "//*[local-name()='conversationId'][1]": conversationId,
                "//*[local-name()='timestamp'][1]": timeInUTC,
                "//*[local-name()='sourceAbn'][1]": superStreamDataIRR.sourceAbn,
                "//*[local-name()='targetAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='targetUsi'][1]": superStreamDataIRR.targetUsi,
                "//*[local-name()='messageSenderContext']/*[local-name()='entityId']": superStreamDataIRR.sourceAbn,
                "//*[local-name()='messageReceiverContext']/*[local-name()='entityId']": superStreamDataIRR.sourceAbn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entityId'][1]": tfn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='memberID'][1]": memberNo,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentTransferringFundAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentTransferringFundUsi'][1]": superStreamDataIRR.targetUsi,
                "//*[local-name()='memberRolloverTransactionContext']/*[local-name()='entitySegmentReceivingFundAbn'][1]": superStreamDataIRR.targetAbn,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='familyName']": surName,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='givenName']": member,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='otherGivenName']": null,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='dateOfBirth']": dob,
                "//*[local-name()='memberRolloverTransaction']/*[local-name()='transferWholeBalance']": wholeBalanceTransfer,


            };
            allure.logStep(`Rollover-Out happened for the member is: ${memberNo}, ${member}, ${surName}, ${dob}`);
            /// Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, member, surName, dob, conversationId };
        } catch (error) {
            console.error("Error occurred while generating RTR XML:", error);
            throw error;
        }
    }

    // Generate XML for GCTR with TFN
    static async generateGCTRXMLForNewMember(templateFileName: string, apiRequestContext: APIRequestContext, isTFNToBePassed: boolean): Promise<{ destinationFileName: string; paymentReferenceNumber: string, conversationId: string, payrollNumber: string, member: string, surName: string, year: number, month: string, day: number }> {
        try {
            let formattedDate: string = DateUtils.yyyymmddStringDate();

            /// Copy template file to processed folder
            const superGateMessageId = `${formattedDate}.095427.123@superchoice.com.au`;
            const conversationId: string = `Contribution.84111122223.${formattedDate}1054275${UtilsAOL.generateRandomThreeDigitNumber()}`;
            const destinationFileName: string = `GCTR_${formattedDate}_105427_555_${conversationId}_1.xml`;
            const payrollNumber = `person45${UtilsAOL.generateRandomThreeDigitNumber()}`;
            this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

            /// Node values
            const currentUTCTime: Date = new Date();
            const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
            const paymentReferenceNumber = 'NA1257412369871005';

            // Fetch member data 
            const memberData = await MemberApiHandler.createMember(apiRequestContext, isTFNToBePassed);
            // Call necessary API methods
            await new Promise(resolve => setTimeout(resolve, 6000));
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, memberData.processId!);
            await new Promise(resolve => setTimeout(resolve, 9000));
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);

            // Extract member data
            let { memberNo, member, surName, dob, tfn } = memberData;
            allure.logStep(`Newly created Member data is: ${memberNo}, ${member}, ${surName}, ${dob}, ${tfn}`);

            // Extract year, month, and day from dateOfBirth
            let parts = dob.split('-');
            const year = parseInt(parts[0], 10);
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            // Extract month name from numeric month
            const month = monthNames[parseInt(parts[1], 10) - 1];
            const day = parseInt(parts[2], 10);

            /// Prepare nodes list to update
            interface nodes {
                [key: string]: any;
            }
            const nodesToUpdate: nodes = {
                "//messageId[1]/superGateMessageId[1]": superGateMessageId,
                "//messageId[1]/ebmsMessageId[1]": superGateMessageId,
                "//messageId[1]/conversationId[1]": conversationId,
                "//headers[1]/conversationId[1]": conversationId,
                "//timeInUTC[1]": timeInUTC,
                "//sourceAbn[1]": superStreamDataCTR.sourceAbn,
                "//sourceUsi[1]": superStreamDataCTR.sourceUsi,
                "//targetAbn[1]": superStreamDataCTR.targetAbn,
                "//targetUsi[1]": superStreamDataCTR.targetUsi,
                "//paymentReferenceNumber[1]": paymentReferenceNumber,
                "//payer[1]/paymentReference[1]": paymentReferenceNumber,
                "//payee[1]/paymentReference[1]": paymentReferenceNumber,
                "//payee[1]/context[1]/entityIdentifier[1]": superStreamDataCTR.targetAbn,
                "//payee[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi,
                "//name[1]/firstName[1]": member,
                "//name[1]/lastName[1]": surName,
                "//member[1]/gender[1]": superStreamDataCTR.memberGender,
                "//member[1]/dob[1]/year[1]": year,
                "//member[1]/dob[1]/month[1]": month,
                "//member[1]/dob[1]/day[1]": day,
                "//member[1]//taxFileNumber[1]": tfn,
                "//member[1]//memberNumber[1]": memberNo,
                "//member[1]//payrollNumber[1]": payrollNumber,
                "//member[1]/context[1]/superannuationFundABN[1]": superStreamDataCTR.targetAbn,
                "//member[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi
            };
            allure.logStep(`Super stream contribution happened for the member is: ${memberNo}, ${member}, ${surName}, ${year} ${month} ${day}, ${tfn}`);
            // Update XML nodes and save it
            this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);

            return { destinationFileName, paymentReferenceNumber, conversationId, payrollNumber, member, surName, year, month, day };
        } catch (error) {
            console.error("Error occurred while generating CTR XML:", error);
            throw error;
        }
    }

    // Generate XML for CTR with TFN
    static async generateGCTRXMLForExsistingMember(templateFileName: string): Promise<{ destinationFileName: string; paymentReferenceNumber: string; conversationId: string; payrollNumber: string; member: string; surName: string; year: number; month: string; day: number; }> {


        let formattedDate: string = DateUtils.yyyymmddStringDate();

        /// Copy template file to processed folder
        const superGateMessageId = `${formattedDate}.095427.123@superchoice.com.au`;
        const conversationId: string = `Contribution.84111122223.${formattedDate}1054275${UtilsAOL.generateRandomThreeDigitNumber()}`;
        const destinationFileName: string = `GCTR_${formattedDate}_105427_555_${conversationId}_1.xml`;
        const payrollNumber = `person45${UtilsAOL.generateRandomThreeDigitNumber()}`;
        this.copyTemplateFileToProcessedFolder(templateFileName, destinationFileName);

        /// Node values
        const currentUTCTime: Date = new Date();
        const timeInUTC: string = currentUTCTime.toISOString().replace("Z", "");
        const paymentReferenceNumber = 'NA1257412369871005';
        const member = superStreamDataCTR.memberFirstName;
        const surName = superStreamDataCTR.memberLastName;
        const year = parseInt(superStreamDataCTR.memberdobYear,10);
        const month = superStreamDataCTR.memberdobMonth;
        const day = parseInt(superStreamDataCTR.memberdobDay, 10);
        const tfn = UtilsAOL.generateValidTFN();
        const memberNo = superStreamDataCTR.memberNumber;


        /// Prepare nodes list to update
        interface nodes {
            [key: string]: any;
        }
        const nodesToUpdate: nodes = {
            "//messageId[1]/superGateMessageId[1]": superGateMessageId,
            "//messageId[1]/ebmsMessageId[1]": superGateMessageId,
            "//messageId[1]/conversationId[1]": conversationId,
            "//headers[1]/conversationId[1]": conversationId,
            "//timeInUTC[1]": timeInUTC,
            "//sourceAbn[1]": superStreamDataCTR.sourceAbn,
            "//sourceUsi[1]": superStreamDataCTR.sourceUsi,
            "//targetAbn[1]": superStreamDataCTR.targetAbn,
            "//targetUsi[1]": superStreamDataCTR.targetUsi,
            //paymentReferenceNumber[1]": paymentReferenceNumber,
            "//payer[1]/paymentReference[1]": paymentReferenceNumber,
            "//payee[1]/paymentReference[1]": paymentReferenceNumber,
            "//payee[1]/context[1]/entityIdentifier[1]": superStreamDataCTR.targetAbn,
            "//payee[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi,
            "//name[1]/firstName[1]": member,
            "//name[1]/lastName[1]": surName,
            "//member[1]/gender[1]": superStreamDataCTR.memberGender,
            "//member[1]/dob[1]/year[1]": year,
            "//member[1]/dob[1]/month[1]": month,
            "//member[1]/dob[1]/day[1]": day,
            "//member[1]//taxFileNumber[1]": tfn,
            "//member[1]//memberNumber[1]": memberNo,
            "//member[1]//payrollNumber[1]": payrollNumber,
            "//member[1]/context[1]/superannuationFundABN[1]": superStreamDataCTR.targetAbn,
            "//member[1]/context[1]/superannuationFundUSI[1]": superStreamDataCTR.targetUsi

        };
        /// Update XML nodes and save it
        this.updateAndSaveXML(`${this.destinationFolder}/${destinationFileName}`, nodesToUpdate);
        return {
            destinationFileName, paymentReferenceNumber, conversationId, payrollNumber, member, surName, year, month, day

        };
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
