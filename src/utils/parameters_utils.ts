import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

export class ParametersUtils {

    static async getQualityParamValue(paramName: string) {
        let client = new SSMClient({
            region: process.env.AWS_REGION
        });

        let input = {
            Name: `/quality/${paramName}`,
            WithDecryption: true
        };
        let command = new GetParameterCommand(input);

        let response = await client.send(command)

        return response.Parameter?.Value
    }

}