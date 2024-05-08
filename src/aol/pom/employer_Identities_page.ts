import { Locator, Page, expect, } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import * as employer from "../data/employer.json";
import { DateUtils } from "../../utils/date_utils";
import * as member from "../data/member.json";
import { TFN } from "../data/tfn";

import { UtilsAOL } from "../utils_aol";
import assert from "assert";
import { Console, error } from "console";


export class EmployerIdentitiesPage extends BasePage {

    readonly employerIdentitiesLink: Locator;
    readonly addNewEmployer: Locator;
    readonly ABN: Locator;
    readonly abnValue: Locator;
    readonly acnValue: Locator;
    readonly businessName: Locator;
    readonly employerType: Locator;
    readonly partcipating: Locator;
    readonly fundEmployerId: Locator;
    readonly startDate: Locator;
    readonly endDate: Locator;
    readonly countryArrow: Locator;
    readonly country: Locator;
    readonly addressLine1: Locator;
    readonly addressLine2: Locator;
    readonly city: Locator;
    readonly stateArrow: Locator;
    readonly state: Locator;
    readonly postcode: Locator;
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly WPN: Locator;
    readonly wpnValue: Locator;

    readonly contactDetailsAddNew: Locator;
    readonly contactGivenName: Locator;
    readonly surname: Locator;
    readonly contactPosition: Locator;
    readonly phoneNumber: Locator;
    readonly email: Locator;
    readonly outcome: Locator;
    readonly status: Locator;
    readonly filter: Locator;
    readonly EmployerNameFilter: Locator;
    readonly EmployerNameFilterValue: Locator;
    readonly applyButton: Locator;
    readonly getRecord: Locator;
    readonly editEmployer: Locator;
    readonly statusText: Locator;
    readonly statusText1: Locator;
    readonly statusText2: Locator;
    readonly editContactDetails: Locator;



    constructor(page: Page) {
        super(page)

        this.employerIdentitiesLink = page.getByRole('link', { name: 'Employer Identities' });
        this.addNewEmployer = page.getByRole('button', { name: 'add-circle icon' });
        this.ABN = page.getByText('ABN');
        this.abnValue = page.locator('id=abn');
        this.acnValue = page.locator('id=acn');
        this.businessName = page.locator('id=businessName');
        this.employerType = page.locator('#gs2__combobox div').first();
        this.partcipating = page.getByRole('option', { name: 'Associated', exact: true });
        this.fundEmployerId = page.locator('id=identityNo');
        this.startDate = page.locator('input[name="startDate"]');
        this.endDate = page.locator('input[name="endDate"]');
        this.countryArrow = page.locator('#gs3__combobox').getByLabel('Select', { exact: true });
        this.country = page.getByText('Australia');
        this.addressLine1 = page.locator('input[name="address1"]');
        this.addressLine2 = page.locator('id=address2');
        this.city = page.getByLabel('City/Town');
        this.stateArrow = page.locator('#gs4__combobox').getByLabel('Select', { exact: true });
        this.state = page.getByText('New South Wales');
        this.postcode = page.getByLabel('Postcode');
        this.viewCase = page.getByRole('button', { name: 'View Cases' })
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.WPN = page.locator('label').filter({ hasText: 'WPN' }).locator('span').first();
        this.wpnValue = page.getByLabel('WPN *');

        this.contactDetailsAddNew = page.getByRole('button', { name: 'Add new' });
        this.contactGivenName = page.locator('//label[@for="givenName"]/following::input[@id="givenName"]');
        this.surname = page.locator('(//label[@for="surname"]/following::input[@name="surname"])[1]');
        this.contactPosition = page.getByLabel('Contact position');
        this.phoneNumber = page.getByLabel('Phone number');
        this.email = page.getByLabel('Email');

        this.filter = page.getByRole('button', { name: 'FILTER' });
        this.EmployerNameFilter = page.locator('//div[@class="filter-list-item"][normalize-space()="Employer Name"]');
        this.EmployerNameFilterValue = page.locator("(//input[@class='el-input__inner'])[2]");
        this.applyButton = page.getByRole('button', { name: 'APPLY' });
        // this.getRecord = page.locator('//tr[contains(@class,"el-table__row tbl-row-rnd")]');
        this.getRecord = page.locator('//table[@class="el-table__body"]');

        this.editEmployer = page.locator('div').filter({ hasText: /^Employer detailsEdit Content$/ }).getByRole('button');
        this.editContactDetails = page.locator('(//button[contains(@class,"gs-button gs-button-edit-btn")]//span)[2]')


        this.outcome = page.locator('//div[text()=" Outcome "]/following-sibling::div');
        this.status = page.locator('div').filter({ hasText: /^Closed$/ });
        this.statusText = page.locator('//div[contains(@class,"text-xs text-neutral-900")]/following::p[text()="Processed Create Employer."]');
        this.statusText1 = page.locator('//p[normalize-space()="Processed Update Employer Contacts."]');
        this.statusText2 = page.locator('//p[normalize-space()="Processed Update Employer."]')



    }
    async employerIdentities(){
        await this.employerIdentitiesLink.click();
    }
     
