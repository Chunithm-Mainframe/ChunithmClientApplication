import { ConfigurationSourceType } from "./Product/ReportForm/Layer1/Configurations/ConfigurationSourceType";
import { Environment } from "./Product/ReportForm/Layer1/Environment";
import { ConstDefinition } from "./ConstDefinition";


let constValues: ConstDefinition = null;

function createConstValues(): ConstDefinition {
    return {
        environment: ENVIRONMENT,
        configurationSourceType: CONFIG_SOURCE_TYPE,
        configurationJsonFileId: 'CONFIG_JSON_FILE_ID',
        runtimeConfigurationSourceType: RUNTIME_CONFIG_SOURCE_TYPE,
        runtimeConfigurationJsonFileId: 'RUNTIME_CONFIG_JSON_FILE_ID',
    };
}

export function getConstValues(): ConstDefinition {
    if (!constValues) {
        constValues = createConstValues();
    }
    return constValues;
}
