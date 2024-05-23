import { xmlUtility } from '../../../src/utils/xml_util';
import { aolTest as test } from "../../../src/aol/base_aol_test"
import { allure } from 'allure-playwright';

test.beforeEach(async ({ navBar }) => {
    test.setTimeout(1000 * 60 * 10); // 10 minutes
    await navBar.selectProduct();
    await allure.suite("Employer");
    await allure.parentSuite(process.env.PRODUCT!);
});

test("MRR is processed with TFN", async () => {
    xmlUtility.generateMRRWithTFNXML();
})

test("MRR is processed with out TFN", async () => {
    xmlUtility.generateMRRWithoutTFNXML();
})