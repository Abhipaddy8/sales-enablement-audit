// Sales Enablement Audit — Quiz Questions (SurveyJS JSON)
// 10 MCQs mapping to 5 scoring dimensions

export const SCORING_DIMENSIONS = [
  "Enablement Strategy",
  "Coaching & Development",
  "Knowledge & Content Delivery",
  "Onboarding & Everboarding",
  "AI Readiness for Enablement",
] as const;

export type Dimension = (typeof SCORING_DIMENSIONS)[number];

// Each answer choice has a score (1-4) and maps to a dimension
export interface QuestionMeta {
  dimension: Dimension;
  scores: number[]; // score for each choice index (0-based)
}

export const QUESTION_META: Record<string, QuestionMeta> = {
  team_size: {
    dimension: "Enablement Strategy",
    scores: [1, 2, 3, 4], // context only, won't affect score heavily
  },
  enablement_function: {
    dimension: "Enablement Strategy",
    scores: [1, 2, 3, 4],
  },
  enablement_strategy: {
    dimension: "Enablement Strategy",
    scores: [1, 2, 3, 4],
  },
  content_delivery: {
    dimension: "Knowledge & Content Delivery",
    scores: [1, 2, 3, 4],
  },
  coaching_cadence: {
    dimension: "Coaching & Development",
    scores: [1, 2, 3, 4],
  },
  coaching_quality: {
    dimension: "Coaching & Development",
    scores: [1, 2, 3, 4],
  },
  onboarding: {
    dimension: "Onboarding & Everboarding",
    scores: [1, 2, 3, 4],
  },
  measuring_impact: {
    dimension: "Enablement Strategy",
    scores: [1, 2, 3, 4],
  },
  ai_in_enablement: {
    dimension: "AI Readiness for Enablement",
    scores: [1, 2, 3, 4],
  },
  biggest_challenge: {
    dimension: "Enablement Strategy",
    scores: [2, 2, 2, 2, 2], // all equal — used for report personalization, not scoring
  },
};

export const quizJson = {
  title: "Sales Enablement Audit",
  description:
    "Answer 10 quick questions to get your personalized enablement scorecard.",
  showTitle: false,
  showDescription: false,
  showProgressBar: "top",
  progressBarType: "questions",
  showNavigationButtons: false,
  questionsOnPageMode: "questionPerPage" as const,
  showQuestionNumbers: "off",
  firstPageIsStarted: false,
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "team_size",
          title: "How large is your customer-facing team?",
          isRequired: true,
          choices: [
            { value: "1-10", text: "1–10 reps" },
            { value: "11-50", text: "11–50 reps" },
            { value: "51-200", text: "51–200 reps" },
            { value: "200+", text: "200+ reps" },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "enablement_function",
          title:
            "Do you have a dedicated sales enablement person or team?",
          isRequired: true,
          choices: [
            {
              value: "none",
              text: "No — managers handle it on the side",
            },
            {
              value: "part_time",
              text: "One person wears the enablement hat (among other roles)",
            },
            {
              value: "dedicated",
              text: "Dedicated enablement person",
            },
            {
              value: "team",
              text: "Full enablement team with defined programs",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "enablement_strategy",
          title: "How would you describe your enablement approach?",
          isRequired: true,
          choices: [
            {
              value: "reactive",
              text: "Reactive — we build content when someone asks for it",
            },
            {
              value: "fragmented",
              text: "We have training and content but no unified strategy",
            },
            {
              value: "documented",
              text: "Documented enablement strategy tied to the buyer journey",
            },
            {
              value: "integrated",
              text: "Fully integrated system — content, training, coaching, and data aligned",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "content_delivery",
          title:
            "How do reps access the content they need (playbooks, battle cards, case studies)?",
          isRequired: true,
          choices: [
            {
              value: "scattered",
              text: "Shared drives / Slack / email — they dig for it",
            },
            {
              value: "central_messy",
              text: "Central library (Google Drive, SharePoint) but hard to navigate",
            },
            {
              value: "platform",
              text: "Enablement platform (Highspot, Seismic, Showpad, etc.)",
            },
            {
              value: "contextual",
              text: "Content surfaces automatically based on deal stage or persona",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "coaching_cadence",
          title:
            "How often do managers coach reps on skills and deal execution?",
          isRequired: true,
          choices: [
            {
              value: "rarely",
              text: "Rarely — too busy firefighting",
            },
            {
              value: "reactive",
              text: "When deals go sideways (reactive)",
            },
            {
              value: "regular",
              text: "Regular 1:1s with some deal reviews",
            },
            {
              value: "structured",
              text: "Structured coaching — call reviews, skill assessments, deal inspections weekly",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "coaching_quality",
          title: "What do your coaching sessions actually look like?",
          isRequired: true,
          choices: [
            {
              value: "pipeline_review",
              text: "Pipeline review disguised as coaching (\"Where's the deal at?\")",
            },
            {
              value: "gut_feel",
              text: "Managers give advice based on gut feel and experience",
            },
            {
              value: "call_based",
              text: "Coaching tied to recorded calls with specific skill feedback",
            },
            {
              value: "data_driven",
              text: "Data-driven — scored calls, competency frameworks, development plans per rep",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "onboarding",
          title: "How do you ramp new sales hires?",
          isRequired: true,
          choices: [
            {
              value: "shadow",
              text: "Shadow a top rep and figure it out",
            },
            {
              value: "orientation",
              text: "Structured first-week orientation, then on their own",
            },
            {
              value: "program",
              text: "30/60/90 day program with milestones and certification",
            },
            {
              value: "everboarding",
              text: "Continuous \"everboarding\" — onboarding extends into ongoing skill development",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "measuring_impact",
          title:
            "How do you know if your enablement efforts are working?",
          isRequired: true,
          choices: [
            {
              value: "dont_measure",
              text: "We don't really measure it",
            },
            {
              value: "anecdotal",
              text: "Anecdotal feedback from reps and managers",
            },
            {
              value: "usage_tracking",
              text: "We track content usage and training completion",
            },
            {
              value: "revenue_connected",
              text: "We connect enablement activity to revenue outcomes (win rates, ramp time, deal velocity)",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "ai_in_enablement",
          title:
            "Where are you with AI in your enablement and coaching process?",
          isRequired: true,
          choices: [
            {
              value: "not_started",
              text: "Haven't started — not sure where AI fits",
            },
            {
              value: "exploring",
              text: "Aware of the possibilities but no tools in place",
            },
            {
              value: "some_tools",
              text: "Using some AI (call transcription, content recommendations, etc.)",
            },
            {
              value: "embedded",
              text: "AI powers our coaching insights, content surfacing, and readiness scoring",
            },
          ],
        },
      ],
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "biggest_challenge",
          title: "What's your #1 enablement challenge right now?",
          isRequired: true,
          choices: [
            {
              value: "adoption",
              text: "Reps aren't using the content and training we create",
            },
            {
              value: "ramp_time",
              text: "New hires take too long to become productive",
            },
            {
              value: "coaching_gap",
              text: "Managers don't coach effectively (or at all)",
            },
            {
              value: "proving_impact",
              text: "We can't prove enablement's impact on revenue",
            },
            {
              value: "scattered_knowledge",
              text: "Our knowledge and content is scattered across too many places",
            },
          ],
        },
      ],
    },
  ],
};
