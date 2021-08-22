import { ConfigurationSourceType } from "./Product/ReportForm/Layer1/Configurations/ConfigurationSourceType";
import { Environment } from "./Product/ReportForm/Layer1/Environment";

export interface ConstDefinition {
    environment: Environment;
    configurationSourceType: ConfigurationSourceType;
    configurationJsonFileId: string;
    runtimeConfigurationSourceType: ConfigurationSourceType;
    runtimeConfigurationJsonFileId: string;
}
