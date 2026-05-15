import { differenceInCalendarDays } from "date-fns";

import type { JournalCard } from "@/features/self-care/utils/journaling";

export type JournalArchiveFilter = "all" | "pastWeek" | "yesterday" | "fortnight";

export const JOURNAL_ARCHIVE_FILTERS: readonly {
  label: string;
  value: JournalArchiveFilter;
}[] = [
  { label: "All Seals", value: "all" },
  { label: "Past Week", value: "pastWeek" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Fortnight", value: "fortnight" },
];

const parseJournalDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

export const journalMatchesArchiveFilter = (
  journal: JournalCard,
  filter: JournalArchiveFilter,
  now = new Date()
) => {
  if (filter === "all") return true;

  const journalDate = parseJournalDate(journal.createdAt ?? journal.dateLabel);
  if (!journalDate) return false;

  const dayDiff = differenceInCalendarDays(now, journalDate);
  if (dayDiff < 0) return false;

  switch (filter) {
    case "yesterday":
      return dayDiff === 1;
    case "pastWeek":
      return dayDiff <= 7;
    case "fortnight":
      return dayDiff <= 14;
    default:
      return true;
  }
};

export const filterJournalArchiveEntries = (
  journals: JournalCard[],
  filter: JournalArchiveFilter,
  now = new Date()
) => journals.filter((journal) => journalMatchesArchiveFilter(journal, filter, now));
