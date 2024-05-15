import { APIRequestContext, expect } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';
import { UtilsAOL, fundDetails } from '../aol/utils_aol';
import { DateUtils } from '../utils/date_utils';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';
import * as assert from 'assert';
import { FUND, FUND_IDS, INVESTMENT_OPTIONS } from '../../constants';




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

  async createMember(tfnNull: boolean = false, member: string, surName: string, memberNo: string, tfn: string, dob: string): Promise<{ memberId: string, processId: string, member: string, surName: string, memberNo: string, tfn: string, dob: string }> {
    
    let productId;
    let investmentId;

    if (process.env.PRODUCT === FUND.HESTA) {
      productId = FUND_IDS.MERCY.PRODUCT_ID.ACCUMULATION;
      investmentId = INVESTMENT_OPTIONS.MERCY.ACCUMULATION.AUSTRALIAN_SHARES.ID;
    } else {
      productId = FUND_IDS.VANGUARD.PRODUCT_ID.ACCUMULATION;
      investmentId = INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.AUSTRALIAN_SHARES.ID;
    }

    let path = `product/${productId}/process`;

    if (!tfnNull && tfn !== null) {
      tfn = UtilsAOL.generateValidTFN().toString();
    }
    member = UtilsAOL.randomName();
    surName = UtilsAOL.randomSurname(5);
    memberNo = UtilsAOL.memberNumber('', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    dob = '1961-04-16';
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
          surname: surName,
          dob: dob,
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
    let processId: string = responseBody?.linearId?.id || null;
    console.log(`Created member is: ${memberNo} and memberId: ${memberId},${member},${surName},${dob},${tfn}`);
    return { memberId, processId, member, surName, memberNo, tfn, dob };
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
   let memberInvestmentId :string;
    let tfn = UtilsAOL.generateValidTFN();
    let member = UtilsAOL.randomName();
    let surname = UtilsAOL.randomSurname(5);
    let memberNo = UtilsAOL.memberNumber('MER-PEN-', 9);
    let identityNo = UtilsAOL.memberIdentityNumber('MER-ACC-', 6);
    let dob = UtilsAOL.generateDOB();
    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
    switch (product) {
      case 'HESTA for Mercy':
        memberInvestmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.DIVERSIFIED_BONDS.ID;
          break;
      case 'Vanguard Super':
        memberInvestmentId = INVESTMENT_OPTIONS.VANGUARD.RETIREMENT.CONSERVATIVE.ID;
          break;

      default:
          throw new Error(`Unsupported product: ${product}`);
  }
     
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


  async fetchMemberDetails(memberNo: string): Promise<{ id: string, fundName: string, memberNo: string }> {
    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
    switch (product) {
      case 'HESTA for Mercy':
          productId = FUND_IDS.MERCY.PRODUCT_ID.RETIREMENT;
          break;
      case 'Vanguard Super':
          productId = FUND_IDS.VANGUARD.PRODUCT_ID.RETIREMENT;
          break;

      default:
          throw new Error(`Unsupported product: ${product}`);
  }
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
    let resultLinearId = responseBody?.linearId?.id || null;
    return { linearId: resultLinearId };
  }

  async rpbpPayments(linearId: string): Promise<{ linearId: string }> {
    let path = `member/${linearId}/process`;

    // Get today's date
    const today = new Date();

    // Start from the current month and year
    let month = today.getMonth();
    let year = today.getFullYear();

    // Loop until July 2023
    while (!(year === 2023 && month === 6)) {

      let data = {
        "templateReference": "createPensionBenefit",
        "initialData": {
          "memberId": linearId,
          "effectiveDate": DateUtils.localISOStringDate(new Date(year, month, today.getDate())),
        }
      };

      let response = await this.post(path, JSON.stringify(data));
      await response.json();


      if (month === 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
    }

    return { linearId };
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
    console.log(dob, fundName, tfn, givenName)
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

  async fetchMemberSummary(linearId: string, FullExit: boolean): Promise<{ status: boolean }> {
    let path = `member/${linearId}/summary`;
    let response = await this.get(path);
    let responseBody = await response.json();
    let { exitDate, exitReason, active } = responseBody;
    const exitDateAsDate = new Date(exitDate);
    const exitDateOnly = exitDateAsDate.toISOString().split('T')[0];
    const todayDateOnly = this.today.toISOString().split('T')[0];
    if (FullExit) {
      expect(exitDateOnly).toEqual(todayDateOnly);
      expect(active).toBe(false);
      expect(exitReason).toMatch(/^(BENEFIT|ROLLOUT)$/i);
    } else {
      console.log("Partial Exit is done and paymentdate is:`${todayDateOnly}`")
    }
    return { status: true };

  }

  async ptbTransactions(linearId: string): Promise<{ linearId: string; memberNo?: string }> {
    let investmentId = INVESTMENT_OPTIONS.MERCY.TTR.AUSTRALIAN_SHARES.ID;
    let memberInvestmentId = INVESTMENT_OPTIONS.MERCY.TTR.DIVERSIFIED_BONDS.ID;
    let path = `member/${linearId}/process`;
    let data = {
      templateReference: "memberTransfer",
      initialData: {
        type: "PTB",
        memberId: linearId,
        amount: 12500,
        targetInvestments: [
          {
            id: investmentId,
            percent: 50,
          },
          {
            id: memberInvestmentId,
            percent: 50,
          }
        ],
        effectiveDate: `${DateUtils.localISOStringDate(this.today)}`,
        paymentReceivedDate: `${DateUtils.localISOStringDate(this.today)}`,
        investmentOrigins: [
          {
            id: investmentId,
            amount: 6250,
          },
          {
            id: memberInvestmentId,
            amount: 6250,
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
    console.log(path)

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

  async addRollIn(linearId: string): Promise<{ linearId: string, memberNo: string, amount: number }> {

    let investmentId = INVESTMENT_OPTIONS.MERCY.TTR.AUSTRALIAN_SHARES.ID;
    let path = `member/${linearId}/rollin`;
    let data = {
      "paymentReference": "InternalTransfer_902010134",
      "transferringFundABN": "11789425178",
      "transferringFundUSI": "11789425178799",
      "transferringClientIdentifier": "902010134",
      "amount": "50000",
      "preserved": "50000",
      "restrictedNonPreserved": "0",
      "unrestrictedNonPreserved": "0",
      "kiwiPreserved": "0",
      "taxed": "50000",
      "untaxed": "0",
      "taxFree": "0",
      "kiwiTaxFree": "0",
      "type": "RLI",
      "paymentReceivedDate": `${DateUtils.localISOStringDate(this.today)}`,
      "eligibleServicePeriodStartDate": null,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "messageType": null,
      "historic": true,
      "caseReference": null,
      "targetInvestments": [
        {
          id: investmentId,
          "percent": 100
        }
      ]
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    const rollIn = responseBody.rollin;
    expect(rollIn.type).toBe('RLI');
    expect(rollIn.name).toBe('Roll In');
    expect(rollIn.historic).toBe(true);
    let Id = responseBody?.linearId?.id || null;
    let memberNo = responseBody?.memberNo || null;
    let amount = responseBody?.amount || 0;
    return { linearId: Id, memberNo: memberNo, amount: amount };
  }


  async getMemberRelatedBeneficiaries(linearId: string): Promise<{ entityName: string, relationship: string, percent: number, beneficiaryType: string, beneficiaryTypeName: string }[]> {
    let path = `member/${linearId}/beneficiary`;
    let response = await this.get(path);
    let responseBody = await response.json();
    const data = responseBody.data;
    const beneficiaries = data.map((beneficiary: { entityName: any; relationship: any; percent: any; beneficiaryType: any; beneficiaryTypeName: any; }) => ({
      entityName: beneficiary.entityName,
      relationship: beneficiary.relationship,
      percent: beneficiary.percent,
      beneficiaryType: beneficiary.beneficiaryType,
      beneficiaryTypeName: beneficiary.beneficiaryTypeName
    }));
    console.log(beneficiaries);
    return beneficiaries;
  }

  async getMemberInvestmentRebalance(linearId: string, pageNumber: number, pageSize: number): Promise<{ transactionReference: string, amount: number, category: string, type: string, name: string, effectiveDate: string }[]> {
    let queryParams = new URLSearchParams({});
    const path = `member/${linearId}/investment/rebalance?page=${pageNumber}&pageSize=${pageSize}${queryParams.toString()}`;
    const response = await this.get(path);
    const responseBody = await response.json();
    const extractedData = responseBody.data.map((item: { transactionReference: any; amount: any; category: any; type: any; name: any; effectiveDate: any; }) => ({
      transactionReference: item.transactionReference,
      amount: item.amount,
      category: item.category,
      type: item.type,
      name: item.name,
      effectiveDate: item.effectiveDate
    }));
    console.log(extractedData);
    return extractedData;
  }

  async getMemberInvestmentSwitch(linearId: string, pageNumber: number, pageSize: number): Promise<{ transactionReference: string, amount: number, category: string, type: string, name: string, effectiveDate: string }[]> {
    let queryParams = new URLSearchParams({});
    const path = `member/${linearId}/investment/switch?page=${pageNumber}&pageSize=${pageSize}${queryParams.toString()}`;
    const response = await this.get(path);
    const responseBody = await response.json();
    const extractedData = responseBody.data.map((item: { transactionReference: any; amount: any; category: any; type: any; name: any; effectiveDate: any; }) => ({
      transactionReference: item.transactionReference,
      amount: item.amount,
      category: item.category,
      type: item.type,
      name: item.name,
      effectiveDate: item.effectiveDate
    }));
    console.log(extractedData);
    return extractedData;
  }


  async memberInvestmentSwitch(linearId: string): Promise<{ memberId: string }> {
    let investmentId = INVESTMENT_OPTIONS.MERCY.TTR.AUSTRALIAN_SHARES.ID;
    let memberInvestmentId = INVESTMENT_OPTIONS.MERCY.TTR.AUSTRALIAN_SHARES.ID;

    let path = `member/${linearId}/investment/switch`;
    console.log(path)
    let data = {
      "type": "INVPC",
      "sourceInvestments": [
        {
          "id": "CASH",
          "percent": 100
        }
      ],
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "historic": true
    };
    console.log(data);
    let response = await this.post(path, JSON.stringify(data));
    console.log(response)
    let responseBody = await response.json();

    // Extract the memberId from the responseBody
    const { memberId } = responseBody;

    // Return the extracted memberId
    return { memberId };
  }

  async memberCorrespondenceInfo(linearId: string): Promise<{ memberAge: number, ageJoinedFund: number, ageJoinedProduct: number, memberId: string }> {
    let path = `member/${linearId}/correspondence/info`;
    let response = await this.get(path);
    let responseBody = await response.json();
    const { memberAge, ageJoinedFund, ageJoinedProduct, memberId } = responseBody.memberData;
    return { memberAge, ageJoinedFund, ageJoinedProduct, memberId };
  }
  async getRegularPensionPaymentAmount(memberId: string): Promise<{ regularPaymentAmount: string }> {
    let path = `member/${memberId}/pension/payment/details`;

    const response = await this.get(path);
    const responseBody = await response.json();
    //let { regularPaymentAmount } = responseBody.regularPaymentAmount;
    return responseBody;

  }

  async addMemberRollIn(linearId: string): Promise<{ linearId: string, memberNo: string, amount: number }> {

    
    let investmentId;

    if (process.env.PRODUCT === FUND.HESTA) {
      
      investmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.AUSTRALIAN_SHARES.ID;
    } else {
      
      investmentId = INVESTMENT_OPTIONS.VANGUARD.RETIREMENT.AUSTRALIAN_SHARES.ID;
    }
     
    let path = `member/${linearId}/rollin`;
    let data = {
      "paymentReference": "InternalTransfer_902010134",
      "transferringFundABN": "11789425178",
      "transferringFundUSI": "11789425178799",
      "transferringClientIdentifier": "902010134",
      "amount": "50000",
      "preserved": "50000",
      "restrictedNonPreserved": "0",
      "unrestrictedNonPreserved": "0",
      "kiwiPreserved": "0",
      "taxed": "50000",
      "untaxed": "0",
      "taxFree": "0",
      "kiwiTaxFree": "0",
      "type": "RLI",
      "paymentReceivedDate": `${DateUtils.localISOStringDate(this.today)}`,
      "eligibleServicePeriodStartDate": null,
      "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
      "messageType": null,
      "historic": true,
      "caseReference": null,
      "targetInvestments": [
        {
          id: investmentId,
          "percent": 100
        }
      ]
    };
    let response = await this.post(path, JSON.stringify(data));
    let responseBody = await response.json();
    const rollIn = responseBody.rollin;
    expect(rollIn.type).toBe('RLI');
    expect(rollIn.name).toBe('Roll In');
    expect(rollIn.historic).toBe(true);
    let Id = responseBody?.linearId?.id || null;
    let memberNo = responseBody?.memberNo || null;
    let amount = responseBody?.amount || 0;
    return { linearId: Id, memberNo: memberNo, amount: amount };
  }


}