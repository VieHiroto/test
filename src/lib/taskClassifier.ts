import { OrganizedTask, ParsedTask, TaskCategory, Urgency } from "@/types/task";
import { createScheduleProposal } from "./scheduleProposal";

const daysUntil = (iso: string, now: Date): number => {
  const diff = new Date(iso).getTime() - now.getTime();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
};

const detectUrgency = (task: ParsedTask, now: Date): Urgency => {
  if (task.missingInfo.length > 0) return "pending";
  if (!task.hardDeadline) return task.desiredTiming === "anytime" ? "low" : "medium";
  const d = daysUntil(task.hardDeadline, now);
  if (d <= 1) return "high";
  if (d <= 7) return "medium";
  return "low";
};

const categoryFromTask = (task: ParsedTask, now: Date): TaskCategory => {
  if (task.missingInfo.length > 0) return "pending";
  if (task.hardDeadline) {
    const d = daysUntil(task.hardDeadline, now);
    if (d <= 1) return "today";
    if (d <= 7) return "this_week";
  }
  if (task.desiredTiming === "today") return "today";
  if (task.desiredTiming === "this_week") return "this_week";
  if (task.desiredTiming === "anytime") return "anytime";
  return "pending";
};

export const organizeTasks = (tasks: ParsedTask[], now = new Date()): OrganizedTask[] =>
  tasks.map((task) => {
    const category = categoryFromTask(task, now);
    const urgency = detectUrgency(task, now);
    const calendarNeeded =
      task.missingInfo.length === 0 &&
      ((task.estimatedDurationMinutes ?? 0) >= 30 ||
        (!!task.hardDeadline && (category === "today" || category === "this_week"))) &&
      (task.estimatedDurationMinutes ?? 30) > 5;
    const scheduleProposal = calendarNeeded ? createScheduleProposal(task) : null;
    return {
      task,
      category,
      urgency,
      calendarNeeded,
      reason: task.missingInfo[0] ?? `${category}に分類（緊急度:${urgency}）`,
      scheduleProposal,
    };
  });
