import { aolTest as base } from "../../../src/aol/base_aol_test";
import { allure } from "allure-playwright";
import { FUND } from "../../../constants";
import { fundName } from "../../../src/aol/utils_aol";
import { APIRequestContext } from "@playwright/test";
import { initDltaApiContext } from "../../../src/aol_api/base_dlta_aol";
import data from "../../../data/aol_test_data.json"
import { AccumulationMemberApiHandler } from "../../../src/aol_api/handler/member_creation_accum_handler";
import { ShellAccountCreationApiHandler } from "../../../src/aol_api/handler/shell_account_creation_handler";
import { MemberApiHandler } from "../../../src/aol_api/handler/member_api_handler";
import { ShellAccountApiHandler } from "../../../src/aol_api/handler/internal_transfer_in_handler";

export const test = base.extend<{apiRequestContext: APIRequestContext;}>({
    apiRequestContext: async ({ }, use) => {
        await use(await initDltaApiContext());
    },
});

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(120000);
    await navBar.selectProduct();
    await allure.suite("Pension");
    await allure.parentSuite(process.env.PRODUCT!);
});

test(fundName() + "Money gets invested into CASH after roll-in post member creation @pension", async ({ navBar, pensionInvestmentPage, apiRequestContext, globalPage, memberPage, internalTransferPage, accountInfoPage, shellAccountApi, pensionAccountPage, transactionApi }) => {
    try {
        let membersId: string | undefined;

        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await globalPage.captureScreenshot('Accumulation Member Page');
        })

        //when api is set to true, we will use new member creation for testing.
        let memberNo: string;

        if (data.generate_test_data_from_api) {

            // Create New Accumulation Account
            await test.step("Create New Accumulation Account", async () => {
                const memberId = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
                membersId = memberId.createMemberNo;
                await globalPage.captureScreenshot('Accumulation Account Creation');
            });

            //When api is set to false we will Exsisting member for testing.

        } else {

            // Select Existing Accumulation Member
            memberNo = data.members.Pension_Member_Rollin_And_Verify_Cash_Investment;
            await test.step("Select the Exsisting Accumulation Member", async () => {
                await navBar.selectMember(memberNo);
                const linearId = await AccumulationMemberApiHandler.getMemberInfo(shellAccountApi, memberNo!);
                membersId = linearId.id;
                await globalPage.captureScreenshot('Accumulation Member Selection page');
            });

        }

        const getMemberId = () => membersId;
        await test.step("Create Shell Account for same Member", async () => {
            const memberId = getMemberId();
            if (memberId) {
                await pensionAccountPage.createShellAccountExistingMember();
            } else {
                console.log("Member ID is undefined");
            }
        });

        // Validate MAAS Submit Report
        await test.step("Validate MAAS Submit Report", async () => {
            const memberId = getMemberId();
            if (memberId) {
                const MAASReport = await ShellAccountCreationApiHandler.getMemberReport(transactionApi, memberId, 'MATS Submit');
                console.log('MAAS Report:', MAASReport);
            } else {
                console.log("memberId is undefined. Cannot fetch MAAS Submit Report.");
            }
        });

        await test.step("Validate Rollin succes", async () => {
            await pensionInvestmentPage.RolloverInTransaction();
        });

    } catch (error) {
        throw error;
    }
})

test(fundName()+"ABP - Pension draw-down as Proportional @pension", async ({ memberPage, internalTransferPage, accountInfoPage, pensionTransactionPage, apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than proportional
    if (data.generate_test_data_from_api) {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        let linearId: string | undefined;
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            //await memberPage.selectMember(createMemberNo!);
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.createShellAccountExistingMember();
            let memberCreated  = await pensionAccountPage.getMemberId("ABP");
            const memberId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberCreated!)
            linearId = memberId.id;
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.selectABPTab()
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })

        await test.step("commence pension and validate member is active", async () => {
            await pensionTransactionPage.pensionCommence();
            await pensionTransactionPage.memberStatus();
        })
}
else{
    await test.step("Navigate Pension Members list & select the member", async () => {
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_Proportional);
    });
}
    await test.step("Change the dradown order to proportional & validate the pension histoty", async () => {
        await pensionInvestmentPage.DrawdownTransactionsProportional();
    })
})

