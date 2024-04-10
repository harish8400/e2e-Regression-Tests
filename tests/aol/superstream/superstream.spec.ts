import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(600000);
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("MRR is processed with TFN", async () => {
    
    xmlUtility.generateXMLFile("MRRWithTFN.xml");

})

test("MRR is processed with out TFN", async () => {
    
    xmlUtility.generateXMLFile("MRRWithoutTFN.xml");

})