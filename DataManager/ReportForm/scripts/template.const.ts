class ReportFormConstants {
    private static constValues: ConstDefinition = null;

    public static getConstValues(): ConstDefinition {
        if (!this.constValues) {
            this.constValues = {
                environment: ENVIRONMENT,
                configurationSourceType: CONFIG_SOURCE_TYPE,
                configurationJsonFileId: 'CONFIG_JSON_FILE_ID',
                runtimeConfigurationSourceType: RUNTIME_CONFIG_SOURCE_TYPE,
                runtimeConfigurationJsonFileId: 'RUNTIME_CONFIG_JSON_FILE_ID',
            };
        }
        return this.constValues;
    }
}
