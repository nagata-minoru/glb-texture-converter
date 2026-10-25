# GLBテクスチャコンバーター

このプロジェクトは、GLBファイルのテクスチャを変換・リサイズするためのツールです。TypeScriptとNode.jsを使用して実装されています。

## 特徴

- GLBファイルのテクスチャ画像をリサイズ
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

1. TypeScriptコードをトランスパイルします。

    ```bash
    npm run dev
    ```

2. 以下のコマンドを実行して、入力ファイル、出力ファイル、および縮尺比率を指定してテクスチャを変換・リサイズします。

    ```bash
    node dist/main.js <inputFile> <outputFile> <scaleRatio>
    ```

    例:

    ```bash
    node dist/main.js input.glb output.glb 0.1
    ```

3. 処理が完了すると、指定された出力ファイルに変換されたデータが保存されます。

## ファイル構成

- `loader-config.js`: カスタムESMローダーの設定ファイル。
- `loader.mjs`: HTTPSからのモジュールインポートを処理するカスタムローダー。
- `.gitignore`: バージョン管理から除外するファイルやディレクトリ。
- `src/main.ts`: メインスクリプト。GLBファイルのテクスチャをリサイズして変換します。
- `src/image-gltf-processor.ts`: テクスチャの取り出し・リサイズ・書き戻しと、ファイル保存を行います。
- `vitest.config.ts`: Vitestの設定ファイル。外部のHTTPSモジュールをスタブに差し替えます。
- `test/`: テストコード。`test/stubs/` にはHTTPSモジュール(`GLTF.js`、`GLB.js`)の代替スタブがあります。

## テスト

テストランナーには [Vitest](https://vitest.dev/) を使用しています。

```bash
npm test
```

- `src/` のTypeScriptを直接テストするため、事前に `tsc` でビルドする必要はありません。
- 外部のHTTPSモジュールはスタブに差し替えているため、ネットワークなしで実行できます。
- ウォッチモードで実行する場合は `npx vitest` を使います。
- スタブの `.glb` はJSONのバイト列で代用しているため、実際のGLBのencode/decodeはテストされません。

## スクリプト

- `npm run dev`: TypeScriptコードを監視しながらトランスパイルします。
- `npm run build`: TypeScriptをトランスパイルし、`dist/` のJavaScriptをminifyします。
- `npm start`: カスタムローダーを使用してメインスクリプトを実行します。
- `npm test`: Vitestでテストを1回実行します。

## ライセンス

このプロジェクトはMITライセンスの下で提供されています。詳細はLICENSEファイルを参照してください。