test(fundName()+"Pension draw-down as Specific order @pension", async ({ memberPage, accountInfoPage, internalTransferPage, navBar, pensionInvestmentPage ,pensionTransactionPage, pensionAccountPage, apiRequestContext}) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than Percentage
    if (data.generate_test_data_from_api) {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        let linearId: string | undefined;
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            //await memberPage.selectMember(createMemberNo!);
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.createShellAccountExistingMember();
            let memberCreated  = await pensionAccountPage.getMemberId("ABP");
            const memberId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberCreated!)
            linearId = memberId.id;
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.selectABPTab()
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })

        await test.step("commence pension and validate member is active", async () => {
            await pensionTransactionPage.pensionCommence();
            await pensionTransactionPage.memberStatus();
        })
}
else{
    await test.step("Navigate Pension Members list & select the member", async () => {
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_Percentage);
    });
}
    await test.step("change the drawdown order to Specific Order & Validate pension history", async () => {
        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();
    });  
})

test(fundName()+"ABP - Pension draw-down as Percentage @pension", async ({ pensionTransactionPage, internalTransferPage, memberPage, accountInfoPage, pensionAccountPage, apiRequestContext, navBar, pensionInvestmentPage }) => {
    //to do: pension account creation as per the pre-requisite - member should have drawdown option set to other than Percentage
    if (data.generate_test_data_from_api) {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        let linearId: string | undefined;
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            //await memberPage.selectMember(createMemberNo!);
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.createShellAccountExistingMember();
            let memberCreated  = await pensionAccountPage.getMemberId("ABP");
            const memberId = await MemberApiHandler.fetchMemberDetails(apiRequestContext, memberCreated!)
            linearId = memberId.id;
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.selectABPTab()
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })

        await test.step("commence pension and validate member is active", async () => {
            await pensionTransactionPage.pensionCommence();
            await pensionTransactionPage.memberStatus();
        })
}
else{
    await test.step("Navigate Pension Members list & select the member", async () => {
        await navBar.navigateToPensionMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_Percentage);
    });
}
    await test.step("change the drawdown order to Percentage & Validate pension history", async () => {
        await pensionInvestmentPage.DrawdownTransactionsPercentage();
    });  
})

test(fundName()+"TTR - Pension draw-down as Proportional @pension", async ({ pensionTransactionPage, internalTransferPage, accountInfoPage, memberPage, apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than proportional
if (data.generate_test_data_from_api) {
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
    })
    
    await test.step("Create Shell Account for same Member", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
        await pensionAccountPage.ttrAccountCreation();
        await pensionAccountPage.getMemberId("TTR");
    })
    await test.step("Select the Accumulation Member", async () => {
        await pensionAccountPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
    })

    await test.step("Navigate to TTR Screen", async () => {
            await pensionAccountPage.selectTTRRetirement();
    })

    await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
        await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
    })

    await test.step("commence pension and validate member is active", async () => {
        await pensionTransactionPage.pensionCommence();
        await pensionTransactionPage.memberStatus();
    })
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_Proportional);
    });
}
    await test.step("Change the dradown order to proportional & validate the pension histoty", async () => {
        await pensionInvestmentPage.DrawdownTransactionsProportional();
    });
    
})

