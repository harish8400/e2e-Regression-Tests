import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../../common/pom/base_page";
import { AssertionError } from "assert";
import { allure } from "allure-playwright";

export class ReviewCase extends BasePage {

    readonly approveProcessStep: Locator;
    readonly retryProcessStep: Locator;
    readonly rejectProcessStep: Locator;
    readonly processException: Locator;
    readonly caseID: Locator;

    constructor(page: Page) {
        super(page);

        this.approveProcessStep = page.getByRole('button', { name: 'Approve' });
        this.retryProcessStep = page.getByRole('button', { name: 'reset icon Retry' });
        this.rejectProcessStep = page.getByRole('button', { name: 'Reject' });
        this.processException = page.locator("(//p[contains(text(),'java.lang.IllegalArgumentException')])[1]")
        this.caseID = page.locator(`(//span[@class='inline-block align-middle text-xs font-semibold'])[1]`);
        //this.processException = page.getByText('java.lang.IllegalArgumentException');

    }

    async reviewCaseProcess(successLocator: Locator){

      console.log('Case ID: ' + await this.caseID.textContent());
        //Review case process steps, approve/retry or exit on exception
        do {
          //Approve step
          if (await this.approveProcessStep.count() > 0) {
            try {
              await this.approveProcessStep.click({ timeout: 5000 });
            }
            catch (TimeoutException) {
            }
          }
    
          //Retry step
          if (await this.retryProcessStep.count() > 0) {
            try {
              await this.retryProcessStep.click({ timeout: 5000 });
            }
            catch (TimeoutException) {
            }
          }
    
          //Break if there is an process exception
          if (await this.processException.count() > 0) {
            throw new AssertionError({ message: "Case Process has Failed" });
          }
    
          await this.sleep(5000);
    
        } while ( await successLocator.count() == 0 );
        //await successLocator.scrollIntoViewIfNeeded();
        await expect(successLocator).toBeVisible();
    
      }

      async reviewAndRejectCase(successLocator: Locator){

        console.log('Case ID: ' + await this.caseID.textContent());
        //Review case process steps, approve/retry or exit on exception
        do {
          
          //Reject step
          if (await this.rejectProcessStep.count() > 0) {
            try {
              await this.rejectProcessStep.click({ timeout: 5000 });
            }
            catch (TimeoutException) {
            }
          }
    
          //Break if there is an process exception
          if (await this.processException.count() > 0) {
            throw new AssertionError({ message: "Case Process has Failed" });
          }
    
          await this.sleep(2000);
    
        } while ( await successLocator.count() == 0 );
    
        await expect(successLocator).toBeVisible();
    
      }

      // to do - delete if not referenced
      async approveAndVerifyError(successLocator: Locator){

        //Review case process steps, approve/retry or exit on exception
        do {
          //Approve step
          if (await this.approveProcessStep.count() > 0) {
            try {
              await this.approveProcessStep.click({ timeout: 5000 });
            }
            catch (TimeoutException) {
            }
          }
    
          //Retry step
          if (await this.retryProcessStep.count() > 0) {
            try {
              await this.retryProcessStep.click({ timeout: 5000 });
            }
            catch (TimeoutException) {
            }
          }
    
          //Break if there is an process exception
          if (await this.processException.count() > 0) {
            //throw new AssertionError({ message: "Case Process has Failed" });
            break;
          }
    
          await this.sleep(5000);
    
        } while ( await successLocator.count() == 0 );
    
        await expect(successLocator).toBeVisible();
    
      }

      async captureScreenshot(screenShotName: string = 'screenshot'){
        allure.attachment(screenShotName, await this.page.screenshot({ fullPage:true }), 'image/png');
      }
    
}