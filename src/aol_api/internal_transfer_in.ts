import { APIRequestContext, expect } from '@playwright/test';
import { BaseDltaAolApi } from './base_dlta_aol';
import { UtilsAOL } from '../aol/utils_aol';
import { DateUtils } from '../utils/date_utils';
import { FUND, FUND_IDS, INVESTMENT_OPTIONS } from '../../constants';
import { ENVIRONMENT_CONFIG } from '../../config/environment_config';
let fundProduct = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;

export class ShellAccountApi extends BaseDltaAolApi {

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

    async createPensionShellAccount(fundProductId: string): Promise<{ memberNo: string, surname: string, fundProductId: string, processId: string }> {
        let productId = FUND_IDS.MERCY.PRODUCT_ID.TTR;
        let investmentId = INVESTMENT_OPTIONS.MERCY.TTR.AUSTRALIAN_SHARES.ID;
        let memberInvestmentId = INVESTMENT_OPTIONS.MERCY.TTR.DIVERSIFIED_BONDS.ID;
        let path = `/product/${productId}/process`;
        let tfn = UtilsAOL.generateValidTFN();
        let member = UtilsAOL.randomName();
        let surname = UtilsAOL.randomSurname(5);
        let memberNo = UtilsAOL.memberNumber('MemberNo-', 9);
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
                    otherNames: 'Grow',
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
                        "eligibilityType": "reachedPreservationAge",
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
        let productId = FUND_IDS.MERCY.PRODUCT_ID.TTR;
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

    async getMemberDetails(linearId: string): Promise<{ memberId: string, memberNo: string, otherNames: string, givenName: string, surname: string, gender: string, title: string, dob: string, tfn: string }> {
        let path = `/member/${linearId}`;
        let response = await this.get(path);
        let responseBody = await response.json();

        let memberNo = responseBody?.member?.memberNo || null;
        let otherNames = responseBody?.identity?.otherNames || null;
        let givenName = responseBody?.identity?.givenName || null;
        let surname = responseBody?.identity?.surname || null;
        let gender = responseBody?.identity?.gender || null;
        let title = responseBody?.identity?.title || null;
        let dob = responseBody?.identity?.dob || null;
        let tfn = responseBody?.identity?.tfn || null;
        let memberId = responseBody?.identity?.linearId.id || null;
        return { memberNo, otherNames, givenName, surname, gender, title, dob, tfn, memberId };
    }

    async getMemberInfo(memberNo: string): Promise<{ id: string, fundName: string, memberNo: string }> {
        let productId: string;

        switch (fundProduct) {
            case 'HESTA for Mercy':
                productId = FUND_IDS.MERCY.PRODUCT_ID.ACCUMULATION;
                break;
            case 'Vanguard Super':
                productId = FUND_IDS.VANGUARD.PRODUCT_ID.ACCUMULATION;
                break;

            default:
                throw new Error(`Unsupported product: ${fundProduct}`);
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

    async addRollIn(linearId: string): Promise<{ linearId: string, memberNo: string, amount: number }> {

        let investmentId: string;
        switch (fundProduct) {
            case 'HESTA for Mercy':
            investmentId = INVESTMENT_OPTIONS.MERCY.ACCUMULATION.AUSTRALIAN_SHARES.ID;
            break;
            case 'Vanguard Super':
            investmentId = INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.AUSTRALIAN_SHARES.ID;
            break;
            default:
                throw new Error(`Unsupported product: ${fundProduct}`);
        }
        let path = `member/${linearId}/rollin`;
        let data = {
            "paymentReference": "InternalTransfer_902010134",
            "transferringFundABN": "11789425178",
            "transferringFundUSI": "11789425178799",
            "transferringClientIdentifier": "902010134",
            "amount": "100000",
            "preserved": "0",
            "restrictedNonPreserved": "0",
            "unrestrictedNonPreserved": "100000",
            "kiwiPreserved": "0",
            "taxed": "0",
            "untaxed": "0",
            "taxFree": "100000",
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

    async addContribution(linearId: string): Promise<{ linearId: string, amount: number }> {
        let investmentId: string;
        switch (fundProduct) {
            case 'HESTA for Mercy':
            investmentId = INVESTMENT_OPTIONS.MERCY.ACCUMULATION.AUSTRALIAN_SHARES.ID;
            break;
            case 'Vanguard Super':
            investmentId = INVESTMENT_OPTIONS.VANGUARD.ACCUMULATION.AUSTRALIAN_SHARES.ID;
            break;
            default:
                throw new Error(`Unsupported product: ${fundProduct}`);
        }
        let path = `member/${linearId}/contribution?strictDuplicateCheck=false`;
        let randomNumber = UtilsAOL.generateRandomThreeDigitNumber();
        let paymentReferenceNumber = `Contribution.1234567${randomNumber}`;
        let data = {
            "transactionReference": paymentReferenceNumber,
            "paymentReference": "NA1257412369871812",
            "amount": 50000,
            "type": "SGC",
            "targetInvestments": [
                {
                    "id": investmentId,
                    "percent": 100
                }
            ],
            "empCode": "45004189708",
            "empName": "COLES ONLINE",
            "employerPayrollNumberIdentifier": "001",
            "effectiveDate": `${DateUtils.localISOStringDate(this.today)}`,
            "paymentReceivedDate": `${DateUtils.localISOStringDate(this.today)}`,
            "payPeriodStartDate": null,
            "payPeriodEndDate": null,
            "messageType": "Government",
            "initiator": null,
            "historic": true,
            "caseReference": null,
            "conversationId": paymentReferenceNumber

        };
        let response = await this.post(path, JSON.stringify(data));
        let responseBody = await response.json();
        let Id = responseBody?.linearId?.id || null;
        let amount = responseBody?.amount || 0;
        return { linearId: Id, amount: amount };
    }




}