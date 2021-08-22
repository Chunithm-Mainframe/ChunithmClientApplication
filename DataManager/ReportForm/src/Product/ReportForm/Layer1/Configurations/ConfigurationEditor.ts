import { getConstValues } from "../../../../@const";

export class ConfigurationEditor {
    public static store(): GoogleAppsScript.Properties.Properties {
        const jsonFile = DriveApp.getFileById(getConstValues().configurationJsonFileId);
        const json = jsonFile.getBlob().getDataAsString();
        return PropertiesService.getScriptProperties().setProperty(
            'config',
            JSON.stringify(JSON.parse(json)));
    }
}
