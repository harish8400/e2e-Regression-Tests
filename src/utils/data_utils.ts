import fs from 'fs';
import path from 'path';

export class DataUtils {

    static dataFilesPath = path.join(__dirname, '../../data');

    static getSubstitutedFileContent(filename: string, replacements: Map<string, any>) {
        let content = fs.readFileSync(`${DataUtils.dataFilesPath}/${filename}`, 'utf8');
        for (let [searchVal, replaceVal] of replacements) {
            content = content.replaceAll(`{{${searchVal}}}`, replaceVal)
        }
        return content;
    }

}
