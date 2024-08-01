# GLBテクスチャコンバーター

このプロジェクトは、GLBファイルのテクスチャを変換・リサイズするためのツールです。TypeScriptとNode.jsを使用して実装されています。

## 特徴

- GLBファイルのテクスチャ画像をリサイズ
- テクスチャの品質とカラースペースを指定可能
- HTTPSからモジュールをインポートするカスタムローダーを使用

## 必要要件

- Node.js
- npm

## インストール

1. リポジトリをクローンします。

    ```bash
    git clone https://github.com/nagata-minoru/glb-texture-converter.git
    cd glb-texture-converter
    ```

2. 必要なパッケージをインストールします。

    ```bash
    npm install
    ```

## 使い方

1. `input.glb`という名前のGLBファイルをプロジェクトのルートディレクトリに配置します。

2. TypeScriptコードをトランスパイルします。

    ```bash
    npm run dev
    ```

3. 別のターミナルで、以下のコマンドを実行して、テクスチャを変換・リサイズします。

    ```bash
    npm start
    ```

4. 処理が完了すると、変換されたGLTFファイルが生成されます。

## ファイル構成

- `loader-config.js`: カスタムESMローダーの設定ファイル。
- `loader.mjs`: HTTPSからのモジュールインポートを処理するカスタムローダー。
- `.gitignore`: バージョン管理から除外するファイルやディレクトリ。
- `src/main.ts`: メインスクリプト。GLBファイルのテクスチャをリサイズして変換します。

## オプション

`src/main.ts`内で以下のオプションを設定できます。

- `imgwidth`: テクスチャ画像の幅。
- `imgquality`: テクスチャ画像の品質。
- `imgsrgb`: カラースペースをsRGBに設定するかどうか。

## スクリプト

- `npm run dev`: TypeScriptコードを監視しながらトランスパイルします。
- `npm start`: カスタムローダーを使用してメインスクリプトを実行します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細はLICENSEファイルを参照してください。
