import { describe, expect, test } from "vitest";
import { parseTaskLine } from "../src/lib/taskParser";
import { organizeTasks } from "../src/lib/taskClassifier";

describe("taskClassifier", () => {
  const now = new Date("2026-05-21T00:00:00.000Z");

  test("deadline in week should become this_week", () => {
    const task = parseTaskLine("LP修正、いつでも、最終納期は来週火曜、3時間くらい", now);
    const result = organizeTasks([task], now)[0];
    expect(result.category).toBe("this_week");
    expect(result.calendarNeeded).toBe(true);
  });
});
