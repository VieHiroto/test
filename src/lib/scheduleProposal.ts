import { ParsedTask, ScheduleProposal } from "@/types/task";

export const createScheduleProposal = (task: ParsedTask): ScheduleProposal | null => {
  if (!task.hardDeadline || !task.estimatedDurationMinutes) return null;
  const deadline = new Date(task.hardDeadline.replace("+09:00", "Z"));
  const end = new Date(deadline);
  const start = new Date(end.getTime() - task.estimatedDurationMinutes * 60000);
  if (start >= end) return null;

  return {
    title: `作業：${task.title}`,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    durationMinutes: task.estimatedDurationMinutes,
    reason: "最終納期から逆算して作業ブロックを提案",
    sourceTaskId: task.id,
  };
};
