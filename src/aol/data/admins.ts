import adminsFile from './admins.json'

interface Admin {
    username: string,
    password: string
}

export class Admins {
    private static readonly admins: Admin[] = adminsFile;

    static getAdminByUsername(username: string): Admin {
        let admin = this.admins.find(admin => admin.username === username);
        if (admin === undefined) {
            throw new TypeError(`Admin with username '${username}' not found`);
        }
        return admin
    }
}