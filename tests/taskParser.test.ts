import { describe, expect, test } from "vitest";
import { parseTaskLine } from "../src/lib/taskParser";

describe("taskParser", () => {
  const now = new Date("2026-05-21T00:00:00.000Z");

  test("duration and timing", () => {
    const t = parseTaskLine("見積書作成、今週中、最終納期は金曜17時、2時間", now);
    expect(t.title).toBe("見積書作成");
    expect(t.desiredTiming).toBe("this_week");
    expect(t.estimatedDurationMinutes).toBe(120);
    expect(t.hardDeadline).not.toBeNull();
  });

  test("ambiguous goes missing info", () => {
    const t = parseTaskLine("山田さんの件、また確認", now);
    expect(t.missingInfo.length).toBeGreaterThan(0);
  });
});
