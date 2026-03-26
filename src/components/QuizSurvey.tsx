"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { quizJson } from "@/lib/quiz-config";

interface QuizSurveyProps {
  onComplete: (answers: Record<string, string>) => void;
  onQuestionChanged?: (questionName: string, questionIndex: number) => void;
  initialAnswers?: Record<string, string>;
  startFromQuestion?: number;
}

export default function QuizSurvey({
  onComplete,
  onQuestionChanged,
  initialAnswers,
  startFromQuestion,
}: QuizSurveyProps) {
  const surveyRef = useRef<Model | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!surveyRef.current) {
    const survey = new Model(quizJson);

    // Apply saved answers if resuming
    if (initialAnswers) {
      for (const [key, value] of Object.entries(initialAnswers)) {
        survey.setValue(key, value);
      }
    }

    // Jump to the right page if resuming
    if (startFromQuestion && startFromQuestion > 0) {
      survey.currentPageNo = Math.min(
        startFromQuestion,
        survey.pageCount - 1
      );
    }

    surveyRef.current = survey;
  }

  const survey = surveyRef.current;

  // Check if we're on the last page initially
  useEffect(() => {
    if (survey) {
      setIsLastPage(survey.isLastPage);
    }
  }, [survey]);

  const handleComplete = useCallback(
    (sender: Model) => {
      onComplete(sender.data as Record<string, string>);
    },
    [onComplete]
  );

  const handleCurrentPageChanged = useCallback(
    (sender: Model) => {
      setIsLastPage(sender.isLastPage);
      // Fade in on new page
      setFadeClass("opacity-100");
      const page = sender.currentPage;
      if (page && page.elements.length > 0) {
        const questionName = page.elements[0].name;
        onQuestionChanged?.(questionName, sender.currentPageNo);
      }
    },
    [onQuestionChanged]
  );

  const handleValueChanged = useCallback(
    (sender: Model) => {
      // Clear any existing timer
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current);
      }

      // If not last page, auto-advance after 400ms
      if (!sender.isLastPage) {
        autoAdvanceTimer.current = setTimeout(() => {
          // Fade out
          setFadeClass("opacity-0");
          // After fade out, advance
          setTimeout(() => {
            sender.nextPage();
          }, 200);
        }, 400);
      }
    },
    []
  );

  const handleGetResults = useCallback(() => {
    if (survey) {
      survey.completeLastPage();
    }
  }, [survey]);

  survey.onComplete.clear();
  survey.onComplete.add(handleComplete);
  survey.onCurrentPageChanged.clear();
  survey.onCurrentPageChanged.add(handleCurrentPageChanged);
  survey.onValueChanged.clear();
  survey.onValueChanged.add(handleValueChanged);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`transition-opacity duration-200 ease-in-out ${fadeClass}`}
      >
        <Survey model={survey} />
      </div>
      {isLastPage && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleGetResults}
            className="bg-[#0176d3] hover:bg-[#015bb5] text-white font-semibold px-10 py-4 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Get My Results &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
