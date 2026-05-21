import { ScheduleProposal } from "@/types/task";

const formatICSDate = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, "").replace(".000", "");

export const proposalToICS = (proposal: ScheduleProposal): string => {
  const uid = `${proposal.sourceTaskId}@morning-task-organizer`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//morning-task-organizer//JA",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
    `DTSTART:${formatICSDate(proposal.startDateTime)}`,
    `DTEND:${formatICSDate(proposal.endDateTime)}`,
    `SUMMARY:${proposal.title}`,
    `DESCRIPTION:${proposal.reason}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};
