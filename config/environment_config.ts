import configFile from './env.config.json';

interface ConfigContent {
    [key: string]: {
        name: string,
        adviserOnlineURL: string,
        aolURL: string,
        dltaApiURL: string,
        molHfmURL: string,
        molHfmApiURL: string,
        molVgApiURL: string,
        molHfmMolApiVersion?: string
        molVgURL: string,
        molVgMolApiVersion?: string
    };
}

let configContent: ConfigContent = configFile

let environment = process.env.ENVIRONMENT || "uat";

if (!(environment in configContent)) {
    throw new Error(`'${environment}' environment not defined in env.config.json`);
}

console.log(`Running in '${environment}' environment`)

export const ENVIRONMENT_CONFIG = configContent[environment];
