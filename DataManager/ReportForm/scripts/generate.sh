#!/bin/bash
cd $(dirname ${BASH_SOURCE:-$0})
source $1

ENVIRONMENT=${ENVIRONMENT,,}
if [ "${ENVIRONMENT}" = "release" ]; then
    ENVIRONMENT=Environment.Release
else
    ENVIRONMENT=Environment.Develop
fi

CONFIG_SOURCE_TYPE=${CONFIG_SOURCE_TYPE,,}
if [ "${CONFIG_SOURCE_TYPE}" = "prop" ]; then
    CONFIG_SOURCE_TYPE=ConfigurationSourceType.ScriptProperties
else
    CONFIG_SOURCE_TYPE=ConfigurationSourceType.Json
fi

RUNTIME_CONFIG_SOURCE_TYPE=${RUNTIME_CONFIG_SOURCE_TYPE,,}
if [ "${RUNTIME_CONFIG_SOURCE_TYPE}" = "prop" ]; then
    RUNTIME_CONFIG_SOURCE_TYPE=ConfigurationSourceType.ScriptProperties
else
    RUNTIME_CONFIG_SOURCE_TYPE=ConfigurationSourceType.Json
fi

echo "SCRIPT_ID: ${SCRIPT_ID}"
echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "CONFIG_SOURCE_TYPE: ${CONFIG_SOURCE_TYPE}"
echo "CONFIG_JSON_FILE_ID: ${CONFIG_JSON_FILE_ID}"
echo "RUNTIME_CONFIG_SOURCE_TYPE: ${RUNTIME_CONFIG_SOURCE_TYPE}"
echo "RUNTIME_CONFIG_JSON_FILE_ID: ${RUNTIME_CONFIG_JSON_FILE_ID}"

cp ./template.appsscript.json ./appsscript.json

cp ./template.clasp.json ./.clasp.json
sed -i "s/SCRIPT_ID/${SCRIPT_ID}/" ./.clasp.json

cp ./template.const.ts ./@const.ts
sed -i "s/ENVIRONMENT/${ENVIRONMENT}/" ./@const.ts
sed -i "s/RUNTIME_CONFIG_SOURCE_TYPE/${RUNTIME_CONFIG_SOURCE_TYPE}/" ./@const.ts
sed -i "s/RUNTIME_CONFIG_JSON_FILE_ID/${RUNTIME_CONFIG_JSON_FILE_ID}/" ./@const.ts
sed -i "s/CONFIG_SOURCE_TYPE/${CONFIG_SOURCE_TYPE}/" ./@const.ts
sed -i "s/CONFIG_JSON_FILE_ID/${CONFIG_JSON_FILE_ID}/" ./@const.ts

mv ./appsscript.json ../src/
mv ./.clasp.json ../
mv ./@const.ts ../src/