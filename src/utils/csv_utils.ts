import * as csv from "@fast-csv/parse";
import { writeToPath } from "fast-csv";


export class csv_utils {


    //test.only("CSV reader", async() =>{
    static async readcsv() {
        let myobject: any = new Promise((resolve) => {

            let dataarray: JSON[] = [];
            csv.parseFile("./Sample CTR_file1.csv", { headers: false })
                .on("data", (data) => {
                    dataarray.push(data);
                })
                .on("end", () => {
                    resolve(dataarray);
                });
        });
        let output = await myobject;
        console.log(output);
    }

    static async writecsv() {
        let myobject: any = new Promise((resolve) => {

            let dataarray: JSON[] = [];
            csv.parseFile("./Sample CTR_file1.csv", { headers: false })
                .on("data", (data) => {
                    dataarray.push(data);
                })
                .on("end", () => {
                    resolve(dataarray);
                });

        }

        );
        let output = await myobject;
        console.log(output);

        const arr: any = Array.from(output);
        await arr.unshift({ EntityType: "123", EntityID: "Test", MasterID: "Hello" });
        await arr.push(
            {
                EntityType: "Hello",
                EntityID: "World",
                ClassID: "Rest"
            });
        writeToPath("./test.csv", arr);
    }
}
