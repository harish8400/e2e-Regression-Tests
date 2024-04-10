import { APIRequestContext } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';
import { UtilsAOL, fundDetails } from '../aol/utils_aol';
import { DateUtils } from '../utils/date_utils';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';

import {  INVESTMENT_OPTIONS } from '../../constants';



let { productId, investmentId } = fundDetails(ENVIRONMENT_CONFIG.product);
let path = `product/${productId}/process`;
let memberInvestmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.DIVERSIFIED_BONDS.ID;

export class DrawDownProfile extends BaseDltaAolApi {

  readonly today: Date;
  readonly nextPaymentDate: Date;
  readonly commencementDate: Date;
  readonly firstPensionPaymentDate: Date;

  constructor(apiRequestContext: APIRequestContext) {
    super(apiRequestContext);
    this.today = new Date();
    this.commencementDate = new Date('2023-06-15');
    this.nextPaymentDate = new Date(this.commencementDate);
    this.nextPaymentDate.setMonth(this.commencementDate.getMonth() + 1);
    this.nextPaymentDate.setDate(15);
    this.firstPensionPaymentDate = new Date(this.commencementDate);
    this.firstPensionPaymentDate.setDate(this.commencementDate.getDate() + 15);
  }
  
  async memberWithSpecifiedOrderProfile(fundProductId: string): Promise<{ memberNo: string, surname: string, fundProductId: string, processId: string }> {
    let tfn = UtilsAOL.generateValidTFN();
    let member = UtilsAOL.randomName();
    let surname = UtilsAOL.randomSurname(5);
    let memberNo = UtilsAOL.memberNumber('MER-PEN-', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    let dob  =UtilsAOL.generateDOB();
    
    let data = {
      templateReference: 'createPensionMemberShellAccount',
      filterGroups: [],
      initialData: {
        memberData: {
          memberNo: memberNo,
          identityNo: identityNo,
          choice: true,
          givenName: member,
          otherNames: 'Grow',
          surname: surname,
          dob: dob,
          gender: 'M',
          title: 'Dr.',
          preferredContactMethod: "Digital",
          tfn: tfn,
          citizenshipStatus: 'Resident',
          email: 'pharish.kumar@growsuper.com',
          phone: '+610417977573',
          addressOne: '133 Keedo Place',
          addressTwo: 'NT',
          suburb: 'Surry Hills',
          postcode: '6792',
          state: 'NSW',
          country: 'AU',
          effectiveDate: '2023-04-10',
          eligibleServiceDate: '2023-06-14',
          "memberPensionConfiguration": {
            "eligibilityType": "retiredPreservationAge",
            "firstPensionPaymentDate": `${DateUtils.localISOStringDate(this.today)}`,
            "pensionCommencementDate": `${DateUtils.localISOStringDate(this.commencementDate)}`,
            "totalTaxFreePensionPercent": "0",
            "pensionPurchasedWithDeathBenefits": "true",
            "createdFromSuccessorFundTransfer": "false",
            "drawdownProfile": {
              "drawDownType": "specifiedOrder",
              "investmentList": [
                {
                    "id": investmentId
                },
                {
                    "id": memberInvestmentId
                }
            ]
            },
            "proRataFirstYearPayment": "true"
          }
        },
        beneficiaryData: {
          beneficiariesList: [
            {
              entityName: 'John Smith',
              "beneficiaryType": "nonBinding",
              percent: 100,
              gender: 'M',
              relationship: 'spouse',
              abn: 123123123123,
              acn: 123123123123,
              contactDetails: [
                {
                  givenName: 'John',
                  surname: 'Smith',
                },
              ],
              addressDetails: [],
              mailingDetails: [],
              documents: [],
              effectiveDate: `${DateUtils.localISOStringDate(this.today)}`,
              endDate: null,
            },
          ],
        },
        "scheduleData": {
          "type": "pension",
          "frequency": "monthly",
          "amount": "10000",
          "annualPensionPaymentOption": "nominatedAmount",
          "claimingPensionTaxFreeThreshold": false,
          "nextPaymentDate": `${DateUtils.localISOStringDate(this.nextPaymentDate)}`,
          "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
        },
        bankAccountData: {
          bankAccountList: [
            {
              institutionName: 'NAB',
              bsb: '087654',
              accountNumber: '931345678',
              purpose: 'pensionPayment',
            },
          ],
        },
        investmentData: {
          investments:[
            {
                "id": investmentId,
                "percent": 50
            },
            {
                "id": memberInvestmentId,
                "percent": 50
            }
          ],
          "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
        },
        "initialRollInProcessData": [
          {
            "templateReference": "initiateRollin",
            "initialData": {
              "targetABN": "11159983563",
              "targetUSI": "11159983563001",
              "targetOrganisationName": "John George Wall Super Fund",
              "whole": true,
              "targetMemberIdentifier": 100456,
              "amount": 100000
            }
          }
        ]
      }
    };

    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let processId: string = responseBody?.linearId?.id || null;
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    return { memberNo: MemberNo, surname: surname, fundProductId: fundProductId, processId };
  }


 
  async memberWithPercentageProfile(fundProductId: string): Promise<{ memberNo: string, surname: string, fundProductId: string, processId: string }> {
    let tfn = UtilsAOL.generateValidTFN();
    let member = UtilsAOL.randomName();
    let surname = UtilsAOL.randomSurname(5);
    let memberNo = UtilsAOL.memberNumber('MER-PEN-', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    let dob  =UtilsAOL.generateDOB();
    
    let data = {
      templateReference: 'createPensionMemberShellAccount',
      filterGroups: [],
      initialData: {
        memberData: {
          memberNo: memberNo,
          identityNo: identityNo,
          choice: true,
          givenName: member,
          otherNames: 'Grow',
          surname: surname,
          dob: dob,
          gender: 'M',
          title: 'Dr.',
          preferredContactMethod: "Digital",
          tfn: tfn,
          citizenshipStatus: 'Resident',
          email: 'pharish.kumar@growsuper.com',
          phone: '+610417977573',
          addressOne: '133 Keedo Place',
          addressTwo: 'NT',
          suburb: 'Surry Hills',
          postcode: '6792',
          state: 'NSW',
          country: 'AU',
          effectiveDate: '2023-04-10',
          eligibleServiceDate: '2023-06-14',
          "memberPensionConfiguration": {
            "eligibilityType": "retiredPreservationAge",
            "firstPensionPaymentDate": `${DateUtils.localISOStringDate(this.today)}`,
            "pensionCommencementDate": `${DateUtils.localISOStringDate(this.commencementDate)}`,
            "totalTaxFreePensionPercent": "0",
            "pensionPurchasedWithDeathBenefits": "true",
            "createdFromSuccessorFundTransfer": "false",
            "drawdownProfile": {
              "drawDownType": "percentage",
              "investmentList": [
                {
                    "id": investmentId,
                    "percent": 50
                },
                {
                    "id": memberInvestmentId,
                    "percent": 50
                }
            ]
            },
            "proRataFirstYearPayment": "true"
          }
        },
        beneficiaryData: {
          beneficiariesList: [
            {
              entityName: 'John Smith',
              "beneficiaryType": "nonBinding",
              percent: 100,
              gender: 'M',
              relationship: 'spouse',
              abn: 123123123123,
              acn: 123123123123,
              contactDetails: [
                {
                  givenName: 'John',
                  surname: 'Smith',
                },
              ],
              addressDetails: [],
              mailingDetails: [],
              documents: [],
              effectiveDate: `${DateUtils.localISOStringDate(this.today)}`,
              endDate: null,
            },
          ],
        },
        "scheduleData": {
          "type": "pension",
          "frequency": "monthly",
          "amount": "10000",
          "annualPensionPaymentOption": "nominatedAmount",
          "claimingPensionTaxFreeThreshold": false,
          "nextPaymentDate": `${DateUtils.localISOStringDate(this.nextPaymentDate)}`,
          "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
        },
        bankAccountData: {
          bankAccountList: [
            {
              institutionName: 'NAB',
              bsb: '087654',
              accountNumber: '931345678',
              purpose: 'pensionPayment',
            },
          ],
        },
        investmentData: {
          investments:[
            {
                "id": investmentId,
                "percent": 50
            },
            {
                "id": memberInvestmentId,
                "percent": 50
            }
          ],
          "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
        },
        "initialRollInProcessData": [
          {
            "templateReference": "initiateRollin",
            "initialData": {
              "targetABN": "11159983563",
              "targetUSI": "11159983563001",
              "targetOrganisationName": "John George Wall Super Fund",
              "whole": true,
              "targetMemberIdentifier": 100456,
              "amount": 100000
            }
          }
        ]
      }
    };

    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let processId: string = responseBody?.linearId?.id || null;
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    return { memberNo: MemberNo, surname: surname, fundProductId: fundProductId, processId };
  }


  

  
}