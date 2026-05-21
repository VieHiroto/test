# SETUP.md

## 概要
local-firstで動くNext.js MVPです。

## 必要環境
- Node.js LTS (20+ 推奨)
- npm

## 初回セットアップ
```bash
npm install
```

## 環境変数
- `OPENAI_API_KEY` (任意)
- `NEXT_PUBLIC_APP_TIMEZONE` (任意, デフォルト Asia/Tokyo)

`.env.local` を作成して設定してください。

## 開発サーバー起動
```bash
npm run dev
```

## テスト実行
```bash
npm run test
```

## Lint実行
```bash
npm run lint
```

## ビルド確認
```bash
npm run build
```

## 使い方
トップ画面に複数行で入力し、「解析する」を押すとカテゴリと予定案が表示されます。

## iOSショートカット連携予定
`POST /api/organize` をショートカットから呼んでJSON結果を受け取る構成を想定。

## Google Calendar連携予定
MVPでは未実装。将来はconfirm=trueでのみ実登録する設計。

## トラブルシュート
- build失敗時: Node.jsバージョンを確認
- lint失敗時: `npm run lint -- --fix` で修正
