import { allure } from "allure-playwright";
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { fundName } from "../../../src/aol/utils_aol";
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await allure.suite("Money_In");
    await navBar.selectProduct();
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName()+"Contribution with TFN - Verify if contribution is processed successfully", async ({ navBar, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        globalPage.captureScreenshot('Accumulation Member page');
        await navBar.selectMember("363214890");
    });

    let memberNo: string;
    let contributionAmount: string;
    await test.step("Add new Accumulation Member", async () => {
        let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await navBar.selectMember(memberNo);
    })

    // await test.step("Add new Accumulation member", async () => {
    //     addedMember = await memberPage.addNewMember(false, true);
    // });

    await test.step("Verify TFN Status of member", async () => {
        //await memberPage.selectMember(memberNo);
        await memberOverviewpage.verifyTFNStatus(true);
        globalPage.captureScreenshot('Member TFN Status');
    });

    await test.step("Add Personal Contribution", async () => {
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        contributionAmount = await memberTransactionPage.memberRolloverIn('Personal', true);
        globalPage.captureScreenshot('Personal Contribution');
    });

    await test.step("Validate transaction", async () => {
        await globalPage.validateMoneyInTransactionDetail(contributionAmount);
    });

})

test(fundName()+"Contribution without TFN - Verify if contribution is processed successfully @demorun", async ({ navBar, memberPage, memberTransactionPage, memberOverviewpage, memberApi, globalPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
        globalPage.captureScreenshot('Accumulation Member page');
    });

    // let addedMember: string;
    // await test.step("Add new Accumulation member", async () => {
    //     addedMember = await memberPage.addNewMember(true, true);
    // });

    let memberNo: string;
    let contributionAmount: string;
    await test.step("Add new Accumulation Member", async () => {
        let { memberNo, processId } = await AccumulationMemberApiHandler.createMember(memberApi, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const caseGroupId = await AccumulationMemberApiHandler.getCaseGroupId(memberApi, processId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await AccumulationMemberApiHandler.approveProcess(memberApi, caseGroupId!);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await navBar.selectMember(memberNo);
    })

    await test.step("Verify TFN is not available", async () => {
        //await memberPage.selectMember(addedMember);
        await memberOverviewpage.verifyTFNStatus(false);
        globalPage.captureScreenshot('Member TFN Status');
    });

    await test.step("Add Personal Contribution", async () => {
        await memberOverviewpage.memberAccumulationAccount_Tab.click();
        await memberTransactionPage.memberRolloverIn();
        globalPage.captureScreenshot('Personal Contribution');
    });

})

test(fundName()+"Personal Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Personal Contribution", async () => {
        await memberPage.selectMember(addedMember);
    await memberTransactionPage.memberRolloverIn('Personal Contribution', true);
    });
    
})

test(fundName()+ "Salary Sacrifice Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Salary Sacrifice Contribution", async () => {
        await memberPage.selectMember(addedMember);
        await memberTransactionPage.memberRolloverIn('Salary Sacrifice', true);
    });
    
})

test(fundName()+"Super Guarantee Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Super Guarantee Contribution", async () => {
        await memberPage.selectMember(addedMember);
        await memberTransactionPage.memberRolloverIn('Super Guarantee', true);
    });
    
})

test(fundName()+"Spouse Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Super Guarantee Contribution", async () => {
        await memberPage.selectMember(addedMember);
        await memberTransactionPage.memberRolloverIn('Spouse', true);
    });
    
})

test(fundName()+"Retirement Contribution - Verify if contribution is processed successfully", async ({ navBar, memberPage, memberTransactionPage }) => {

    await test.step("Navigate to Accumulation member page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    });

    let addedMember: string;
    await test.step("Add new Accumulation member", async () => {
        addedMember = await memberPage.addNewMember(false, true);
    });

    await test.step("Add Super Guarantee Contribution", async () => {
        await memberPage.selectMember(addedMember);
        await memberTransactionPage.memberRolloverIn('Retirement', true);
    });
    
})