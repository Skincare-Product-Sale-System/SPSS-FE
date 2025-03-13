"use client";
import request from "@/utlis/axios";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[900]">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{quizData?.quizSetName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="icon-close text-xl"></span>
          </button>
        </div>

        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">
            Question {currentQuestion + 1} of {quizData?.quizQuestions?.length}
          </div>
          <h3 className="text-xl mb-4">{question?.value}</h3>

          <div className="space-y-3">
            {question?.quizOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-300"
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-2 bg-gray-200 rounded-full flex-1 mr-4">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestion + 1) / quizData?.quizQuestions?.length) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-500">
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
