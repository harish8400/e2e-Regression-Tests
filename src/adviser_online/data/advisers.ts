import advisersFile from './advisers.json'

interface Adviser {
    username: string,
    password: string
}

export class Advisers {
    private static readonly advisers: Adviser[] = advisersFile;

    static getAdviserByUsername(username: string): Adviser {
        let adviser = this.advisers.find(adviser => adviser.username === username);
        if (adviser === undefined) {
            throw new TypeError(`Adviser with username '${username}' not found`);
        }
        return adviser
    }
}