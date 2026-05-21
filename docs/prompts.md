# AIプロンプトとJSONスキーマ

## morning_review_prompt
以下のタスクを整理してください。目的：タスクを「今日やる」「今週やる」「いつでも」「保留」に分類する。最終納期があるものは必ず考慮する。所要時間が書いてあるものはその時間を使う。所要時間がないものは常識的に推定する。カレンダーに入れるべき作業は予定案を作る。不明確なものは勝手に予定化せず、保留にする。現在日時：{{current_datetime}} タイムゾーン：Asia/Tokyo タスク一覧：{{tasks}}

## json_output_prompt
以下のタスクを解析し、JSONのみで出力してください。日本語の相対日付を具体的な日時に変換してください。最終納期がある場合はhardDeadlineに入れてください。希望タイミングはdesiredTimingに入れてください。所要時間は分単位にしてください。カレンダー登録が必要ならcalendarNeededをtrueにしてください。情報不足ならmissingInfoに理由を入れてください。

## JSONスキーマ（MVP）
- ParsedTask: id, rawText, title, desiredTiming, hardDeadline, estimatedDurationMinutes, missingInfo
- OrganizedTask: task, category, urgency, calendarNeeded, reason, scheduleProposal
- ScheduleProposal: title, startDateTime, endDateTime, durationMinutes, reason, sourceTaskId
