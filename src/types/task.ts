export type DesiredTiming = "today" | "this_week" | "anytime" | "unknown";
export type TaskCategory = "today" | "this_week" | "anytime" | "pending";
export type Urgency = "low" | "medium" | "high" | "pending";

export interface ParsedTask {
  id: string;
  rawText: string;
  title: string;
  desiredTiming: DesiredTiming;
  hardDeadline: string | null;
  estimatedDurationMinutes: number | null;
  missingInfo: string[];
}

export interface ScheduleProposal {
  title: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  reason: string;
  sourceTaskId: string;
}

export interface OrganizedTask {
  task: ParsedTask;
  category: TaskCategory;
  urgency: Urgency;
  calendarNeeded: boolean;
  reason: string;
  scheduleProposal: ScheduleProposal | null;
}
