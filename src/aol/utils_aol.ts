import { ENVIRONMENT_CONFIG } from "../../config/environment_config";
import { FUND_IDS, INVESTMENT_OPTIONS } from "../../constants";

export class UtilsAOL {

    static randomSurname(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    static randomName() {
        let names = ['Michelle', 'Alan', 'Glenn', 'Linda', 'Gotham', 'Lille', 'Steve', 'Rose', 'Ramsey', 'Zele', 'Simon', 'Nathan', 'Ashton', 'Kyle', 'Kane', 'Jamie', 'Oliver', 'Jason', 'Floyd', 'Andrew', 'Ricky', 'Gerald'];
        return names[Math.floor(Math.random() * names.length)]
    }

    static generateValidTFN(): number {
        let isValidTFN: boolean = false;
        let validTFN: number = 0;
        while (!isValidTFN) {
            validTFN = UtilsAOL.generateTFN();
            isValidTFN = `${validTFN}`.startsWith('2');
        }
        return validTFN;
    }

    static generateTFN(): number {
        const weights: number[] = [10, 7, 8, 4, 6, 3, 5, 2, 1];
        let tfn: number = Math.floor(100000000 + Math.random() * 900000000);
        let tfnStr: string = `${tfn}`;
        let sum: number = 0;
        let zero: number = 13;
        while (zero) {
            tfn = parseInt(tfnStr, 10) + 1;
            tfnStr = `${tfn}`;
            for (let i = 0; i < tfnStr.length; i++) {
                sum += parseInt(tfnStr.substr(i, 1), 10) * weights[i];
            }
            zero = sum % 11;
            sum = 0;
        }
        return tfn;
    }

    static memberNumber(prefix: string = 'TTR-', length: number = 9): string {
        const characters = '0123456789';
        const charactersLength = characters.length;

        // Generate a candidate member number
        let candidateMemberNumber = prefix;

        for (let i = 0; i < length; i++) {
            candidateMemberNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        // Check if the candidate member number is unique
        while (UtilsAOL.isMemberNumberUsed(candidateMemberNumber)) {
            // Regenerate if not unique
            candidateMemberNumber = prefix;

            for (let i = 0; i < length; i++) {
                candidateMemberNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        }

        return candidateMemberNumber;
    }

    // Helper method to check if a member number is already used
    static isMemberNumberUsed(memberNumber: string): boolean {
        // Assuming there is an array to store used member numbers
        const usedMemberNumbers: string[] = [];
        return usedMemberNumbers.includes(memberNumber);
    }
    static memberIdentityNumber(prefix: string = 'MER-ACC-', length: number = 6): string {
        let result = prefix;
        const characters = '0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static generateDOB(): string {
        const weights: number[] = [1, 4, 5, 1, 2, 1, 2, 1, 2, 1, 2, 1];
        const year: number = Math.floor(Math.random() * (1957 - 1945 + 1)) + 1945;
        const month: number = Math.floor(Math.random() * 12) + 1
        const day: number = Math.floor(Math.random() * 28) + 1;
        let dob: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        let sum: number = 0;
        let zero: number = 13;
        while (zero) {
            dob = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            for (let i = 0; i < dob.length; i++) {
                sum += parseInt(dob.slice(i, i + 1), 10) * weights[i];
            }
            zero = sum % 31;
            sum = 0;
        }
        return dob;
    }

    static generateMoney(): number {
        const min = 10000;
        const max = 1000000;
        const random = Math.random();
        const money = Math.floor(random * (max - min + 1)) + min;
        return money;
    }

    static generateRandomThreeDigitNumber(): number {
        // Generate a random number between 100 and 999 inclusive
        return Math.floor(Math.random() * 900) + 100;
    }

}

export function fundName() {
    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
    return product;
}

export function fundDetails(product: string) {

    let productId, investmentId;

    switch (product) {
        case 'HESTA for Mercy':
            productId = FUND_IDS.MERCY.PRODUCT_ID.RETIREMENT;
            investmentId = INVESTMENT_OPTIONS.MERCY.RETIREMENT.AUSTRALIAN_SHARES.ID;
            break;
        case 'Vanguard Super':
            productId = FUND_IDS.VANGUARD.PRODUCT_ID.RETIREMENT;
            investmentId = INVESTMENT_OPTIONS.VANGUARD.RETIREMENT.AUSTRALIAN_SHARES.ID;
            break;
        case 'Australian Ethical Super':
            productId = FUND_IDS.AE.PRODUCT_ID.RETIREMENT;
            investmentId = INVESTMENT_OPTIONS.AE.RETIREMENT.AUSTRALIAN_SHARES.ID;
            break;
        default:
            throw new Error(`Unsupported product: ${product}`);
    }

    return { productId, investmentId };

}


