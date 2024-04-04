import { test } from '@playwright/test';
import { updateFile, copyGeneratedFile, updateXML } from '../superstream/update_file.spec'


test("updating xml file", async () => {
    updateFile();

})