    async newEmployer(){
        await this.addNewEmployer.click();
    }

    async createNewEmployer() {
        ///await this.ABN.check();
        await this.abnValue.fill('45004189708');
        //await this.acnValue.fill(acnValue);
        let businessN=UtilsAOL.randomNumber(5);
        await this.businessName.fill(businessN);
        await this.employerType.click();
        await this.partcipating.click();
        // await this.fundEmployerId.fill(fundEmployerId);
        await this.startDate.fill(`${DateUtils.ddmmyyyStringDate(-7)}`);
        await this.addressLine1.fill('Street 5');
        await this.addressLine2.fill('block 6')
        await this.countryArrow.click();
        await this.country.click();
        await this.city.fill('Albury');
        await this.stateArrow.click();
        await this.state.click();
        await this.postcode.fill('2640');
        await this.viewCase.click();
        await this.sleep(2000);
        await this.createCase.click();
        await this.sleep(2000);
        await this.linkCase.click();
        console.log(businessN);
        return businessN;
    }
    async createNewEmployerValidations(){
        await this.sleep(2000);
        await this.statusText.scrollIntoViewIfNeeded();
        const employerUpdatedData = await this.statusText.textContent();
        const trimmedText = employerUpdatedData?.trim();
        console.log(trimmedText);
        const ExpectedText = 'Processed Create Employer.'

        const statusText = await this.outcome.textContent();
        await this.sleep(3000);
        console.log(statusText);
        const ExpectedStatusText = 'Success';

        const statusCode = await this.status.textContent();
        console.log(statusCode);
        const ExpectedStatusCode = 'Closed';

        if (trimmedText == ExpectedText && statusText == ExpectedStatusText && statusCode == ExpectedStatusCode) {
            assert.equal(ExpectedText, trimmedText);
            assert.equal(statusText, ExpectedStatusText);
            assert.equal(statusCode, ExpectedStatusCode);
        }
        else {
            console.error("New Employer creation using ABN failed");
        }
       
    }

    async createNewEmployerWPN() {

    
        await this.employerIdentitiesLink.click();
        await this.addNewEmployer.click();
        await this.WPN.click();
        await this.sleep(2000);
        let tfn = UtilsAOL.generateValidTFN();
        await this.wpnValue.click();
        await this.wpnValue.fill(`${tfn}`);
        await this.sleep(1500)
        //await this.acnValue.fill(acnValue);
        let businessN=UtilsAOL.randomName();
        await this.businessName.fill(businessN + ' ' + UtilsAOL.randomNumber(2));
        await this.employerType.click();
        await this.partcipating.click();
        //await this.fundEmployerId.fill(fundEmployerId);
        //await this.startDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        // await this.addressLine1.fill('Old castle road');
        // await this.addressLine2.fill('block 2')
        // await this.countryArrow.click();
        // await this.country.click();
        // await this.city.fill('Albury');
        // await this.stateArrow.click();
        // await this.state.click();
        // await this.postcode.fill('2640');
        await this.sleep(1500);
        await this.viewCase.click();
        await this.sleep(1500);
        await this.createCase.click();
        await this.sleep(1500);
        await this.linkCase.click();
    }
    async createNewEmployerWPNValidations(){
        await this.sleep(3000);
        await this.statusText.scrollIntoViewIfNeeded();

        await expect(this.statusText).toBeVisible({timeout: 5000})
        const employerUpdatedData = await this.statusText.textContent();
        const trimmedText = employerUpdatedData?.trim();
        console.log(trimmedText);
        const ExpectedText = 'Processed Create Employer.'

        const statusText = await this.outcome.textContent();
        await this.sleep(3000);
        console.log(statusText);
        const ExpectedStatusText = 'Success';

        const statusCode = await this.status.textContent();
        console.log(statusCode);
        const ExpectedStatusCode = 'Closed';

        if (trimmedText==ExpectedText && statusText == ExpectedStatusText && statusCode == ExpectedStatusCode) {
            assert.equal(ExpectedText, trimmedText);
            assert.equal(statusText, ExpectedStatusText);
            assert.equal(statusCode, ExpectedStatusCode);
        }
        else {
            console.error("New Employer creation using WPN failed");
        }
    }

