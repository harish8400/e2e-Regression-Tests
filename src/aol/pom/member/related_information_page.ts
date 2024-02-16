import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../../common/pom/base_page';
import { ReviewCase } from '../component/review_case'
import { DateUtils } from '../../../utils/date_utils';

export class RelatedInformationPage extends BasePage {

    readonly relatedInformationTab: Locator;
    readonly clipBoardIcon: Locator;
    readonly hestaForMercyTab: Locator;
    
    //Edit Correspondence
    readonly editCorrespondenceButton: Locator;
    readonly correspondenceDropdown: Locator;
    readonly correspondeceOptionInactive: Locator;
    readonly reasonDropdown: Locator;
    readonly inactiveReason1: Locator;
    readonly inactiveReason2: Locator;
    readonly inactiveReason3: Locator;
    readonly correspondenceSuccessMessage: Locator;
    readonly correspondenceStatus: Locator;

    //verification information
    readonly superTickVerificationRow: Locator;

    //Condition of Release
    readonly addConditionOfRelease_button: Locator;
    readonly conditionForRelease_dropdown: Locator;
    readonly option_65orOlder: Locator;
    readonly expiryDate: Locator;
    readonly confirmationMessage: Locator;

    //Case Review
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;

    //Exceptions
    readonly processException: Locator;
    readonly reviewCase: ReviewCase;

    constructor(page: Page){
        super(page)

        this.reviewCase = new ReviewCase(page);
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.clipBoardIcon = page.getByRole('button', { name: 'arrow-left icon clipboard-' });

        //edit correspondence
        this.relatedInformationTab = page.getByRole('button', { name: 'Related Information', exact: true });
        this.editCorrespondenceButton = page.locator('div').filter({ hasText: /^Manage Case - CorrespondenceEdit ContentSend correspondence status Active$/ }).getByRole('button');
        this.correspondenceDropdown = page.getByRole('combobox', { name: 'Search for option' }).getByLabel('Select', { exact: true });
        this.correspondeceOptionInactive = page.getByRole('option', { name: 'Inactive' });
        this.reasonDropdown = page.locator('#gs4__combobox').getByLabel('Select', { exact: true });
        this.inactiveReason1 = page.getByRole('option', { name: 'Lost member' });
        this.inactiveReason2 = page.getByRole('option', { name: 'Member death' });
        this.inactiveReason3 = page.getByRole('option', { name: 'Member exited' });
        this.correspondenceSuccessMessage = page.getByText('Processed Payment.');
        this.correspondenceStatus = page.getByText('Send correspondence status Inactive');

        //Verification Information
        this.hestaForMercyTab = page.getByRole('button', { name: 'HESTA for Mercy Super' });
        this.superTickVerificationRow = page.getByRole('row').nth(5);

        //Condition of Release
        this.addConditionOfRelease_button = page.getByRole('button', { name: 'add-circle icon Add Condition' });
        this.conditionForRelease_dropdown = page.getByRole('combobox', { name: 'Search for option' });
        this.option_65orOlder = page.getByRole('option', { name: 'or Older' });
        this.expiryDate = page.getByPlaceholder('dd/mm/yyyy');
        this.confirmationMessage = page.getByText('1. Create or Update Condition');

        //case review
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });

    }

    async editCorrespondence(inactiveReason: string){
        await this.relatedInformationTab.click();
        await this.editCorrespondenceButton.click();
        await this.correspondenceDropdown.click();
        await this.correspondeceOptionInactive.click();
        await this.reasonDropdown.click();

        if(inactiveReason == 'Lost Member'){
            await this.inactiveReason1.click();
        }
        else if(inactiveReason == 'Member Death'){
            await this.inactiveReason2.click();
        }
        else{
            await this.inactiveReason3.click();
        }

        this.sleep(3000);
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(9000);
        await this.linkCase.click();
        await this.sleep(6000);
        await expect(this.correspondenceStatus).toBeVisible();
    }

    async addConditionOfRelease(){
        await this.relatedInformationTab.click();
        await this.sleep(3000);
        await this.addConditionOfRelease_button.click();
        await this.viewCase.click();
        await this.sleep(3000);
        await this.createCase.click();
        await this.sleep(3000);
        await this.conditionForRelease_dropdown.click();
        await this.option_65orOlder.click();
        await this.expiryDate.fill(`${DateUtils.ddmmyyyStringDate(0)}`);
        await this.linkCase.click();
        await this.sleep(5000);
        expect(this.confirmationMessage).toBeVisible();
        await this.clipBoardIcon.click();
    }

    async verifySuperTickStatus(){
        await this.hestaForMercyTab.click();
        await this.relatedInformationTab.click();
        await this.sleep(3000);
        await this.superTickVerificationRow.scrollIntoViewIfNeeded();
        await expect(this.superTickVerificationRow).toContainText('SuperTickMatched');
    }
}