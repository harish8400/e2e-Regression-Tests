import { Locator, Page, expect, } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
import * as employer from "../data/employer.json";
import { DateUtils } from "../../utils/date_utils";
import * as member from "../data/member.json";
import { TFN } from "../data/tfn";

import { UtilsAOL } from "../utils_aol";


export class EmployerPage extends BasePage {

    readonly employerLink: Locator;
    readonly createNewEmployer: Locator;
    readonly name: Locator;
    readonly iDTypeArrow: Locator;
    readonly employerArrow: Locator;
    readonly startDate: Locator;
    readonly endDate: Locator;
    readonly countryArrow: Locator;
    readonly addressLine1: Locator;
    readonly state: Locator;
    readonly abn: Locator;
    readonly partcipating: Locator;
    readonly accumulationProduct: Locator;
    readonly backButton: Locator;
    readonly abnTextField: Locator;
    readonly saveEmployer: Locator;
    readonly firstRowEmployer: Locator;
    readonly editIcon: Locator;
    readonly associatedText: Locator;
    readonly saveButton: Locator;


    readonly title: Locator;
    readonly selectTitle: Locator;
    readonly givenName: Locator;
    readonly surname: Locator;
    readonly dob: Locator;
    readonly gender: Locator;
    readonly genderSelect: Locator;
    readonly emailAddress: Locator;
    readonly primaryPhone: Locator;
    readonly preferredContactMethod: Locator;
    readonly preferredContactMethodSelect: Locator;
    readonly tfn: Locator;
    readonly address1: Locator;
    readonly city: Locator;
    //readonly state: Locator;
    readonly stateSelect: Locator;
    readonly postcode: Locator;
    readonly preferredContactName: Locator;
    readonly residencyStatus: Locator;
    readonly residencyStatusSelect: Locator;
    readonly dateJoined: Locator;
    readonly nextStep: Locator;
    readonly memberGivenName: string;
    readonly memberSurname: string;
    readonly employer: Locator;
    readonly accumulationAddMember: Locator;
    readonly testEmployerText: Locator;
    readonly employername: string;
    readonly newEmployerText: Locator;

    constructor(page: Page) {
        super(page)

        this.newEmployerText = page.getByRole('heading', { name: 'Add New Employer' });
        this.employername = UtilsAOL.randomSurname(5);
        this.employerLink = page.getByRole('link', { name: 'Employers' });
        this.createNewEmployer = page.getByRole('button', { name: 'add-circle icon Add new' });
        this.name = page.getByLabel('Name *');
        this.iDTypeArrow = page.locator('#gs2__combobox div').first();
        this.employerArrow = page.locator('#gs3__combobox div').first();
        this.startDate = page.locator('input[name="startDate"]');
        this.endDate = page.locator('input[name="endDate"]');
        this.countryArrow = page.locator('#gs4__combobox').getByLabel('Select', { exact: true });
        this.addressLine1 = page.getByLabel('Address line 1');
        //this.state = page.getByLabel('State');
        this.abn = page.getByRole('option', { name: 'ABN' });
        this.partcipating = page.getByRole('option', { name: 'Associated', exact: true });
        this.accumulationProduct = page.getByRole('link', { name: 'Accumulation' });
        this.backButton = page.getByRole('button', { name: 'arrow-left icon clipboard-' });
        this.abnTextField = page.getByLabel('WPN *');
        this.abnTextField = page.getByLabel('ABN *');
        this.saveEmployer = page.getByRole('button', { name: 'SAVE EMPLOYER' });
        this.firstRowEmployer = page.getByRole('cell', { name: 'test employer' });
        this.editIcon = page.locator('div').filter({ hasText: /^Employer detailsEdit Content$/ }).getByRole('button');
        this.associatedText = page.getByRole('option', { name: 'Associated', exact: true });
        this.saveButton = page.getByRole('button', { name: 'SAVE' });

        this.title = page.getByTitle('Title').getByRole('img');
        this.selectTitle = page.locator('li').filter({ hasText: /^Mr$/ });
        this.givenName = page.getByTitle('Given Name').getByRole('textbox');
        this.surname = page.getByTitle('Surname').getByRole('textbox');
        this.dob = page.getByTitle('DOB').getByPlaceholder('dd/mm/yyyy');
        this.gender = page.getByTitle('Gender').getByPlaceholder('Select');
        this.genderSelect = page.locator('li').filter({ hasText: /^Male$/ });
        this.emailAddress = page.getByTitle('Email Address').getByRole('textbox');
        this.primaryPhone = page.getByTitle('Primary Phone').getByRole('textbox');
        this.preferredContactMethod = page.getByTitle('Preferred contact method').getByPlaceholder('Select');
        this.preferredContactMethodSelect = page.getByText('Digital');
        this.tfn = page.getByTitle('TFN').getByRole('textbox');
        this.address1 = page.getByTitle('Residential Address line 1').getByRole('textbox');
        this.city = page.getByTitle('City/Town').getByRole('textbox');
        this.state = page.getByTitle('State').getByLabel('Select', { exact: true });
        this.stateSelect = page.getByText('New South Wales');
        this.postcode = page.getByTitle('Postcode').getByRole('textbox');
        this.preferredContactName = page.getByTitle('Preferred Contact Name').getByRole('textbox');
        this.residencyStatus = page.getByTitle('Residency Status').getByPlaceholder('Select');
        this.residencyStatusSelect = page.getByText('Resident', { exact: true });
        this.dateJoined = page.getByTitle('Date Joined').getByPlaceholder('dd/mm/yyyy');
        this.nextStep = page.getByRole('button', { name: 'Next Step arrow-right icon' });
        this.memberGivenName = UtilsAOL.randomName();
        this.employer = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.memberSurname = UtilsAOL.randomSurname(5);
        this.accumulationAddMember = page.getByRole('button', { name: 'add-circle icon Add Member' });
        this.testEmployerText = page.getByText('test employer');
        this.abn = page.getByRole('option', { name: 'ABN' });
    }

