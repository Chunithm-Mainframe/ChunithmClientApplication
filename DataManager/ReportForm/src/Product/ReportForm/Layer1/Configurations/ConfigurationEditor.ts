import { ReportFormConstants } from "../../../../@const";

export class ConfigurationEditor {
    public static storeConfig(): GoogleAppsScript.Properties.Properties {
        const jsonFile = DriveApp.getFileById(ReportFormConstants.getConstValues().configurationJsonFileId);
        const json = jsonFile.getBlob().getDataAsString();
        return PropertiesService.getScriptProperties().setProperty(
            'config',
            JSON.stringify(JSON.parse(json)));
    }

    public static storeRuntimeConfig(): GoogleAppsScript.Properties.Properties {
        const jsonFile = DriveApp.getFileById(ReportFormConstants.getConstValues().runtimeConfigurationJsonFileId);
        const json = jsonFile.getBlob().getDataAsString();
        return PropertiesService.getScriptProperties().setProperty(
            'runtime_config',
            JSON.stringify(JSON.parse(json)));
    }
}
