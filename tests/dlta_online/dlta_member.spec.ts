import { dltaOnlineTest as test } from "../../src/dlta_online/base_dlta_online_test"
import { Admins } from "../../src/dlta_online/data/admins";
import { DateUtils } from "../../src/utils/date_utils";
import { csv_utils } from "../../src/utils/csv_utils";

test.describe("Member Management in DLTA @dltaonline", () => {

    test("Testing temp", async() => {
        console.log(DateUtils.ddmmyyyStringDate())
    })

    test("Add member, roloverIn, rolloverOut", async({loginPage, dashboardPage, memberPage, memberTransactionPage}) => {
        test.setTimeout(600000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Navigate to add member and create", async () => {
            await dashboardPage.navigateToAccumulationAddMember();
            let addedMember = await memberPage.addNewMember();
            await memberPage.selectMember(addedMember);
            await memberTransactionPage.memberRolloverIn();
            await memberTransactionPage.memberRolloverOut();
        })
       
    })

    test("Add Member Rollover In", async({loginPage, dashboardPage, memberPage, memberTransactionPage}) => {
        test.setTimeout(600000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Add Member Personal Contribution", async () => {
            await dashboardPage.navigateToMembers();
            await memberPage.selectMember('Alexis');
            await memberTransactionPage.memberRolloverIn();
        })
    })

    test("Add Member Rollover Out", async({loginPage, dashboardPage, memberPage, memberTransactionPage}) => {
        test.setTimeout(600000);
        let admin = Admins.getAdminByUsername("admin@tinasuper.com");

        await test.step("Login", async () => {
            await loginPage.navigateTo();
            await loginPage.doLogin(admin.username, admin.password);
        })

        await test.step("Perform Full Rollover exit", async () => {
            await dashboardPage.navigateToMembers();
            await memberPage.selectMember('Alexis');
            await memberTransactionPage.memberRolloverIn();
            await memberTransactionPage.memberRolloverOut();
        })
    })

    test ("Read CSV", async({}) => {
        await csv_utils.readcsv();
    });

    test ("Write CSV", async({}) => {
        await csv_utils.writecsv();
    });

})