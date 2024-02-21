import { APIRequestContext, expect } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';
import { UtilsAOL, fundDetails } from '../aol/utils_aol';
import { DateUtils } from '../utils/date_utils';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';

export class MemberApi extends BaseDltaAolApi {

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

  async createMember(fundProductId: string): Promise<{ memberNo: string, fundProductId: string }> {
    let { productId, investmentId } = fundDetails(ENVIRONMENT_CONFIG.product);
    let path = `/product/${productId}/process`;
    let tfn = UtilsAOL.generateValidTFN();
    let member = UtilsAOL.randomName();
    let surname = UtilsAOL.randomSurname(5);
    let memberNo = UtilsAOL.memberNumber('TTR-', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    let data = {
      templateReference: 'createMember',
      filterGroups: [],
      initialData: {
        memberData: {
          memberNo: memberNo,
          identityNo: identityNo,
          choice: true,
          givenName: member,
          otherNames: 'Seaborn',
          surname: surname,
          dob: '1961-04-16',
          gender: 'M',
          title: 'Dr.',
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
          effectiveDate: '2022-04-10',
          eligibleServiceDate: '2022-07-14',
          memberPensionConfiguration: null,
        },
        beneficiaryData: {
          beneficiariesList: [
            {
              entityName: 'John Smith',
              beneficiaryType: 'bindingLapsing',
              percent: 100,
              relationship: 'spouse',
              binding: true,
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
        bankAccountData: {
          bankAccountList: [
            {
              institutionName: 'NAB',
              bsb: '087654',
              accountNumber: '931345678',
              purpose: null,
            },
          ],
        },
        investmentData: {
          investments: [
            {
              id: investmentId,
              percent: 100,
            },
          ],
        },
      },
    };

    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    console.log(`Created member with memberNo: ${MemberNo}`);
    return { memberNo: MemberNo, fundProductId: fundProductId };
  }


  async approveProcess(caseGroupId: string) {
    let path = `case/group/${caseGroupId}/approve`;
    try {
      let { productId } = fundDetails(ENVIRONMENT_CONFIG.product);
      let fundProductId = productId;
      let data = {
        fundProductId: fundProductId,
        notes: "E2E auto test - approve",
        effectiveDate: `${DateUtils.localISOStringDate(this.today)}`
      };

      let response = await this.post(path, JSON.stringify(data));
      expect(response.status()).toBe(201);
      let responseBody = await response.json();
      expect(responseBody).toBeTruthy();

    } catch (error) {
      console.error(error);
    }
  }

  async createPensionShellAccount(fundProductId: string): Promise<{ memberNo: string, fundProductId: string }> {
    let { productId, investmentId } = fundDetails(ENVIRONMENT_CONFIG.product);
    let path = `/product/${productId}/process`;

    let tfn = UtilsAOL.generateValidTFN();
    let member = UtilsAOL.randomName();
    let surname = UtilsAOL.randomSurname(5);
    let memberNo = UtilsAOL.memberNumber('TTR-', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    let data = {
      templateReference: 'createPensionMemberShellAccount',
      filterGroups: [],
      initialData: {
        memberData: {
          memberNo: memberNo,
          identityNo: identityNo,
          choice: true,
          givenName: member,
          otherNames: null,
          surname: surname,
          dob: '1955-04-16',
          gender: 'M',
          title: 'Dr.',
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
              "drawDownType": "proportional"
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
              effectiveDate: null,
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
          investments: [
            {
              id: investmentId,
              percent: 100,
            },
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
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    console.log(`Created Pensionshell Account with memberNo: ${MemberNo}`);
    return { memberNo: MemberNo, fundProductId: fundProductId };
  }

  async fetchMemberDetails(memberNo: string): Promise<{ id: string, fundName: string }> {
    let { productId } = fundDetails(ENVIRONMENT_CONFIG.product);
    let fundProductId = productId;
    let queryParams = new URLSearchParams({});
    let path = `/product/${fundProductId}/member/number?memberNo=${memberNo}&${queryParams.toString()}`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let id = responseBody?.linearId?.id || null;
    let fundName = responseBody?.fundName || null;

    return { id, fundName };
  }

  async commencePensionMember(linearId: string): Promise<{ linearId: string }> {
    let path = `member/${linearId}/commence`;
    let data = {
      "commencementDate": DateUtils.localISOStringDate(this.commencementDate)
    };
    let response = await this.put(path, JSON.stringify(data));
    let responseBody = await response.json();
    let resultLinearId = responseBody?.linearId?.id || null;
    return { linearId: resultLinearId };
  }

  async rpbpPayments(linearId: string): Promise<{ linearId: string }> {
    let path = `member/${linearId}/process`;
    let data = {

      "templateReference": "createPensionBenefit",
      "initialData": {
        "memberId": linearId,
        "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      }
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let resultLinearId = responseBody?.linearId?.id || null;
    return { linearId: resultLinearId };
  }


  async validateCommutation(linearId: string): Promise<{ linearId: string }> {
    let path = `member/${linearId}/commutation/validate`;
    let data = {
      "commutationType": "BENEFIT",
      "commutationAmount": 0,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "whole": true
    }
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    console.log(responseBody);
    let LinearId = responseBody?.linearId?.id || null;
    return { linearId: LinearId };
  }

  async getMemberDetails(linearId: string): Promise<{ id: string, fundName: string, tfn: string, givenName: string, dob: string }> {
    let path = `/member/${linearId}`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let id = responseBody?.linearId?.id || null;
    let fundName = responseBody?.member?.fund || null;
    let tfn = responseBody?.identity?.tfn || null;
    let givenName = responseBody?.identity?.givenName || null;
    let dob = responseBody?.identity?.dob || null;
    return { id, fundName, tfn, givenName, dob };
  }

  async memberIdentity(linearId: string, memberDetails: { tfn: string, dob: string, givenName: string, fundName: string }): Promise<{ linearId: string, tfn: string, givenName: string, dob: string }> {
    try {
      let path = `identity/${linearId}/identity/check`;
      let data = {
        tfn: memberDetails.tfn,
        dob: memberDetails.dob,
        givenName: memberDetails.givenName,
        familyName: 'Seaborn',
        abn: "64971749321",
        fundName: memberDetails.fundName,
        effectiveDate: `${DateUtils.localISOStringDate(this.today)}`,
      };

      let response = await this.post(path, JSON.stringify(data));
      let responseBody = await response.json();
      console.log('Request Data:', data);
      console.log('Response Body:', responseBody);

      if (responseBody?.linearId?.id) {
        let LinearId = responseBody.linearId.id;
        return { linearId: LinearId, tfn: memberDetails.tfn, givenName: memberDetails.givenName, dob: memberDetails.dob };
      } else {
        console.error('Unexpected response format:', responseBody);
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }


  async fetchMemberSummary(linearId: string): Promise<{ status: boolean }> {
    let path = `/member/${linearId}/summary`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let status = responseBody?.active || false;
    return { status };
  }



}