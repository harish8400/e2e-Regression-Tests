import tfnFile from './tfn.json'

interface Tfn {
    tfn: string
}

export class TFN {
    private static readonly tfns: Tfn[] = tfnFile;

    static getValidTFN(): Tfn {
        let tfn = this.tfns[0];
        if (tfn === undefined) {
            throw new TypeError(`Error getting TFN`);
        }
        return tfn
    }
}