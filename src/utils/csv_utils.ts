import * as csv from "fast-csv";
import { Page } from '@playwright/test'; 
import * as fs from 'fs'; 

export class csv_utils {
    page: Page; 

    constructor(page: Page) {
        this.page = page;
    }

    // Read CSV file and return its content
    static async readcsv(filePath: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const dataarray: any[] = [];
            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: false }))
                .on('error', error => reject(error))
                .on('data', row => dataarray.push(row))
                .on('end', () => resolve(dataarray));
        });
    }


     // Write data to CSV file
     static async writecsv(filePath: string, data: any[]): Promise<void> {
        return new Promise((resolve, reject) => {
            csv.writeToPath(filePath, data, { headers: false })
                .on('error', (error: any) => reject(error))
                .on('finish', () => resolve());
        });
    }


     // Edit the CSV file
     static async editAndSaveCSV(filePath: string, valueDate: string, postDate: string,statementDate:string): Promise<void> {
        try {
            // Read the CSV file
            const data = await csv_utils.readcsv(filePath);
    
            // Find the header row to determine the index of "Value Date" and "Post Date"
            const headerRow = data[0];
            const statementDateIndex = headerRow.indexOf('Statement Date');
            const valueDateIndex = headerRow.indexOf('Value Date');
            const postDateIndex = headerRow.indexOf('Post Date');
    
            // Update "Value Date" and "Post Date" values
            for (let i = 1; i < data.length; i++) { // Start from index 1 to skip header row
                data[i][statementDateIndex] = statementDate;
                data[i][valueDateIndex] = valueDate;
                data[i][postDateIndex] = postDate;
            }
    
            // Write the modified data back to the CSV file
            await csv_utils.writecsv(filePath, data);
        } catch (error) {
            console.error("Error editing and saving CSV file:", error);
        }
    }
    

    
}
