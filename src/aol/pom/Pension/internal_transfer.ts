import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import * as memberData from "../../../aol/data/pension_data.json";
import { ReviewCase } from "../component/review_case";
import { FUND } from "../../../../constants";
import { DateUtils } from "../../../utils/date_utils";
import * as member from "../../data/member.json";
import { error } from "console";


export class InternalTransferPage extends BasePage {
    readonly processesLink: Locator;
    readonly reviewCase: ReviewCase;

    readonly AccumulationMembers: Locator;
    readonly AccumulationProduct: Locator;
    readonly ButtonTransactions: Locator;
    readonly ButtonAddTransactions: Locator;
    readonly accumulationOption: Locator;
    readonly internalTransferOption: Locator;
    readonly viewCasesButton: Locator;
    readonly createCaseButton: Locator;
    readonly collapseButton: Locator;
    readonly dropdownInternalTransferType: Locator;
    readonly valueInternalTransferType: Locator;
    readonly dropdownSourceProduct: Locator;
    readonly valueSourceProduct: Locator;
    readonly sourceAccount: Locator;
    readonly buttonLinkToCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly verifyContributionSuccess: Locator;
    readonly verifyContributionSuccessVG: Locator;
    readonly processException: Locator;
    readonly processID: Locator;
    readonly verifySuccessMessage: Locator;
    readonly partialBalance: Locator;
    readonly payFullBalance: Locator;
    readonly valueSourceProductVG: Locator;
    readonly verifySuccessMessageVG: Locator;

    //API Internal Transfer Process

    readonly overViewTab: Locator;
    readonly addAccount: Locator;
    readonly hestaAccount: Locator;
    readonly vanguardAccount: Locator
    readonly preferredContactMethod: Locator;
    readonly preferredContactMethodSelect: Locator;
    readonly residencyStatus: Locator;
    readonly residencyStatusSelect: Locator;
    readonly dateJoined: Locator;
    readonly nextStep: Locator;

    //Employer
    readonly employer: Locator;
    readonly employerSelect: Locator;
    readonly employerStartDate: Locator;
    readonly employerSave: Locator;

    //Consolidation
    readonly addFund: Locator;
    readonly addFundSelect: Locator;
    readonly memberAccountNumber: Locator;
    readonly USI: Locator;
    readonly addFundSelectOption: Locator;
    readonly enterAmount: Locator;
    readonly saveFundDetails: Locator;
    //Investments
    readonly invSelect: Locator;
    readonly invSelection: Locator;
    readonly invPercentage: Locator;
    readonly saveInv: Locator;
    readonly profileType: Locator;
    readonly profileTypeSelect: Locator;
    //Beneficiaries
    readonly beneficiaryName: Locator;
    readonly addNewBeneficiary: Locator;
    readonly beneficiaryType: Locator;
    readonly beneficiaryRelation: Locator;
    readonly beneficiaryRelationSelect: Locator;
    readonly beneficiaryEffectiveDate: Locator;
    readonly beneficiaryPercentage: Locator;
    readonly beneficiaryContactName: Locator;
    readonly beneficiaryAddress1: Locator;
    readonly beneficiaryCity: Locator;
    readonly beneficiaryState: Locator;
    readonly beneficiaryStateSelect: Locator;
    readonly beneficiaryPostcode: Locator;
    readonly beneficiarySave: Locator;
    readonly createAccount: Locator;

    //process 
    readonly memberaccount: Locator;
    readonly review:Locator;
    readonly verifycreationVG: Locator;
    readonly verifyVGMember:Locator
    readonly valueSourceProduct_VG:Locator;


