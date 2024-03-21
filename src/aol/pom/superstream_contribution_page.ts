import { BasePage } from "../../common/pom/base_page";
import SftpClient from 'ssh2-sftp-client';
import { Page } from "playwright";
import * as fs from 'fs';


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

    async checkFileExists(filePath: string): Promise<boolean> {
        try {
          fs.accessSync(filePath, fs.constants.F_OK);
          return true;
        } catch (err) {
          return false;
        }
      }

      async  uploadXMLFile(xmlFilePath: string, remoteFilePath: string, privateKeyPath: string, privateKeyContent: string) {
        const maxAttempts = 3;
        let attempts = 0;
      
        while (attempts < maxAttempts) {
          if (await this.checkFileExists(xmlFilePath)) {
            try {
              await this.performUpload(xmlFilePath, remoteFilePath, privateKeyPath, privateKeyContent);
              console.log('Uploaded file:', remoteFilePath);
              break; // Break the loop if upload is successful
            } catch (error) {
              console.error('Error performing file upload:', error);
            }
          } else {
            console.error(`Unable to find XML file at path: ${xmlFilePath}`);
            break; // Break the loop if file not found
          }
      
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds between attempts
        }
      
        if (attempts === maxAttempts) {
          console.error(`Maximum attempts (${maxAttempts}) reached. Unable to upload XML file.`);
        }
      }
}
