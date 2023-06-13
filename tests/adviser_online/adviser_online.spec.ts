import { expect } from "@playwright/test";
import { adviserOnlineTest as test } from "../../src/adviser_online/base_adviser_online_test"
import { Advisers } from "../../src/adviser_online/data/advisers";

test.describe("Test describe block @adviser_online", () => {

    test("Successful login and checks", async ({ loginPage, dashboardPage }) => {

        let adviser = Advisers.getAdviserByUsername("victor.li@grow.inc");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(adviser.username, adviser.password);
        })

        await test.step("Welcome name check", async () => {
            await expect(dashboardPage.welcomeHeading).toHaveText("Welcome, Dave!");
        })

        await test.step("Clients check", async () => {
            await dashboardPage.navbar.clickClients();
            await dashboardPage.sleep(2000); //i.e. doing something...
        })

        await test.step("Reports check", async () => {
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
        })

    })

})
