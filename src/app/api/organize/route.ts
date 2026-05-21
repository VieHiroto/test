import { NextRequest, NextResponse } from "next/server";
import { parseTasks } from "@/lib/taskParser";
import { organizeTasks } from "@/lib/taskClassifier";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text: string = typeof body?.tasksText === "string" ? body.tasksText : "";
  const parsed = parseTasks(text);
  const organized = organizeTasks(parsed);
  return NextResponse.json({ parsed, organized, strategy: "rule-based-mvp" });
}
