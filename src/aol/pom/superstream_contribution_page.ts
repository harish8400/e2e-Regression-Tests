import { BasePage } from "../../common/pom/base_page";
import SftpClient from 'ssh2-sftp-client';
import { Page } from "playwright";

export class SuperStreamPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async uploadFile(localFilePath: string, remoteFilePath: string, privateKeyPath: string, privateKeyContent: string) {
        const sftp = new SftpClient();
        try {
            console.log('Private Key Content:', privateKeyContent);
            await sftp.connect({
                host: 'superchoice-sftp.dev.tinasuper.com',
                port: 22,
                username: 'saturn-dev-contribution',
                password: 'oghaim8aeNgei1aeho',
                privateKey: Buffer.from(privateKeyContent, 'utf8'), // Convert string to buffer
                passphrase: 'oghaim8aeNgei1aeho'
            });
                        
            // Perform SFTP upload operation
            await sftp.fastPut(localFilePath, remoteFilePath);
            console.log('File uploaded successfully.');
        } catch (err: any) {
            console.error('Error:', err.message);
        } finally {
            await sftp.end();
        }
    }

    async performUpload(localFilePath: string, remoteFilePath: string, privateKeyPath: string, privateKeyContent: string) {
        try {
            await this.uploadFile(localFilePath, remoteFilePath, privateKeyPath, privateKeyContent);
        } catch (error) {
            console.error('Error performing file upload:', error);
        }
    }
}
