# ローカル環境セットアップ
claspのインストールを済ませてください。  
現在使用しているclaspのバージョンは2.4.1です。  

# 自身の開発環境セットアップ
自身のアカウントでGoogle Apps Scriptのプロジェクトを作成します。  
`.clasp.json`はDataManager/ReportFormディレクトリに置いてください。  

`appsscript.json`をDataManager/ReportForm/srcディレクトリに配置します。  
デフォルトの設定内容は下記です。  
```JSON
{
  "timeZone": "Asia/Tokyo",
  "dependencies": {
    "libraries": [
      {
        "userSymbol": "TwitterWebService",
        "libraryId": "1_kyxjQxkEkFJ9floX3qNaLX009vQhzJ5Lco0voJ-ygH1uqmq6afeMFLj",
        "version": "1"
      }
    ]
  },
  "webapp": {
    "access": "ANYONE_ANONYMOUS",
    "executeAs": "USER_DEPLOYING"
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

`configuration.json` と `runtimeConfiguration.json` をGoogleドライブ上に作成します。  
各種jsonの構成はそれぞれ [ConfigurationSchema.ts](/DataManager/ReportForm/src/Product/ReportForm/Layer1/Configurations/ConfigurationSchema.ts) と [RuntimeConfigurationSchema.ts](/DataManager/ReportForm/src/Product/ReportForm/Layer1/Configurations/RuntimeConfigurationSchema.ts) に基づきます。  

`@const.ts`をDataManager/ReportFrom/srcディレクトリに作成します。  
下記の内容を定義します。
```typescript
import { ConstDefinition } from "./ConstDefinition";
import { ConfigurationSourceType } from "./Product/ReportForm/Layer1/Configurations/ConfigurationSourceType";
import { Environment } from "./Product/ReportForm/Layer1/Environment";

let constValues: ConstDefinition = null;

function createConstValues(): ConstDefinition {
    return {
        environment: Environment.Develop,
        configurationSourceType: ConfigurationSourceType.Json, // Json or ScriptProperties
        configurationJsonFileId: '', // Googleドライブ上にある設定jsonのファイルIDを入力してください
        runtimeConfigurationSourceType: ConfigurationSourceType.Json, // Json or ScriptProperties
        runtimeConfigurationJsonFileId: '', // Googleドライブ上にある設定jsonのファイルIDを入力してください
    };
}

export function getConstValues(): ConstDefinition {
    if (!constValues) {
        constValues = createConstValues();
    }
    return constValues;
}
```

# 共有開発環境への反映
developブランチに変更をマージしてください。  
マージにフックしてactionの"Deploy ReportFrom Develop"が実行され、共有開発環境にデプロイされます。  

# 本番環境への反映
developブランチをmasterブランチにマージしてください。  
マージにフックしてactionの"Deploy ReportFrom Production"が実行され、本番環境にデプロイされます。  