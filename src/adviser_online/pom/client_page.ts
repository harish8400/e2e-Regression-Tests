import { Locator, Page } from "@playwright/test";
import { BasePage } from "../../common/pom/base_page";
//import { expect } from "@playwright/test";


export class ClientPage extends BasePage {

    private readonly clientlist: Locator;
    private readonly personalDetails: Locator;
    private readonly clientName: Locator;
    private readonly clientDob: Locator;
    private readonly clientDod: Locator;
    private readonly clientNameValue: Locator;
    private readonly clientDobValue: Locator;
    private readonly clientDodValue: Locator;
    private readonly downloadButton: Locator;
    private readonly tfnDetails: Locator;
    private readonly tfnProvided: Locator;
    private readonly contactDetails: Locator;
    private readonly postalAddress: Locator;
    private readonly resedentialAddress: Locator;
    private readonly mobileNumber: Locator;
    private readonly landNumber: Locator;
    private readonly email: Locator;
    private readonly postalAddressValue: Locator;
    private readonly employmentInformation: Locator;
    private readonly salary: Locator;
    private readonly empLinkedtoAcc: Locator;
    private readonly dateJoined: Locator;
    //Transaction Tab
    private readonly transactionTab: Locator;
    private readonly bpaySection: Locator;
    private readonly bpayDetailsLink: Locator;
    private readonly bpayDetails: Locator;
    private readonly personalContributionBpay: Locator;
    private readonly spouseContributionBpay: Locator;
    private readonly otherContributions: Locator;


    
    constructor(page: Page) {
        super(page);
        
        this.clientlist = page.locator('tbody tr:nth-child(1) td:nth-child(1)');
        this.personalDetails = page.getByTestId("//h3[contains(text(),'Personal Details')]");
        this.clientName = page.getByLabel('namelabel');
        this.clientDob = page.getByLabel('Date of birth');
        this.clientDod = page.getByLabel('Date of Death');
        this.clientNameValue = page.getByTestId('//div[1]/section[1]/ul[1]/li[1]/span');
        this.clientDobValue = page.getByLabel('//div[1]/section[1]/ul[1]/li[2]/span');
        this.clientDodValue = page.getByLabel('//div[1]/section[1]/ul[1]/li[3]/span');
        this.downloadButton = page.getByTestId("downloadbutton");
        this.tfnDetails = page.getByTestId("//h3[contains(text(),'//h3[contains(text(),'TFN')]')]");
        this.tfnProvided = page.getByTestId("span[data-testid='providedlabel']");
        this.contactDetails = page.getByTestId("//h3[normalize-space()='Contact Details']");
        this.postalAddress = page.getByLabel('Postal address');
        this.postalAddressValue = page.getByTestId("(//li[@class='grow flex flex-col gap-2'])[1]/span/br");
        this.resedentialAddress = page.getByLabel('Residential address');
        this.mobileNumber = page.getByLabel('Mobile number');
        this.landNumber = page.getByLabel('Landline number');
        this.email = page.getByTestId("//label[@class='small-label'][normalize-space()='Email']");
        this.employmentInformation = page.getByTestId("//h3[normalize-space()='Employment information']");
        this.salary = page.getByLabel('Salary');
        this.empLinkedtoAcc = page.getByTestId("Employer/(s) linked to account");
        this.dateJoined = page.getByLabel('Date joined employer/(s)');
        //Transaction tab
        this.transactionTab = page.getByRole('link', { name: 'Transactions' });
        this.bpaySection = page.getByTestId("//p[@class='font-sans text-black text-lg/normal font-semibold mb-4 leading-6']");
        this.bpayDetailsLink = page.getByTestId("click");
        this.bpayDetails = page.getByTestId("//h1[normalize-space()='BPAY Details']");
        this.personalContributionBpay = page.getByTestId("//label[normalize-space()='Personal contribution BPAY®']");
        this.spouseContributionBpay = page.getByTestId("//label[contains(text(),'Spouse or partner contribution')]");
        this.otherContributions = page.getByTestId("//label[normalize-space()='Other contributions']");
      
       
    }

    async clickTransactionTab(){
        console.log('hhhhhhhhhh');
        await this.transactionTab.click();       
    }

    async verifyBpay(){
        
        await this.bpaySection.isVisible();
        await this.bpayDetailsLink.click();
          
    }

    async verifyBpayDetails(){
        await this.bpayDetails.isVisible();
        await this.personalContributionBpay.isVisible();
        await this.spouseContributionBpay.isVisible();
        await this.otherContributions.isVisible();
    }

    async verifyEmploymentInformation(){
        
        await this.employmentInformation.isVisible();
        await this.salary.isVisible();
        await this.empLinkedtoAcc.isVisible();
        await this.dateJoined.isVisible();
        
    }

    async verifyContactDetails(){
        await this.contactDetails.isVisible();
        await this.postalAddress.isVisible();
    
        await this.resedentialAddress.isVisible();
        await this.mobileNumber.isVisible();
        await this.landNumber.isVisible();
        await this.email.isVisible();
    }

    async verifyTFN(){
        await this.tfnDetails.isVisible();
        await this.tfnProvided.isVisible();
    }

   

    async clickOnClient(){
       
        /* let menuItems = await this.page.locator("//table[@class='table']/tbody/tr").all();
        for (let i = 0; i < menuItems.length; i++){
            // Check if current value is Item 1
            if(await menuItems[i].textContent()==="Manasa"){
                // Click if element with text found
                await menuItems[i].click();    
                break;   
            } 
        } */
        console.log('testt')

        await this.clientlist.click();
    }

    async verifyClientPersonalInformation(){
        await this.personalDetails.isVisible;
        await this.clientName.isVisible;
        await this.clientDob.isVisible;
        await this.clientDod.isVisible
        /* await expect(this.clientNameValue.getByText).toMatch('Mrs. Lora Santini');
        await expect(this.clientDobValue.getByText).toMatch('06 Mar 1990');
        await expect(this.clientDodValue.getByText).toMatch('01 Jan 1970'); */
         
    }
   async verifyDownload(){
    await this.downloadButton.click();

   }
       
     

}