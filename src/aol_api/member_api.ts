import { APIRequestContext } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';
import { UtilsAOL, fundDetails } from '../aol/utils_aol';
import { DateUtils } from '../utils/date_utils';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';
import * as assert from 'assert';



let { productId, investmentId } = fundDetails(ENVIRONMENT_CONFIG.product);
let path = `product/${productId}/process`;
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

  async createMember(fundProductId: string): Promise<{ memberId: string, memberNo: string, fundProductId: string, processId: string }> {

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
              beneficiaryType: 'nonBinding',
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
    let memberId: string = responseBody.linearId?.id || null;
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    let processId: string = responseBody?.linearId?.id || null;
    console.log(`Created member with memberNo: ${MemberNo} and memberId: ${memberId}`);
    return { memberId, memberNo: MemberNo, fundProductId: fundProductId, processId };
  }



  async approveProcess(caseGroupId: string, notes: string = "E2E auto test - approve"): Promise<void> {
    let path = `case/group/${caseGroupId}/approve`;
    try {
      let { productId } = fundDetails(ENVIRONMENT_CONFIG.product);
      let fundProductId = productId;
      let data = {
        fundProductId: fundProductId,
        notes: notes,
        effectiveDate: `${DateUtils.localISOStringDate(this.today)}`
      };

      let response = await this.post(path, JSON.stringify(data));
      if (response.status() !== 201) {
        const responseBody = await response.json();
        throw new Error(`Failed to approve process. ${responseBody.error?.message}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async createPensionShellAccount(fundProductId: string): Promise<{ memberNo: string, surname: string, fundProductId: string, processId: string }> {
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
    let processId: string = responseBody?.linearId?.id || null;
    let MemberNo: string = responseBody.initialData.memberData.memberNo;
    return { memberNo: MemberNo, surname: surname, fundProductId: fundProductId, processId };
  }


  async fetchMemberDetails(memberNo: string): Promise<{ id: string, fundName: string, memberNo: string }> {
    let { productId } = fundDetails(ENVIRONMENT_CONFIG.product);
    let fundProductId = productId;
    let queryParams = new URLSearchParams({});
    let path = `product/${fundProductId}/member/number?memberNo=${memberNo}${queryParams.toString()}`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let id = responseBody?.linearId?.id || null;
    let fundName = responseBody?.fundName || null;
    let memberNumber = responseBody?.memberNo || null;

    return { id, fundName, memberNo: memberNumber };
  }

  async commencePensionMember(linearId: string): Promise<{ linearId: string }> {
    let path = `member/${linearId}/commence`;
    let data = {
      "commencementDate": DateUtils.localISOStringDate(this.commencementDate)
    };
    let response = await this.put(path, JSON.stringify(data));
    let responseBody = await response.json();
    console.log(responseBody)
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

  async getMemberDetails(linearId: string): Promise<{ id: string, fundName: string, tfn: string, givenName: string, dob: string }> {
    let path = `member/${linearId}`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let id = responseBody?.identity?.id || null;
    let fundName = responseBody?.member?.fund || null;
    let tfn = responseBody?.identity?.tfn || null;
    let givenName = responseBody?.identity?.givenName || null;
    let dob = responseBody?.identity?.dob || null;
    console.log(dob,fundName,tfn,givenName)
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
      console.log(responseBody);
      const member = responseBody.member;
      assert.strictEqual(member.active, true, 'The member is active');
        let LinearId = responseBody.identity.id;
        return { linearId: LinearId, tfn: memberDetails.tfn, givenName: memberDetails.givenName, dob: memberDetails.dob };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async fetchMemberSummary(linearId: string): Promise<{ status: boolean }> {
    let path = `member/${linearId}/summary`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let status = responseBody?.active || false;
    assert.equal(status, true, 'The member is not active');
    return { status };
  }

  async ptbTransactions(linearId: string): Promise<{ linearId: string; memberNo?: string }> {
    let data = {
      templateReference: "memberTransfer",
      initialData: {
        type: "PTB",
        memberId: linearId,
        amount: 12500,
        targetInvestments: [
          {
            id: "CASH",
            percent: 100
          }
        ],
        effectiveDate: `${DateUtils.localISOStringDate(this.today)}`,
        paymentReceivedDate: `${DateUtils.localISOStringDate(this.today)}`,
        investmentOrigins: [
          {
            id: "HE47",
            amount: 12500
          }
        ]
      }
    };

    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    let LinearId = responseBody?.linearId?.id || null;
    let MemberNo = responseBody?.memberNo;

    return { linearId: LinearId, memberNo: MemberNo };
  }

  async getCaseGroupId(processId: String) {
    let path = `process/${processId}/case`;

    try {
      let response = await this.get(path);
      let responseBody = await response.json();
      if (responseBody.data.length > 0) {
        return responseBody.data[0].caseGroupId;
      } else {
        throw new Error('No data found for the given processId');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching caseGroupId:', error.message);
        throw error;
      } else {
        throw new Error('Unknown error occurred');
      }
    }
  }

}