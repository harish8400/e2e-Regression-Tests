import { allure } from "allure-playwright";
import { aolTest as base } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "playwright";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import * as member from "../../../src/aol/data/member.json";
import pensionMember from "../../../data/aol_test_data.json";

export const test = base.extend<{ apiRequestContext: APIRequestContext; }>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Member");
    await allure.parentSuite(process.env.PRODUCT!);
});

/**This test performs Employment Termination  tests */
test(fundName()+"-Verify an employment termination at current system date is processed successfully @member", async ({ internalTransferPage, apiRequestContext, memberPage, navBar, memberTransactionPage,accountInfoPage }) => {
    try{
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        //** Create a new accumulation member when data from api is set to true */
        if(pensionMember.generate_test_data_from_api){
            await test.step("Create a new Accumulation Member", async () => {
                let {createMemberNo} = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            })
        }
        else{
            //** select existing accumulation member which has employment details when data from api is set to false*/
            await test.step("Select the Member from Accumulation members list", async () => {
                await navBar.selectMember(member.memberID);
            })
        }
        await test.step("Verify termination of employment at current system date is processed", async () => {
            await memberTransactionPage.employmentTerminationForCurrentDate();
        })

    } catch (error) {
        throw error;
    }
})

test(fundName()+"-Verify an employment termination with effective date earlier than current system date is processed successfully @member", async ({ memberPage, internalTransferPage, apiRequestContext, navBar, memberTransactionPage,accountInfoPage ,memberApi}) => {
    try {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })

        //** Create a new accumulation member when data from api is set to true */
        if(pensionMember.generate_test_data_from_api){
            await test.step("Create a new Accumulation Member", async () => {
                let {createMemberNo} = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            })
        }
        else{
            //** select existing accumulation member which has employment details when data from api is set to false*/
            await test.step("Select the Member from Accumulation members list", async () => {
                await navBar.selectMember(member.memberID);
            })
        }
        await test.step("Verify termination of employment with effective date, earlier than current system date is processed", async () => {
            await memberTransactionPage.employmentTerminationForEarlierDate();
        })

    } catch (error) {
        throw error;
    }
})