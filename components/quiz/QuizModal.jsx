"use client";
import request from "@/utils/axios";
import { useEffect, useState } from "react";

export default function QuizModal({ quiz, onClose, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < quizData?.quizQuestions?.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  useEffect(() => {
    request.get(`/quiz-sets/${quiz.id}/questions`).then(({ data }) => {
      setQuizData(data.data.items[0]);
    });
  }, []);

  const question = quizData?.quizQuestions?.[currentQuestion];

  return (
    <div className="flex bg-black bg-opacity-50 justify-center fixed inset-0 items-center z-[900]">
      <div className="bg-white p-8 rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{quizData?.quizSetName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="text-xl icon-close"></span>
          </button>
        </div>

        <div className="mb-8">
          <div className="text-gray-500 text-sm mb-2">
            Question {currentQuestion + 1} of {quizData?.quizQuestions?.length}
          </div>
          <h3 className="text-xl mb-4">{question?.value}</h3>

          <div className="space-y-3">
            {question?.quizOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="border border-gray-200 p-4 rounded-lg text-left w-full duration-300 hover:bg-blue-50 hover:border-blue-500 transition-colors"
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex-1 bg-gray-200 h-2 rounded-full mr-4">
            <div
              className="bg-blue-600 h-full rounded-full duration-300 transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) / quizData?.quizQuestions?.length) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="text-gray-500 text-sm">
            {Math.round(
              ((currentQuestion + 1) / quizData?.quizQuestions?.length) * 100
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
