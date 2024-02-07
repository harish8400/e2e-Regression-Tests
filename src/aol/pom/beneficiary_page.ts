import { BasePage } from "../../common/pom/base_page";
import { Locator, Page } from "@playwright/test";
import * as member from "../data/member.json";
import { DateUtils } from "../../utils/date_utils";



export class BeneficiaryPage extends BasePage {

    readonly accumulationFirstMember: Locator;
    readonly relationshipBtn: Locator;
    readonly addButton: Locator;
//Beneficiary Input Fields
    readonly beneficiaryName: Locator;
    readonly beneficiaryType: Locator;
    readonly bindingLapsing: Locator;
    readonly beneficiaryRelationship: Locator;
    readonly beneficiaryStartDate: Locator;
    readonly beneficiaryEndDate: Locator;
    readonly beneficiaryShare: Locator;
    readonly beneficiaryShare1: Locator;
    readonly contactFirstName: Locator;
    readonly contactSurName: Locator;
    readonly phoneInputField: Locator;
    readonly emailInputField: Locator;
    readonly genderDropDown: Locator;
    readonly saveButton: Locator;
    readonly nonBinding: Locator;
    readonly childDropDown: Locator;
    readonly linkCase: Locator;
    readonly viewCase: Locator;
    readonly createCase: Locator;
     
    constructor(page: Page) {
        super(page);

        this.accumulationFirstMember = page.locator('td > .cell').first();
        this.relationshipBtn = page.getByRole('button', { name: 'Relationships' });
        this.addButton = page.locator("(//span[@class='text-caption'])[3]");
      //Beneficiary Input Fields
        this.beneficiaryName = page.getByLabel('Beneficiary Name *');
        this.beneficiaryType= page.locator('#gs3__combobox');
        this.beneficiaryRelationship = page.locator('#gs4__combobox');
        this.bindingLapsing = page.getByText('Binding Lapsing');
        this.beneficiaryStartDate = page.locator('input[name="effectiveDate"]');
        this.beneficiaryEndDate =page.locator('input[name="endDate"]');
        this.beneficiaryShare = page.locator('//div[@class="input-number tracking-normal inline-block py-1 border-b w-full border-teal-100 hover:border-teal-300 font-bold"]');
        this.beneficiaryShare1 = page.locator("//input[@id='percent']");
        this.contactFirstName = page.getByLabel('Contact First Name');
        this.contactSurName = page.getByLabel('Contact Surname');
        this.phoneInputField = page.getByLabel('Phone');
        this.emailInputField = page.getByLabel('Email');
        this.genderDropDown = page.locator('#gs5__combobox div').first();
        this.saveButton = page.getByRole('button', { name: 'SAVE' });
        this.nonBinding = page.getByText('Non-Binding');
        this.childDropDown = page.getByRole('option', { name: 'Child' });
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
    }

    async addNewNonBindingNominationOnExistingAccount() {
            await this.sleep(10000);
            await this.accumulationFirstMember.click();
            await this.relationshipBtn.click({ timeout: 5000});
            await this.addButton.click({ timeout: 5000});
      }

      async reltionShipButton() {
        
        await this.relationshipBtn.click({ timeout: 5000});
        await this.addButton.click({ timeout: 5000});
  }

      async beneficiaryInputFileds() {
        await this.beneficiaryName.fill(member.beneficiary); 
        await this.beneficiaryType.click();
        await this.nonBinding.click();
        await this.beneficiaryRelationship.click();
        await this.childDropDown.click();
        //await this.beneficiaryStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.beneficiaryShare.click({ timeout: 5000});
        await this.beneficiaryShare1.fill(member.share); 
        await this.contactFirstName.fill(member.FirstName); 
        await this.contactSurName.fill(member.SurName); 
        await this.phoneInputField.fill(member.phone); 
        await this.emailInputField.fill(member.email); 
        //await this.saveButton.click();
        await this.viewCase.click({ timeout: 5000});
        await this.createCase.click({ timeout: 5000});
        await this.linkCase.click();
      }
      async bindinglapsingInputFileds() {
        await this.beneficiaryName.fill(member.beneficiary); 
        await this.beneficiaryType.click();
        await this.bindingLapsing.click();
        await this.beneficiaryRelationship.click();
        await this.childDropDown.click();
        await this.beneficiaryStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.beneficiaryEndDate.fill('26/02/2024');
        await this.beneficiaryShare.click({ timeout: 5000});
        await this.beneficiaryShare1.fill(member.share); 
        await this.contactFirstName.fill(member.FirstName); 
        await this.contactSurName.fill(member.SurName); 
        await this.phoneInputField.fill(member.phone); 
        await this.emailInputField.fill(member.email); 
        await this.saveButton.click();
        await this.viewCase.click({ timeout: 5000});
        await this.createCase.click({ timeout: 5000});
        await this.linkCase.click();
      }
    
      async beneficiaryInputIsNotEqualToHundredPercent() {
        await this.beneficiaryName.fill(member.beneficiary); 
        await this.beneficiaryType.click();
        await this.bindingLapsing.click();
        await this.beneficiaryRelationship.click();
        await this.childDropDown.click();
        await this.beneficiaryStartDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.beneficiaryEndDate.fill('26/02/2024');
        await this.beneficiaryShare.click({ timeout: 5000});
        await this.beneficiaryShare1.fill(member.share1); 
        await this.contactFirstName.fill(member.FirstName); 
        await this.contactSurName.fill(member.SurName); 
        await this.phoneInputField.fill(member.phone); 
        await this.emailInputField.fill(member.email); 
        await this.saveButton.click();
        await this.viewCase.click({ timeout: 5000});
        await this.createCase.click({ timeout: 5000});
        await this.linkCase.click();

      }
    
} 