    constructor(page: Page) {
        super(page)
        this.reviewCase = new ReviewCase(page);
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.processesLink = page.getByRole('link', { name: 'Processes' });

        this.payFullBalance = page.locator('.switch-slider').first();
        this.partialBalance = page.getByText('$ 0.00');
        this.AccumulationProduct = page.locator("//p[@type='label'][normalize-space()='Accumulation']");
        this.AccumulationMembers = page.getByRole('link', { name: 'Members' });
        this.ButtonTransactions = page.getByRole('button', { name: 'Transactions' });
        this.ButtonAddTransactions = page.getByRole('button', { name: 'ADD TRANSACTION' });
        this.accumulationOption = page.getByRole('button', { name: 'Accumulation' });
        this.internalTransferOption = page.getByText('Internal Transfer', { exact: true });
        this.viewCasesButton = page.getByRole('button', { name: 'View Cases' });
        this.createCaseButton = page.getByRole('button', { name: 'Create Case' });
        this.collapseButton = page.getByRole('button', { name: 'arrow-left icon clipboard-' });
        this.dropdownInternalTransferType = page.locator("(//div[@class='gs__actions'])[2]");
        this.valueInternalTransferType = page.getByRole('option', { name: 'Internal Transfer' });
        this.dropdownSourceProduct = page.locator("//div[@id='sourceProduct']");
        this.valueSourceProduct = page.getByRole('option', { name: 'HESTA for Mercy Retirement' })
        this.valueSourceProductVG = page.getByRole('option').filter({ hasText: 'Accumulation' });
        this.sourceAccount = page.locator("//input[@id='sourceMemberNumber']");
        this.buttonLinkToCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' })
        this.verifyContributionSuccess = page.getByText('Internal transfer out sub process initiated.');
        this.verifyContributionSuccessVG = page.getByText('Process step completed with note: Internal Transfer Out validated');
        this.processID = page.getByLabel('Related Cases add-circle iconarrow-down iconSearch Related Cases CloseSelect').locator('a');
        this.verifySuccessMessage = page.getByText('Processed Payment.');
        this.verifySuccessMessageVG = page.getByText('Intra fund Internal Transfer out complete.');

        //API Integration Internal Transfer 
        this.overViewTab = page.locator('//button[text()="Overview"]')
        this.addAccount = page.getByRole('button', { name: 'Add new account' });
        this.hestaAccount = page.locator('//li[text()="HESTA for Mercy Super"]');
        this.vanguardAccount = page.locator('//li[text()="Vanguard Accumulation"]');
        this.preferredContactMethod = page.getByTitle('Preferred contact method').getByPlaceholder('Select');
        this.preferredContactMethodSelect = page.getByText('Digital');
        this.residencyStatus = page.getByTitle('Residency Status').getByPlaceholder('Select');
        this.residencyStatusSelect = page.getByText('Resident', { exact: true });
        this.dateJoined = page.getByTitle('Date Joined').getByPlaceholder('dd/mm/yyyy');
        this.nextStep = page.getByRole('button', { name: 'Next Step arrow-right icon' })

        //Employer step
        this.employer = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.employerSelect = page.getByRole('option').nth(0);
        this.employerStartDate = page.getByPlaceholder('dd/mm/yyyy');
        this.employerSave = page.getByRole('button', { name: 'SAVE' });

        //Consolidate step
        this.addFund = page.getByRole('button', { name: 'add-circle icon Add Fund' });
        this.addFundSelect = page.getByRole('combobox', { name: 'Search for option' }).locator('div').first();
        this.addFundSelectOption = page.getByText('External fund account');
        this.memberAccountNumber = page.getByLabel('Member account number *');
        this.USI = page.getByLabel('USI *');
        this.enterAmount = page.getByPlaceholder('0');
        this.saveFundDetails = page.getByRole('button', { name: 'SAVE' });

        //Investment step
        this.invSelect = page.getByRole('main').locator('section').filter({ hasText: 'InvestmentPercentage Add' }).getByPlaceholder('Select');
        this.invSelection = page.locator("(//ul[@class='el-scrollbar__view el-select-dropdown__list'])[2]/li[1]");
        this.invPercentage = page.locator('(//label[text()="Percentage"]/following::input)[2]');
        this.saveInv = page.getByRole('button', { name: 'Add', exact: true })
        this.profileType = page.locator('#membershipProfile').getByPlaceholder('Select');
        this.profileTypeSelect = page.getByText('My Super', { exact: true });

        //Beneficiaries step
        this.addNewBeneficiary = page.getByRole('button', { name: 'Add New' });
        this.beneficiaryName = page.getByLabel('Beneficiary Name *');
        this.beneficiaryType = page.getByText('Non-Binding');
        this.beneficiaryRelation = page.locator('#gs11__combobox div').first()
        this.beneficiaryRelationSelect = page.getByText('Spouse');
        this.beneficiaryEffectiveDate = page.locator('input[name="effectiveDate"]');
        this.beneficiaryPercentage = page.getByPlaceholder('0');
        this.beneficiaryContactName = page.getByLabel('Contact First Name');
        this.beneficiaryAddress1 = page.getByLabel('Residential Address 1 *');
        this.beneficiaryCity = page.getByLabel('City/Town *');
        this.beneficiaryState = page.locator('#gs11__combobox div').first();
        this.beneficiaryStateSelect = page.getByRole('option', { name: 'New South Wales' });
        this.beneficiaryPostcode = page.getByLabel('Postcode *');
        this.beneficiarySave = page.getByRole('button', { name: 'SAVE' });
        this.createAccount = page.getByRole('button', { name: 'Create Account' });

        //process 
        this.memberaccount = page.locator('(//button[@aria-label="Member - Create"])[1]').first();
        this.review = page.locator('//span[text()="In Review"]');
        this.verifycreationVG = page.locator('(//p[text()="Unauthorised"])[1]');
        this.verifyVGMember = page.getByText('Process step completed with note: IRR2Out sent.');
        this.valueSourceProduct_VG = page.getByRole('option', { name: 'Vanguard Super SpendSmart' });


    }

