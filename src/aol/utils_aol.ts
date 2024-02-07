export enum products{
    'HESTA for Mercy',
    'Vanguard Super',
    'Australian Ethical Superguard'
}


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

    static Product = {
        "HESTA for Mercy": "HESTA for Mercy",
        "Vanguard Super": "Vanguard Super",
        "Australian Ethical Super": "Australian Ethical Super",
      } as const;

}


  
  
  