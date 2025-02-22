import fs from 'fs';
import path from 'path';

export class DataUtils {
    static testsDir = path.resolve(__dirname, '../..'); 
    static dataFilesPath = path.join(DataUtils.testsDir, 'src/aol/data/superstream_template');

    static getSubstitutedFileContent(filename: string, replacements: Map<string, any>) {
        let content = fs.readFileSync(`${DataUtils.dataFilesPath}/${filename}`, 'utf8');

        for (let [searchVal, replaceVal] of replacements) {
            content = content.replaceAll(`{{${searchVal}}}`, replaceVal)
        }
        return content;
        
    }
}
