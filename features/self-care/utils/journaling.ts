import { format } from "date-fns";

export type JournalEntryAnswer = {
  answer?: string;
  prompt_text?: string;
  text?: string;
};

export type RawJournalEntry = {
  id?: number | string;
  template_title?: string;
  title?: string;
  description?: string;
  content?: string;
  created_at?: string;
  date?: string;
  category?: string;
  answers?: JournalEntryAnswer[];
  tags?: string[];
};

export type JournalCard = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  tags: string[];
  createdAt?: string;
  questionCount?: number;
};

const FALLBACK_JOURNALS: RawJournalEntry[] = [
  {
    id: 1,
    template_title: "The Morning Light",
    created_at: "2024-10-24T08:00:00Z",
    description:
      "Today I feel a deep sense of gratitude for the soft amber light filtering through the window. It felt like a warm embrace from the universe.",
    tags: ["gratitude", "mindfulness"],
  },
  {
    id: 2,
    template_title: "Midnight Reverie",
    created_at: "2024-10-23T22:15:00Z",
    description:
      "The silence of the sanctuary tonight is profound. I can feel my heart rate synchronizing with the slow pulse of the space.",
    tags: ["reflection", "silence"],
  },
  {
    id: 3,
    template_title: "Fragmented Waters",
    created_at: "2024-10-22T19:40:00Z",
    description:
      "A few scattered thoughts moved across the page today. Not complete, but honest enough to stay.",
    tags: ["release", "stillness"],
  },
  {
    id: 4,
    template_title: "Soft Return",
    created_at: "2024-10-21T07:05:00Z",
    description:
      "I came back to myself gently after a long stretch of noise. The quiet felt earned.",
    tags: ["presence", "calm"],
  },
];

export const normalizeTag = (value: string) =>
  value
    .replace(/^#+/, "")
    .trim()
    .toLowerCase();

export const formatTagLabel = (value: string) =>
  normalizeTag(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const extractHashtags = (text: string) => {
  const matches = text.match(/#([A-Za-z0-9_]+)/g) || [];
  return matches.map(normalizeTag);
};

export const formatDateLabel = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return format(parsed, "MMM dd").toUpperCase();
};

export const deriveDescription = (item: RawJournalEntry) => {
  const answers = Array.isArray(item.answers) ? item.answers : [];
  const answerText = answers
    .map((answer) => answer.answer ?? answer.text ?? "")
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    item.description?.trim() ||
    item.content?.trim() ||
    answerText ||
    "A quiet note waiting for the rest of its breath."
  );
};

export const deriveTags = (
  item: RawJournalEntry,
  title: string,
  description: string
) => {
  const explicitTags = Array.isArray(item.tags) ? item.tags : [];
  const answerFragments = Array.isArray(item.answers)
    ? item.answers
        .map(
          (answer) =>
            `${answer.prompt_text ?? ""} ${answer.answer ?? answer.text ?? ""}`
        )
        .join(" ")
    : "";

  const textSource = [title, description, item.category ?? "", answerFragments].join(
    " "
  );
  const extracted = extractHashtags(textSource);
  const normalizedExplicit = explicitTags.map(normalizeTag);
  const fallback = item.category ? [normalizeTag(item.category)] : [];

  const unique = Array.from(
    new Set([...extracted, ...normalizedExplicit, ...fallback].filter(Boolean))
  );

  return unique.length ? unique : ["reflection"];
};

export const mapJournalEntry = (
  item: RawJournalEntry,
  index: number
): JournalCard => {
  const title =
    item.template_title?.trim() || item.title?.trim() || "Untitled Entry";
  const description = deriveDescription(item);
  const tags = deriveTags(item, title, description);
  const dateLabel = formatDateLabel(item.created_at ?? item.date);
  const createdAt = item.created_at ?? item.date ?? "";
  const questionCount = Array.isArray(item.answers) ? item.answers.length : 0;

  return {
    id: String(item.id ?? `${title}-${index}`),
    title,
    description,
    dateLabel,
    tags,
    createdAt,
    questionCount,
  };
};

export const fallbackCardData = FALLBACK_JOURNALS.map(mapJournalEntry);
