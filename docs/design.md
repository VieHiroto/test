# 設計

## 構成
- `src/lib/taskParser.ts`: ルールベース解析
- `src/lib/taskClassifier.ts`: 分類/緊急度/calendarNeeded 判定
- `src/lib/scheduleProposal.ts`: 納期逆算の予定提案
- `src/lib/ics.ts`: ICS文字列生成
- `src/app/page.tsx`: 単一ページUI
- `src/app/api/organize/route.ts`: JSON API

## 方針
- timezoneはAsia/Tokyoを前提
- 曖昧情報はpendingへ
- 実カレンダー登録は未実装（提案のみ）

## 将来拡張
- OpenAI連携（キー存在時のみ）
- zod validation
- iOS Shortcuts用レスポンス最適化