    /** Internal Transaction from Accumulation to Retirement Income Sream */
    async internalTransferMember(transferType: string) {

        await this.ButtonTransactions.click();
        await this.ButtonAddTransactions.click();
        await this.internalTransferOption.click();

        await this.viewCasesButton.click();
        await this.createCaseButton.click();
        await this.sleep(3000);

        await this.dropdownInternalTransferType.click();
        await this.valueInternalTransferType.click();
        await this.dropdownSourceProduct.click();
        await this.sleep(2000);

        if (transferType == 'Accumulation') {
            if (process.env.PRODUCT == FUND.HESTA) {
                await this.valueSourceProduct.click();
            } else {
                await this.valueSourceProductVG.click();
            }
            await this.sourceAccount.fill(memberData.pension.Internal_Transfer_Accumulation_To_ABP_Source_Account);
        }
        else if (transferType == 'ABP') {
            await this.page.getByRole('option').nth(2).click();
            await this.sourceAccount.fill(memberData.pension.Internal_Transfer_ABP_To_Accumulation_Source_Account);
        }
        else {
            await this.page.getByRole('option').first().click();
            await this.sourceAccount.fill(memberData.pension.Internal_Transfer_TTR_To_ABP_Source_Account);
        }

        await this.page.keyboard.down('Tab');
        await this.sleep(2000);
        await this.payFullBalance.click();
        await this.sleep(2000);
        await this.partialBalance.click();
        await this.sleep(2000);
        await this.page.getByPlaceholder('0').fill('5000');

        await this.buttonLinkToCase.click();

        if (process.env.PRODUCT == FUND.HESTA) {
            await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);
        } else {
            await this.reviewCase.reviewCaseProcess(this.verifySuccessMessageVG);
        }

        // Click on sub process
        await this.sleep(3000);
        await this.processID.click();
        await this.sleep(3000);

