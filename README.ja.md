# Wiremotion

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md)

**小さな JSON から、README に使える動く模式図 GIF を作成します。**

[プレイグラウンドを開く](https://jeffrog-256k1.github.io/wiremotion/?lang=ja) · [設定リファレンス（英語）](docs/configuration.md) · [サンプル](examples)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/pipeline.png">
  <img src="assets/pipeline.gif" alt="Capture、Transform、Ship をつなぐ配線に沿って信号が動く図" width="1280">
</picture>

[静止画を見る](assets/pipeline.png)

ハーフトーン、精密な配線、流れる信号、ひとつの差し色でワークフローを表現します。JSON を編集して GIF と静止 PNG を保存。処理はブラウザー内で完結し、アップロード・アカウント・API キーは不要です。

## 最初の図を作る

1. プレイグラウンドを開きます。
2. **パイプライン**・**分岐**・**ハブ**を選び、JSON のラベルを編集します。
3. テーマを選び、**GIF を出力**と **PNG を保存**を押します。
4. README コードをコピーし、2つの画像をリポジトリの `assets/` フォルダーに入れます。

JSON が無効な間は最後に有効だったプレビューを表示し、出力を無効にします。GIF は Worker で生成され、キャンセルできます。図の内容は自動保存されません。ページを閉じる前に JSON をダウンロードしてください。言語設定だけをローカルに保存します。

## 5つの言語

画面と README は英語・韓国語・簡体字中国語・日本語・スペイン語に対応しています。上部の言語メニュー、または `?lang=ja` 付きの共有リンクを使えます。指定値は `en`、`ko`、`zh-CN`、`ja`、`es`。言語を切り替えても JSON・テーマ・図は保持されます。ボタン、入力エラー、アクセシビリティ用ラベル、出力状況を翻訳しています。サンプルの内容、図の技術的なキャプション、JSON キー、CLI 出力、詳細設定リファレンスは英語です。図のラベルはシステムフォントが対応する言語で入力できます。

## 3つのテンプレート

| テンプレート                       | 用途                           | 構造                   |
| ---------------------------------- | ------------------------------ | ---------------------- |
| [Pipeline](examples/pipeline.json) | ビルド、リリース、データ処理   | 順番に並ぶ2〜5ノード   |
| [Branch](examples/branch.json)     | 1つの入力、複数の出力          | ルート1個 + 末端2〜4個 |
| [Hub](examples/hub.json)           | ワークスペース、サービス間接続 | 中心1個 + 周辺2〜5個   |

<details>
<summary>分岐とハブのアニメーションを見る</summary>

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/branch.png">
  <img src="assets/branch.gif" alt="記事・動画・デモに分岐する架空のコンテンツフロー" width="1280">
</picture>

[静止画を見る](assets/branch.png)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/hub.png">
  <img src="assets/hub.gif" alt="ノート・ファイル・タスク・人をつなぐライトテーマのハブ" width="1280">
</picture>

[静止画を見る](assets/hub.png)

</details>

## ローカルで実行

**Node.js 22.12 以降**と npm が必要です。Python、FFmpeg、外部フォント、有料サービスは不要です。

```sh
git clone https://github.com/jeffrog-256k1/wiremotion.git
cd wiremotion
npm ci
npm run dev
```

**http://127.0.0.1:4317** を開きます。開発サーバーはループバックのみで待ち受けます。Canvas・Web Workers・OffscreenCanvas 対応ブラウザーが必要で、主に Chromium で検証しています。サイトと素材の初回読み込みにはネットワークを使いますが、図の処理と出力はローカルで行います。

### ファイルから描画

```sh
npx playwright install chromium
npm run render -- examples/pipeline.json --out renders/my-flow
```

アプリをビルドし、一時的なループバックサーバーで描画して `my-flow.gif`、`my-flow.png`、`my-flow.md` を生成します。`--force` を付けない限り既存ファイルは上書きしません。Markdown のパスは出力画像からの相対パスなので、README に移す際は調整してください。Linux でシステム依存関係が必要な場合は `npx playwright install --with-deps chromium` を使います。環境変数 `WIREMOTION_BROWSER_CHANNEL=chrome` でインストール済み Chrome も利用できます。npm パッケージは未公開です。コマンドはクローンしたリポジトリ内で実行してください。

## 入力は JSON だけ

```json
{
  "version": 1,
  "title": "小さなアイデアを届ける。",
  "layout": "pipeline",
  "nodes": [
    {
      "id": "idea",
      "label": "アイデア"
    },
    {
      "id": "ship",
      "label": "公開"
    }
  ],
  "edges": [
    {
      "from": "idea",
      "to": "ship"
    }
  ]
}
```

任意フィールドは `theme`、`accent`、`subtitle`、`duration`、`width`、`seed`、`sequence` です。`sequence` は各ノード ID を1回ずつ含めます。接続数はノード数 - 1。パイプラインは順番に、分岐・ハブは最初のノードと他のノードを接続します。入力上限は 16 KiB、タイトル52文字、副題96文字、ノード名26文字、説明42文字、接続名16文字です。詳細は[設定リファレンス](docs/configuration.md)（英語）を参照してください。

## 対応範囲

- 3つの固定レイアウト、ダーク・ライトテーマ、6桁の16進数の差し色。
- 4秒または6秒のループ、15 fps。出力は 960×540 または 1280×720。
- GIF・PNG・JSON・README コード。画像に JavaScript・ロゴ・必須の透かしはありません。
- 動きを減らす設定ではプレビューを一時停止して開始します。README コードには静止画の代替を含みます。
- 同じ入力・seed・ブラウザー・フォントなら同じフレームを生成します。OS ごとにフォントが異なるため、環境をまたぐピクセル単位の一致は保証しません。
- 長いラベルは縮小し、必要に応じて省略記号を使います。スマートフォンでも読みやすい短いラベルを推奨します。

任意グラフの自動配置、Mermaid 構文、自由描画には対応しません。短い、統一されたスタイルのアニメーションを画像として保存するためのツールです。

## 開発と検証

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

入力制限、接続構造、配置範囲、再現可能なフレーム、GIF のフレーム数と時間、出力、キャンセル、動きの低減、モバイルのはみ出し、多言語を検証します。ローカルアプリから外部リクエストがないことも確認し、架空のサンプルのみを使用します。

プレビューと出力は共通の `src/renderer.ts` を使います。GIF は gifenc、静的ビルドは Vite、ローカル CLI とブラウザーテストは Playwright を使用しています。

[貢献ガイド](CONTRIBUTING.md)と[セキュリティ情報](SECURITY.md)は英語です。小さな JSON サンプルを添えて、不具合や翻訳の改善をご提案ください。

## ライセンス

MIT。[LICENSE](LICENSE) と[第三者ライセンスの告知](THIRD_PARTY_NOTICES.md)をご確認ください。出力画像は個人・商用に利用できます。公開予定の図に非公開情報を入れないでください。

[jeffrog-256k1](https://github.com/jeffrog-256k1) · [leejungjae.app](https://leejungjae.app)
