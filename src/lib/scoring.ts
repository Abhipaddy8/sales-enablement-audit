// Scoring engine — maps quiz answers to 5 dimension scores

import {
  SCORING_DIMENSIONS,
  QUESTION_META,
  quizJson,
  type Dimension,
} from "./quiz-config";

export interface DimensionScore {
  dimension: Dimension;
  score: number; // 1-4
  maxScore: number;
  label: string;
}

export interface ScoreResult {
  dimensions: DimensionScore[];
  totalScore: number;
  maxTotal: number;
  overallLabel: string;
  biggestChallenge: string;
}

function getLabel(score: number): string {
  if (score <= 1.5) return "Needs Attention";
  if (score <= 2.5) return "Developing";
  if (score <= 3.5) return "Established";
  return "Optimized";
}

function getOverallLabel(avgScore: number): string {
  if (avgScore <= 1.5) return "Early Stage";
  if (avgScore <= 2.5) return "Building Foundation";
  if (avgScore <= 3.5) return "Scaling";
  return "Best-in-Class";
}

// Flatten all question elements from pages
const allQuestions = quizJson.pages.flatMap((p) => p.elements);

export function calculateScores(
  answers: Record<string, string>
): ScoreResult {
  const dimensionTotals: Record<
    Dimension,
    { sum: number; count: number }
  > = {} as Record<Dimension, { sum: number; count: number }>;

  for (const dim of SCORING_DIMENSIONS) {
    dimensionTotals[dim] = { sum: 0, count: 0 };
  }

  for (const [questionName, answer] of Object.entries(answers)) {
    const meta = QUESTION_META[questionName];
    if (!meta) continue;
    if (questionName === "biggest_challenge") continue;

    const questionConfig = allQuestions.find(
      (e) => e.name === questionName
    );
    if (!questionConfig) continue;

    const choiceIndex = questionConfig.choices.findIndex(
      (c) => c.value === answer
    );

    if (choiceIndex >= 0 && meta.scores[choiceIndex] !== undefined) {
      dimensionTotals[meta.dimension].sum += meta.scores[choiceIndex];
      dimensionTotals[meta.dimension].count += 1;
    }
  }

  const dimensions: DimensionScore[] = SCORING_DIMENSIONS.map((dim) => {
    const { sum, count } = dimensionTotals[dim];
    const avgScore = count > 0 ? sum / count : 1;
    return {
      dimension: dim,
      score: Math.round(avgScore * 10) / 10,
      maxScore: 4,
      label: getLabel(avgScore),
    };
  });

  const totalScore = dimensions.reduce((acc, d) => acc + d.score, 0);
  const maxTotal = dimensions.length * 4;
  const avgScore = totalScore / dimensions.length;

  return {
    dimensions,
    totalScore: Math.round(totalScore * 10) / 10,
    maxTotal,
    overallLabel: getOverallLabel(avgScore),
    biggestChallenge: answers.biggest_challenge || "unknown",
  };
}
