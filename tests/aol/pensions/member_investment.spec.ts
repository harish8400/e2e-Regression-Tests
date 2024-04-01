import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { FUND } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";
import * as data from "../../../data/aol_test_data.json"

export const test = base.extend<{apiRequestContext: APIRequestContext;}>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Money gets invested into CASH after roll-in post member creation @pension", async ({ navBar, pensionInvestmentPage ,pensionTransactionPage, pensionAccountPage, apiRequestContext}) => {
    try {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        await pensionInvestmentPage.RolloverInTransaction();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"ABP - Pension draw-down as Proportional @pension", async ({ apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than proportional
    if (data.generate_test_data_from_api) {
    await test.step("Create Pension Account & Select the added member ", async () => {
        await navBar.navigateToPensionMembersPage();
        let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
    });
}
else{
    await test.step("Navigate Accumulation Mmembers list & select the member", async () => {
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change);
    });
}
    await test.step("Change the dradown order to proportional & validate the pension histoty", async () => {
        await pensionInvestmentPage.DrawdownTransactionsProportional();
    });
})

test(fundName()+"ABP - Pension draw-down as Specific order @pension", async ({ apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than Specified Order
    if (data.generate_test_data_from_api) {
    await test.step("Create Pension Account & Select the added member ", async () => {
            await navBar.navigateToPensionMembersPage();
            let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
            console.log('ProcessId:', processId);
            await pensionAccountPage.ProcessTab();
            const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
            await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
            await new Promise(resolve => setTimeout(resolve, 10000));
            await pensionAccountPage.reload();
            await navBar.navigateToPensionMembersPage();
            await navBar.selectMember(memberNo);
        });
    }
    else{
        await test.step("Navigate Pension Mmembers list & select the member", async () => {
            await navBar.navigateToPensionMembersPage();
            await navBar.selectMember(data.members.Pension_Drawdown_Change);
        });
    }

    await test.step("change the drawdown order to specified order & validate the pension history", async () => { 
        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();
    });   
})

test(fundName()+"ABP - Pension draw-down as Percentage @pension", async ({ pensionAccountPage, apiRequestContext, navBar, pensionInvestmentPage }) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than Percentage
if (data.generate_test_data_from_api) {
    await test.step("Create Pension Account & Select the added member ", async () => {
        await navBar.navigateToPensionMembersPage();
        let { memberNo, processId } = await MemberApiHandler.createPensionShellAccount(apiRequestContext);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(memberNo);
    });
}
else{
    await test.step("Navigate Pension Mmembers list & select the member", async () => {
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change);
    });
}
    await test.step("change the drawdown order to Percentage & Validate pension history", async () => {
        await pensionInvestmentPage.DrawdownTransactionsPercentage();
    });  
})

test(fundName()+"TTR - Pension draw-down as Proportional @pension", async ({ apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than proportional
if (data.generate_test_data_from_api) {
    await test.step("Create TTR Account & Select the added member ", async () => {
        await navBar.navigateToTTRMembersPage();
        const { memberNo, processId} = await ShellAccountApiHandler.createPensionShellAccount(apiRequestContext);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(memberNo);
    });
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change);
    });
}
    await test.step("Change the dradown order to proportional & validate the pension histoty", async () => {
        await pensionInvestmentPage.DrawdownTransactionsProportional();
    });
    
})

test(fundName()+"TTR - Pension draw-down as Specific order @pension", async ({ apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than Specified Order
if (data.generate_test_data_from_api) {
    await test.step("Create TTR Account & Select the added member ", async () => {
        await navBar.navigateToTTRMembersPage();
        const { memberNo, processId} = await ShellAccountApiHandler.createPensionShellAccount(apiRequestContext);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(memberNo);
    });
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change);
    });
}
        
    await test.step("change the drawdown order to specified order & validate the pension history", async () => { 
        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();
    }); 
})

test(fundName()+"TTR - Pension draw-down as Percentage @pension", async ({ apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than Percentage
if (data.generate_test_data_from_api) {
    await test.step("Create TTR Account & Select the added member ", async () => {
        await navBar.navigateToTTRMembersPage();
        const { memberNo, processId} = await ShellAccountApiHandler.createPensionShellAccount(apiRequestContext);
        console.log('ProcessId:', processId);
        await pensionAccountPage.ProcessTab();
        const caseGroupId = await MemberApiHandler.getCaseGroupId(apiRequestContext, processId);
        await MemberApiHandler.approveProcess(apiRequestContext, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 10000));
        await pensionAccountPage.reload();
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(memberNo);
    });
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change);
    });
}
    await test.step("change the drawdown order to Percentage & Validate pension history", async () => {
        await pensionInvestmentPage.DrawdownTransactionsPercentage();
    });
})

test(fundName()+"-For future drawdown Members should not be able to select any investment options in which the money is NOT currently invested @pension", async ({ navBar, pensionInvestmentPage ,pensionTransactionPage,pensionAccountPage, apiRequestContext }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
            case FUND.AE:
                await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        }

        await pensionInvestmentPage.verifyFutureDrawDownOptions();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify if user can add investment price for Investment product", async ({ navBar, investmentsAndPricing }) => {
    try {
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.addInvestmentPrice();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify edit/updating an existing investment product", async ({ navBar, investmentsAndPricing }) => {
    try {
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.editInvestment();
    } catch (error) {
        throw error;
    }
})


