import { expect } from "@playwright/test";
import { molHfmAccumTest as test } from "./setup/mol_hfm_test";
import { CONTRIBUTION_TYPE, MOL_TRANSACTION_TYPE } from "../../../constants";
import { ContribtionApiHandler, Contribution } from "../../../src/dlta/api/handlers/contribution_api_handler";
import { Rollin, RollinApiHandler } from "../../../src/dlta/api/handlers/rollin_api_handler";

test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navbar.clickTransactions();
})

test("MOL transactions filter @mol @mol_transactions", async ({ transactionsPage, memberApi, caseApi, memberId }) => {
    //create transactions
    let currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    let oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    let sgAmount = parseFloat((Math.random() * (100 - 10) + 10).toFixed(2)); //random amount between 10 and 100
    let sg: Contribution = {
        type: CONTRIBUTION_TYPE.SUPER_GUARANTEE,
        paymentReference: `e2eTest_${Date.now()}`,
        paymentReceivedDate: oneWeekAgo,
        effectiveDate: oneWeekAgo,
        amount: sgAmount
    }
    await test.step(`Data prep - DLTA add '${JSON.stringify(sg)}' SG cont`, async () => {
        await ContribtionApiHandler.createContribution(memberApi, caseApi, memberId, sg);
    });

    let twoWeeksAgo = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    let rollinAmount = parseFloat((Math.random() * (100 - 10) + 10).toFixed(2)); //random amount between 10 and 100
    let rollin: Rollin = {
        taxed: rollinAmount,
        preserved: rollinAmount,
        transferringClientIdentifier: `e2eTest_${Date.now()}`,
        paymentReference: `e2eTest_${Date.now()}`,
        paymentReceivedDate: twoWeeksAgo,
        effectiveDate: twoWeeksAgo,
        amount: rollinAmount
    }
    await test.step(`Data prep - DLTA add '${JSON.stringify(rollin)}' rollin`, async () => {
        await RollinApiHandler.createRollin(memberApi, caseApi, memberId, rollin);
    });

    //check transactions
    let expectedSgTransaction = {
        date: `${sg.effectiveDate.toLocaleString('en-US', { day: '2-digit' })} ${sg.effectiveDate.toLocaleString('en-US', { month: 'short' })} ${sg.effectiveDate.getFullYear()}`,
        description: "Super Guarantee (Contribution)",
        amount: `$${sg.amount.toFixed(2)}`
    };
    let expectedRollinTransaction = {
        date: `${rollin.effectiveDate.toLocaleString('en-US', { day: '2-digit' })} ${rollin.effectiveDate.toLocaleString('en-US', { month: 'short' })} ${rollin.effectiveDate.getFullYear()}`,
        description: "Roll In (Roll In)",
        amount: `$${rollin.amount.toFixed(2)}`
    }
    let actualTransactions: Array<any>;

    //TODO: resolve duplicated steps
    await test.step(`Check '${JSON.stringify(expectedSgTransaction)}' sg transaction among those displayed`, async () => {
        await transactionsPage.reload();
        actualTransactions = await transactionsPage.getTransactions();
        expect(actualTransactions).toContainEqual(expectedSgTransaction);
    });
    await test.step(`Check '${JSON.stringify(expectedRollinTransaction)}' rollin transaction among those displayed`, async () => {
        expect(actualTransactions).toContainEqual(expectedRollinTransaction);
    });

    let transactionType = MOL_TRANSACTION_TYPE.ROLL_IN;
    await test.step(`Filter transaction list to '${transactionType}'`, async () => {
        await transactionsPage.filterByTransactionType(transactionType);
    });
    await test.step(`Check '${JSON.stringify(expectedSgTransaction)}' sg transaction is not among those displayed`, async () => {
        actualTransactions = await transactionsPage.getTransactions();
        expect(actualTransactions).not.toContainEqual(expectedSgTransaction);
    });
    await test.step(`Check '${JSON.stringify(expectedRollinTransaction)}' rollin transaction among those displayed`, async () => {
        expect(actualTransactions).toContainEqual(expectedRollinTransaction);
    });

    transactionType = MOL_TRANSACTION_TYPE.CONTRIBUTION;
    await test.step(`Filter transaction list to '${transactionType}'`, async () => {
        await transactionsPage.filterByTransactionType(transactionType);
    });
    await test.step(`Check '${JSON.stringify(expectedSgTransaction)}' sg transaction among those displayed`, async () => {
        actualTransactions = await transactionsPage.getTransactions();
        expect(actualTransactions).toContainEqual(expectedSgTransaction);
    });
    await test.step(`Check '${JSON.stringify(expectedRollinTransaction)}' rollin transaction is not among those displayed`, async () => {
        expect(actualTransactions).not.toContainEqual(expectedRollinTransaction);
    });

    transactionType = MOL_TRANSACTION_TYPE.ANY;
    await test.step(`Filter transaction list to '${transactionType}'`, async () => {
        await transactionsPage.filterByTransactionType(transactionType);
    });
    await test.step(`Check '${JSON.stringify(expectedSgTransaction)}' sg transaction among those displayed`, async () => {
        actualTransactions = await transactionsPage.getTransactions();
        expect(actualTransactions).toContainEqual(expectedSgTransaction);
    });
    await test.step(`Check '${JSON.stringify(expectedRollinTransaction)}' rollin transaction among those displayed`, async () => {
        expect(actualTransactions).toContainEqual(expectedRollinTransaction);
    });

})