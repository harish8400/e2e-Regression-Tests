import { ENVIRONMENT_CONFIG } from "../../config/environment_config";

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
}

export function fundName() {
    let product = process.env.PRODUCT || ENVIRONMENT_CONFIG.product;
    return product;
}