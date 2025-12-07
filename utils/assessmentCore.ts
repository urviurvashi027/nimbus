// assessmentCore.ts

// 0–4 Likert scale used across all tests
export type ScoreOption =
  | "Never"
  | "Rarely"
  | "Sometimes"
  | "Often"
  | "Very Often";

export const SCORE_VALUE: Record<ScoreOption, number> = {
  Never: 0,
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  "Very Often": 4,
};

// Generic question & assessment types
export interface Question {
  id: string; // "1", "q_01", etc.
  category: string; // e.g. "emotional abuse"
  question: string;
  options: ScoreOption[];
}

export interface ResultRow {
  label: string;
  score: number; // numeric percentage
}

// This is the exact format your UI expects
export interface ResultData {
  title: string;
  quote: string;
  image: string; // illustration key
  description: string;
  tips: string[];
  result: { label: string; value: string }[]; // e.g.  "Emotional abuse" / "28%"
  results: ResultRow[]; // e.g. for charts
}

// Band = score range → narrative
export interface ScoreBand {
  id: string;
  min: number; // inclusive
  max: number; // inclusive
  title: string;
  quote: string;
  description: string;
  tips: string[];
  image?: string; // override default image if needed
}

export interface AssessmentDefinition {
  id: string; // "childhood_trauma", "adhd", etc.
  image: string; // default illustration key
  questions: Question[];
  bands: ScoreBand[];
}

// Responses: questionId -> selected option
export type AssessmentResponses = Record<string, ScoreOption>;

const prettyLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Generic engine:
 *  - sums scores
 *  - aggregates per category
 *  - chooses band based on totalScore
 *  - returns ResultData for UI
 */
export function computeAssessmentResult(
  definition: AssessmentDefinition,
  responses: AssessmentResponses
): ResultData {
  const { questions, bands, image: defaultImage } = definition;

  // 1) Aggregate scores
  const categoryScores: Record<string, number> = {};
  let totalScore = 0;
  const maxPerQuestion = 4; // "Very Often"

  questions.forEach((q) => {
    const answer = responses[q.id];
    if (!answer) return; // unanswered

    const score = SCORE_VALUE[answer];
    totalScore += score;
    categoryScores[q.category] = (categoryScores[q.category] || 0) + score;
  });

  const maxTotalScore = questions.length * maxPerQuestion;

  // 2) Percentages by category (relative to total)
  const formattedScores: ResultRow[] = Object.entries(categoryScores).map(
    ([category, score]) => {
      const pct = totalScore > 0 ? (score / totalScore) * 100 : 0;
      return {
        label: prettyLabel(category),
        score: Math.round(pct),
      };
    }
  );

  const simpleResult = formattedScores.map((row) => ({
    label: row.label,
    value: `${row.score}%`,
  }));

  // 3) Choose band based on totalScore
  const band =
    bands.find((b) => totalScore >= b.min && totalScore <= b.max) ||
    bands[bands.length - 1]; // fallback to highest band

  // 4) Build final ResultData
  const result: ResultData = {
    title: band.title,
    quote: band.quote,
    image: band.image ?? defaultImage,
    description: band.description,
    tips: band.tips,
    result: simpleResult,
    results: formattedScores,
  };

  return result;
}