    async createNewemployer() {

        await this.accumulationProduct.click();
        await this.employerLink.click();
        await this.createNewEmployer.click();
        await this.name.fill("Test " + this.employername);
        await this.iDTypeArrow.click();
        await this.abn.click();
        await this.abnTextField.fill(employer.abn);
        await this.employerArrow.click();
        await this.partcipating.click();
        await this.startDate.fill(`${DateUtils.ddmmyyyStringDate(-7)}`);
        await this.saveEmployer.click();
        await this.sleep(3000);
        await expect(this.page.getByText(this.employername).first()).toBeVisible();
        return this.employername;

    }

    async updateNewemployer() {

        await this.accumulationProduct.click();
        await this.employerLink.click();
        await this.page.getByText('Test').first().click();
        await this.editIcon.click();
        await this.name.fill("Test " + this.employername);
        await this.saveButton.click();
        await expect(this.page.getByText(this.employername)).toBeVisible();

    }

    async verifyNewlyAddedMemberUnderSelectMemberInMemberPage(newEmployer: string) {

        await this.accumulationAddMember.click();
        let tfns = TFN.getValidTFN();
        await this.title.click();
        await this.selectTitle.click();
        await this.givenName.fill(this.memberGivenName);
        await this.surname.fill(this.memberSurname);
        await this.dob.fill(member.dob);
        await this.gender.click();
        await this.genderSelect.click();
        await this.emailAddress.fill(member.email);
        await this.primaryPhone.fill(member.phone);
        await this.preferredContactMethod.click();
        await this.preferredContactMethodSelect.click();

        await this.tfn.click();
        await this.tfn.fill(tfns.tfn);

        await this.address1.fill(member.address);
        await this.city.fill(member.city);
        await this.state.click();
        await this.stateSelect.click();
        await this.postcode.fill(member.postcode);
        await this.preferredContactName.fill(this.memberGivenName);
        await this.residencyStatus.click();
        await this.residencyStatusSelect.click();

        await this.nextStep.click();
        await this.employer.click();

        await this.page.getByRole('combobox', { name: 'Search for option' }).locator('div').first().click();
        await this.page.getByRole('searchbox').fill(newEmployer);

        await expect(this.page.getByRole('option', { name: newEmployer }).first()).toBeVisible();
    }

    async getEmployerTypes() {

        await this.accumulationProduct.click();
        await this.employerLink.click();
        await this.createNewEmployer.click();
        await this.employerArrow.click();
        let employerTypesOptions = await this.page.getByRole('option').all();

        let employerTypes = [];
        for(const row of employerTypesOptions){
            let type = await row.textContent();
            employerTypes.push(type);
        }
        return employerTypes;

    }

}