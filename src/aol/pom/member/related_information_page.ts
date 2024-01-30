import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../../../common/pom/base_page';
import { ReviewCase } from '../component/review_case'

export class RelatedInformationPage extends BasePage {

    readonly relatedInformationTab: Locator;
    
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
}