import { ParsedTask, DesiredTiming } from "@/types/task";

const TOKYO_OFFSET = "+09:00";

const getDesiredTiming = (text: string): DesiredTiming => {
  if (/今日/.test(text)) return "today";
  if (/明日|明後日|今週|来週/.test(text)) return "this_week";
  if (/いつでも/.test(text)) return "anytime";
  return "unknown";
};

const parseDurationMinutes = (text: string): number | null => {
  const hourMatch = text.match(/(\d+)\s*時間/);
  const minuteMatch = text.match(/(\d+)\s*分/);
  if (hourMatch) {
    const hour = Number(hourMatch[1]);
    const mins = minuteMatch ? Number(minuteMatch[1]) : 0;
    return hour * 60 + mins;
  }
  if (minuteMatch) return Number(minuteMatch[1]);
  return null;
};

const parseRelativeDeadline = (text: string, now: Date): string | null => {
  const base = new Date(now);
  const withTime = (d: Date, hh = 17, mm = 0) => {
    const x = new Date(d);
    x.setHours(hh, mm, 0, 0);
    return x.toISOString().replace(".000Z", TOKYO_OFFSET);
  };

  if (/明日午前中/.test(text)) return withTime(new Date(base.setDate(base.getDate() + 1)), 12, 0);
  if (/明日/.test(text)) return withTime(new Date(base.setDate(base.getDate() + 1)));
  if (/明後日/.test(text)) return withTime(new Date(base.setDate(base.getDate() + 2)));
  if (/今日中|今日/.test(text)) return withTime(now, 23, 0);

  const dayMap: Record<string, number> = { 日: 0, 月: 1, 火: 2, 水: 3, 木: 4, 金: 5, 土: 6 };
  const weekMatch = text.match(/(来週)?([月火水木金土日])曜/);
  if (weekMatch) {
    const target = dayMap[weekMatch[2]];
    const current = now.getDay();
    let delta = (target - current + 7) % 7;
    if (delta === 0) delta = 7;
    if (weekMatch[1]) delta += 7;
    const date = new Date(now);
    date.setDate(now.getDate() + delta);
    const t = text.match(/(\d{1,2})時/);
    return withTime(date, t ? Number(t[1]) : 17, 0);
  }

  if (/今週中/.test(text)) {
    const date = new Date(now);
    const delta = 5 - now.getDay();
    date.setDate(now.getDate() + (delta >= 0 ? delta : 0));
    return withTime(date, 17, 0);
  }
  return null;
};

export const parseTaskLine = (line: string, now = new Date()): ParsedTask => {
  const rawText = line.trim();
  const parts = rawText.split(/[、,]/).map((p) => p.trim()).filter(Boolean);
  const title = parts[0] ?? "";
  const desiredTiming = getDesiredTiming(rawText);

  const deadlineSource = rawText.includes("最終納期")
    ? rawText.slice(rawText.indexOf("最終納期"))
    : rawText;

  const hardDeadline = parseRelativeDeadline(deadlineSource, now);
  const estimatedDurationMinutes = parseDurationMinutes(rawText);

  const missingInfo: string[] = [];
  if (!title || title.length < 3) missingInfo.push("内容または期限が不明確");
  if (!hardDeadline && desiredTiming === "unknown") missingInfo.push("期限情報が不足");

  return {
    id: crypto.randomUUID(),
    rawText,
    title,
    desiredTiming,
    hardDeadline,
    estimatedDurationMinutes,
    missingInfo,
  };
};

export const parseTasks = (input: string, now = new Date()): ParsedTask[] =>
  input
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => parseTaskLine(l, now));