    async addContactDetails() {
        const businessN = await this.createNewEmployer()
        await this.sleep(3000)
        await this.employerIdentitiesLink.click();
        await this.filter.click();
        await this.EmployerNameFilter.click();
        await this.page.waitForTimeout(3000).then(()=>this.EmployerNameFilterValue.fill(businessN));
        await this.applyButton.click();
        await this.getRecord.click();
        await this.editContactDetails.click();
        await this.contactDetailsAddNew.click(); 
        let firstName = UtilsAOL.randomName();
        await this.contactGivenName.fill(firstName);
        let lastName = UtilsAOL.randomSurname(5);
        await this.surname.fill(lastName);
        ///await this.contactPosition.fill('Primary');
        ///await this.phoneNumber.fill('+61 4 1234 5678');
        await this.email.fill('minal.tate@grow.inc');
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(2000);
        await this.linkCase.click();
    }

    async addContactDetailsValidation(){
        await this.sleep(3000);
        await this.statusText1.scrollIntoViewIfNeeded();

        const employerUpdatedData = await this.statusText1.textContent();
        const trimmedText = employerUpdatedData?.trim();
        console.log(trimmedText);
        const ExpectedText = 'Processed Update Employer Contacts.'

        const statusText = await this.outcome.textContent();
        await this.sleep(3000);
        console.log(statusText);
        const ExpectedStatusText = 'Success';

        const statusCode = await this.status.textContent();
        console.log(statusCode);
        const ExpectedStatusCode = 'Closed';

        if (trimmedText==ExpectedText && statusText == ExpectedStatusText && statusCode == ExpectedStatusCode) {
            assert.equal(ExpectedText, trimmedText);
            assert.equal(statusText, ExpectedStatusText);
            assert.equal(statusCode, ExpectedStatusCode);
        }
        else {
            console.error("New Employer creation using WPN failed");
        }

    }



    async updateExistingEmployer() {
        const businessN = await this.createNewEmployer();
        await this.sleep(3000);
        await this.employerIdentitiesLink.click();
        await this.filter.click();
        await this.EmployerNameFilter.click();
        await this.page.waitForTimeout(3000).then(()=>this.EmployerNameFilterValue.fill(businessN));
        await this.applyButton.click();
        await this.getRecord.click();
        await this.editEmployer.click();
        let acn=UtilsAOL.randomNumber(9);
        await this.acnValue.fill(acn);
        let businessNM=UtilsAOL.randomNumber(6)
        await this.businessName.fill(businessNM);
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(2000);
        await this.linkCase.click();
    }

    async updateExistingEployerValidations(){
        await this.sleep(3000);
        await this.statusText2.scrollIntoViewIfNeeded();

        const employerUpdatedData = await this.statusText2.textContent();
        const trimmedText = employerUpdatedData?.trim();
        console.log(trimmedText);
        const ExpectedText = 'Processed Update Employer.'

        const statusText = await this.outcome.textContent();
        await this.sleep(3000);
        console.log(statusText);
        const ExpectedStatusText = 'Success';

        const statusCode = await this.status.textContent();
        console.log(statusCode);
        const ExpectedStatusCode = 'Closed';

        if (trimmedText==ExpectedText && statusText == ExpectedStatusText && statusCode == ExpectedStatusCode) {
            assert.equal(ExpectedText, trimmedText);
            assert.equal(statusText, ExpectedStatusText);
            assert.equal(statusCode, ExpectedStatusCode);
        }
        else {
            console.error("New Employer creation using WPN failed");
        }

    }

    async validateInvalidEmployerCreation() {
        await this.employerIdentitiesLink.click();
        await this.addNewEmployer.click();

        await this.viewCase.click();
        await this.sleep(2000);
        await this.createCase.click();
        await this.sleep(2000);
        await this.linkCase.click();
        await this.sleep(2000);

        expect(this.page.getByText('ABN is invalid').first()).toBeVisible();
    }

} 
