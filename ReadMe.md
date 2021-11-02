![](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)

# 概要
CHUNITHMの譜面定数を管理するプロジェクトのリポジトリです。

# 目的
譜面定数の収集フローを出来る限り自動化し、入力の手間や人為的ミスを削減することを主目的としています。

# 方針・思想
特定個人に依存するような環境構築は極力排除することを思想としています。  
これは、開発人員の核となる人員(=サービスのインスタンスを稼働させている人員)が抜けてしまったとしても、他の人員への引継ぎを容易に出来るようにするためです。  
そのため、有料サービスやクレジットカードの登録を必要とするサービスは基本取り入れません。

# 構成
## Core.TS ![](https://img.shields.io/badge/-C%23-239120.svg?logo=csharp&style=flat)
CHUNITHM-NETにアクセスするための各種APIや汎用的なAPIを提供するモジュール群です。  
GASのインスタンスでは処理しづらいため、プレイヤーデータからの譜面定数解析処理などの実装もこちらに含まれています。  

## DataManager ![](https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&logoColor=white&style=flat)  
検証管理ツールの実装が含まれています。  