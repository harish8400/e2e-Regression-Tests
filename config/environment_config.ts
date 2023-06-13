import configFile from './env.config.json';

interface ConfigContent {
    [key: string]: {
        "name": string,
        "adviserOnlineURL": string,
        "molURL": string,
        "aolURL": string
    };
}

let configContent: ConfigContent = configFile

let environment = process.env.ENVIRONMENT || "poc";
//TODO: check if valid environment
console.log(`Running in '${environment}' environment`)

export const ENVIRONMENT_CONFIG = configContent[environment];
