//import { expect } from "@playwright/test";
import { adviserOnlineTest as test } from "../../src/adviser_online/base_adviser_online_test"
import { Advisers } from "../../src/adviser_online/data/advisers";


test.describe("Test describe block @adviser_online", () => {

    test("Successful login and checks", async ({ loginPage, dashboardPage, clientPage }) => {

        let adviser = Advisers.getAdviserByUsername("ajay.kaveripakam@grow.inc");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(adviser.username, adviser.password);
                        
        })

        /* await test.step("Welcome name check", async () => {
            await expect(dashboardPage.welcomeHeading).toHaveText("Welcome, Dave!");
        })*/

        await test.step("Clients check", async () => {            
            await dashboardPage.navbar.clickClients();
            console.log('clicked on clients tab');
            await dashboardPage.sleep(2000); //i.e. doing something...
        })

        await test.step("click on client in client list ", async () => {
            await clientPage.clickOnClient();
            //await clientPage.sleep(5000);
            await clientPage.verifyClientPersonalInformation();
            //await clientPage.verifyDownload();

        })

        await test.step("TFN section check", async () => {
            await clientPage.verifyTFN();
            
        })

        await test.step("Verify Contact details of the client", async () => {
            await clientPage.verifyContactDetails();
            
        })

        await test.step("Verify Employment Information of the client", async () => {
            await clientPage.verifyEmploymentInformation();
            
        })

        

        /* await test.step("click on Transaction tab and verify Bpay ", async () => {
            
            await clientPage.clickTransactionTab();
            await clientPage.sleep(5000);
            await clientPage.verifyBpay();
            await clientPage.verifyBpayDetails();
            

        }) */

        

       /* await test.step("Reports check", async () => {
            await dashboardPage.navbar.clickReports();
            await dashboardPage.sleep(2000); //i.e. doing something...
        })

        await test.step("Investments check", async () => {
            let expectedInvestments = [
                "GROW International Fund - Class C$63,000.00($500,000.00) + 11.10% ",
                "THIS SHOULD FAIL - Class C$60,456.78($500,000.00) + 11.10% "
            ]
            await dashboardPage.navbar.clickDashBoard();
            let actualInvestments = await dashboardPage.yourPortfolio.getInvestments();
            expect(actualInvestments).toEqual(expectedInvestments)
        })

        await test.step("Logout", async () => {
            await dashboardPage.doLogout();
        }) */

    })

})