        if (process.env.PRODUCT == FUND.HESTA) {
            await this.reviewCase.reviewCaseProcess(this.verifySuccessMessage);
        } else {
            await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccessVG);
        }
    }

    async internalTransferProcess(addBeneficiary?: boolean, dateJoinedFundEarlier?: boolean) {

        await this.sleep(3000);
        await this.overViewTab.focus()
        await this.overViewTab.click({ force: true });
        await this.addAccount.click();
        await this.sleep(3000);
        if (process.env.PRODUCT === FUND.HESTA) {
            await this.hestaAccount.click();
        } else if (process.env.PRODUCT === FUND.VANGUARD) {
            await this.vanguardAccount.click();
        }

        await this.preferredContactMethod.click();
        await this.preferredContactMethodSelect.click();

        await this.residencyStatus.click();
        await this.residencyStatusSelect.click();
        if (process.env.PRODUCT === FUND.HESTA && dateJoinedFundEarlier) {
            await this.dateJoined.fill(`${DateUtils.ddmmyyyStringDate(-5)}`);
        } else if (process.env.PRODUCT === FUND.VANGUARD && dateJoinedFundEarlier) {
            await this.dateJoined.fill(`${DateUtils.ddmmyyyStringDate(-5)}`);
        }

        await this.nextStep.click();


        //Employer details
        await this.employer.click();
        await this.employerSelect.click();
        await this.employerStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`)
        await this.employerStartDate.press('Tab');
        await this.employerSave.click();
        await this.nextStep.click();

        //Consolidation details
        await this.addFund.click();
        await this.addFundSelect.click();
        await this.addFundSelectOption.click();
        await this.memberAccountNumber.fill(member.AccNumber);
        await this.USI.fill(member.USI);
        await this.USI.press('Tab');
        await this.enterAmount.fill(member.Amount);
        await this.sleep(1000);
        await this.saveFundDetails.click();
        await this.nextStep.click();

        //Investments
        await this.invSelect.click();
        await this.invSelection.click();
        await this.invPercentage.fill('100');
        await this.saveInv.click();
        await this.profileType.click();
        await this.profileTypeSelect.click();
        await this.nextStep.click();

        //Beneficiaries
        if (addBeneficiary) {
            await this.addNewBeneficiary.click();
            await this.beneficiaryName.fill(member.names[0]);
            await this.beneficiaryName.press('Tab');
            await this.beneficiaryType.click();
            await this.beneficiaryRelation.click();
            await this.beneficiaryRelationSelect.click();
            await this.beneficiaryEffectiveDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
            await this.beneficiaryEffectiveDate.press('Tab');
            await this.beneficiaryPercentage.fill('100');
            await this.beneficiarySave.click();
        }

        //Create account
        await this.createAccount.click();
        await this.sleep(5000);

    }

    async ProcessTab() {
        await this.processesLink.click();
        await this.sleep(3000);
        await this.memberaccount.click();
        await this.review.click();
        await this.page.reload();
        await this.sleep(3000);
        await this.reviewCase.reviewCaseProcess(this.verifycreationVG);
       
        if(this.verifycreationVG){
            await this.sleep(3000);
            await this.processID.click();
            await this.reviewCase.reviewCaseProcess(this.verifyVGMember);
        }else{
            throw error;
        }
    }
    
        
    
    

    async internalTransferMemberOut(transferType: string, memberNo: String) {

        await this.ButtonTransactions.click();
        await this.ButtonAddTransactions.click();
        await this.internalTransferOption.click();

        await this.viewCasesButton.click();
        await this.createCaseButton.click();
        await this.sleep(3000);

        await this.dropdownInternalTransferType.click();
        await this.valueInternalTransferType.click();
        await this.dropdownSourceProduct.click();
        await this.sleep(2000);

        if (process.env.PRODUCT == FUND.HESTA && transferType == 'ABP') {
            await this.valueSourceProduct.click();
        } else if (process.env.PRODUCT == FUND.VANGUARD && transferType == 'ABP') {
            await this.valueSourceProduct_VG.click();
            
        }

        await this.sourceAccount.fill(memberNo.toString());
        await this.page.keyboard.down('Tab');
        await this.sleep(2000);
        //await this.partialBalance.click(); //For partial Balance 
        //await this.sleep(2000);
        //await this.page.getByPlaceholder('0').fill('5000');

        await this.buttonLinkToCase.click();

        if (process.env.PRODUCT == FUND.HESTA) {
            await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccess);
        } else if (process.env.PRODUCT == FUND.VANGUARD) {
            await this.reviewCase.reviewCaseProcess(this.verifySuccessMessageVG);
        }


        // Click on sub process
        await this.sleep(3000);
        await this.processID.click();
        await this.sleep(3000);

        if (process.env.PRODUCT == FUND.HESTA) {
            await this.reviewCase.reviewCaseProcess(this.verifySuccessMessage);
        } else {
            await this.reviewCase.reviewCaseProcess(this.verifyContributionSuccessVG);
        }
    }




}