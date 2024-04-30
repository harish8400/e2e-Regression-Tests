import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { TFN } from "../../data/tfn";
import { ReviewCase } from "../component/review_case";
import { DateUtils } from "../../../utils/date_utils";

export class MemberOverView extends BasePage{
    readonly processesLink: Locator;
    readonly reviewCase: ReviewCase;
    readonly processException: Locator;
    readonly memberAccumulationAccount_Tab: Locator;

    readonly overViewTab: Locator;
    readonly TFNStatusValid: Locator;
    readonly TFNStatus_NotSupplied: Locator;
    readonly superTickButton:Locator;
    readonly superTickSuccessIcon: Locator;
    readonly editPersonalDetails: Locator;
    readonly TFN_Field: Locator;
    readonly tfnSource_dropdown: Locator;
    readonly tfnSourceOption_Member: Locator;
    readonly memberUpdate_sucessMessage: Locator;
    readonly DOD: Locator;

    //Case Review
    readonly viewCase: Locator;
    readonly createCase: Locator;
    readonly linkCase: Locator;
    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;

    constructor(page:Page){
        super(page)

        this.reviewCase = new ReviewCase(page);
        this.DOD = page.locator('input[name="dateOfDeath"]');
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]");
        this.processesLink = page.getByRole('link', { name: 'Processes' });
        this.memberAccumulationAccount_Tab = page.locator("//button[contains(.,'Accumulation' ) or contains(.,'HESTA for Mercy Super')]");
        this.overViewTab = page.getByRole('button', { name: 'Overview' });
        this.TFNStatusValid = page.locator('div').filter({ hasText: /^TFN Valid$/ });
        this.TFNStatus_NotSupplied = page.locator('div').filter({ hasText: /^TFN Not Supplied$/ }).locator('div').first();
        this.superTickButton = page.getByRole('button', { name: 'Supertick' });
        this.superTickSuccessIcon = page.getByText('Supertickalert-success icon');
        this.editPersonalDetails = page.locator('div').filter({ hasText: /^Personal DetailsEdit Content$/ }).getByRole('button');
        this.TFN_Field = page.getByLabel('TFN');
        this.tfnSource_dropdown = page.locator('#gs5__combobox div').first();
        this.tfnSourceOption_Member = page.getByRole('option', { name: 'Member' });
        this.memberUpdate_sucessMessage = page.getByText('Updated member.');

        //case review
        this.viewCase = page.getByRole('button', { name: 'View Cases' });
        this.createCase = page.getByRole('button', { name: 'Create Case' });
        this.linkCase = page.getByRole('button', { name: 'Link to Case' });
        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
    }

    async addTFN(){
        await this.overViewTab.click();
        await this.TFN_Field.fill(TFN.getValidTFN().toString());
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(5000);
        await this.linkCase.click();
        await this.reviewCase.reviewCaseProcess(this.memberUpdate_sucessMessage);
    }

    async verifyTFNStatus(status:boolean){
        await this.sleep(6000);
        await this.overViewTab.click();
        await this.sleep(3000);
        if(status==true){
            await expect(this.TFNStatusValid).toBeVisible();
        }
        else{
            await expect(this.TFNStatus_NotSupplied).toBeVisible();
        }
    }

    async superTickVerification(){
        await this.sleep(5000);
        await this.overViewTab.click();
        await this.TFNStatusValid.scrollIntoViewIfNeeded();
        await expect(this.TFNStatusValid).toBeVisible();
        await this.superTickButton.scrollIntoViewIfNeeded();
        await this.superTickButton.click();
        await this.superTickSuccessIcon.waitFor({state: 'visible'});
        await expect(this.superTickSuccessIcon).toBeVisible();
    }

    async addDateOfDeath(){
        await this.overViewTab.click();
        await this.sleep(3000);
        await this.editPersonalDetails.click();
        await this.DOD.fill(DateUtils.ddmmyyyStringDate(-1));
        await this.viewCase.click();
        await this.createCase.click();
        await this.sleep(5000);
        await this.linkCase.click();
        await this.reviewCase.reviewCaseProcess(this.memberUpdate_sucessMessage);
    }
}