test(fundName()+"TTR - Pension draw-down as Specific order @pension", async ({ pensionTransactionPage, accountInfoPage, memberPage, internalTransferPage, apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than Specified Order
    if (data.generate_test_data_from_api) {
        await test.step("Navigate to Accumulation Members page", async () => {
            await navBar.navigateToAccumulationMembersPage();
        })
    
        let createMemberNo: string | undefined;
        
        await test.step("Add new Accumulation Member", async () => {
            const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
            createMemberNo = memberData.createMemberNo;
        })
        
        await test.step("Create Shell Account for same Member", async () => {
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
            await pensionAccountPage.ttrAccountCreation();
            await pensionAccountPage.getMemberId("TTR");
        })
        await test.step("Select the Accumulation Member", async () => {
            await pensionAccountPage.reload();
            await navBar.navigateToAccumulationMembersPage();
            await navBar.selectMember(createMemberNo!);
        })
    
        await test.step("Navigate to ABP Screen", async () => {
                await pensionAccountPage.selectTTRRetirement();
        })
    
        await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
            await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
        })

        await test.step("commence pension and validate member is active", async () => {
            await pensionTransactionPage.pensionCommence();
            await pensionTransactionPage.memberStatus();
        })
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_SpecificOrder);
    });
}
        
    await test.step("change the drawdown order to specified order & validate the pension history", async () => { 
        await pensionInvestmentPage.DrawdownTransactionsSpecificOrder();
    }); 
})

test(fundName()+"TTR - Pension draw-down as Percentage @pension", async ({ pensionTransactionPage, internalTransferPage, memberPage, accountInfoPage, apiRequestContext, pensionAccountPage, navBar, pensionInvestmentPage }) => {
    //to do: TTR account creation as per the pre-requisite - member should have drawdown option set to other than Percentage
if (data.generate_test_data_from_api) {
    await test.step("Navigate to Accumulation Members page", async () => {
        await navBar.navigateToAccumulationMembersPage();
    })

    let createMemberNo: string | undefined;
    
    await test.step("Add new Accumulation Member", async () => {
        const memberData = await memberPage.accumulationMember(navBar, accountInfoPage, apiRequestContext, internalTransferPage);
        createMemberNo = memberData.createMemberNo;
    })
    
    await test.step("Create Shell Account for same Member", async () => {
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
        await pensionAccountPage.ttrAccountCreation();
        await pensionAccountPage.getMemberId("TTR");
    })
    await test.step("Select the Accumulation Member", async () => {
        await pensionAccountPage.reload();
        await navBar.navigateToAccumulationMembersPage();
        await navBar.selectMember(createMemberNo!);
    })

    await test.step("Navigate to TTR Screen", async () => {
            await pensionAccountPage.selectTTRRetirement();
    })

    await test.step("Perform Internal Transfer From Accumulation to ABP ", async () => {
        await internalTransferPage.internalTransferMember('Accumulation', createMemberNo!);
    })

    await test.step("commence pension and validate member is active", async () => {
        await pensionTransactionPage.pensionCommence();
        await pensionTransactionPage.memberStatus();
    })
}
else{
    await test.step("navigate to TTR members list and select the member", async () => {
        await navBar.navigateToTTRMembersPage();
        await navBar.selectMember(data.members.Pension_Drawdown_Change_to_Percentage);
    });
}
    await test.step("change the drawdown order to Percentage & Validate pension history", async () => {
        await pensionInvestmentPage.DrawdownTransactionsPercentage();
    });
})

test(fundName()+"-For future drawdown Members should not be able to select any investment options in which the money is NOT currently invested @pension", async ({ navBar, pensionInvestmentPage ,pensionTransactionPage,pensionAccountPage, apiRequestContext }) => {
    try {
        await navBar.navigateToPensionMembersPage();
        //await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        switch (process.env.PRODUCT!) {
            case FUND.VANGUARD:
                //await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
            case FUND.AE:
                //await pensionTransactionPage.process(navBar, pensionAccountPage, apiRequestContext );
        }

        await pensionInvestmentPage.verifyFutureDrawDownOptions();

    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify if user can add investment price for Investment product @pension", async ({ navBar, investmentsAndPricing }) => {
    try {
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.addInvestmentPrice();
    } catch (error) {
        throw error;
    }
})

test(fundName()+"Verify edit/updating an existing investment product @pension", async ({ navBar, investmentsAndPricing }) => {
    try {
        await navBar.accumulationProduct.click();
        await investmentsAndPricing.editInvestment();
    } catch (error) {
        throw error;
    }
})


