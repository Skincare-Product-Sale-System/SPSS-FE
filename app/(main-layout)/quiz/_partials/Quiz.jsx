"use client";
import { useEffect, useState } from "react";
import QuizCard from "@/components/quiz/QuizCard";
import QuizModal from "@/components/quiz/QuizModal";
import QuizResult from "@/components/quiz/QuizResult";
import request from "@/utlis/axios";

export default function Quiz() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizList, setQuizList] = useState([]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizResult(null);
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setQuizResult(null);
  };

  const handleCompleteQuiz = (answers) => {
    setQuizResult({ quiz: selectedQuiz, answers });
    setSelectedQuiz(null);
  };

  useEffect(() => {
    request.get("/quiz-sets?pageNumber=1&pageSize=100").then(({ data }) => {
      setQuizList(data.data.items);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Beauty Quiz</h1>
        <p className="text-gray-600 text-lg">
          Take our quizzes to discover your perfect beauty matches
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizList?.map((quiz) => (
          <QuizCard key={quiz.id + "1"} quiz={quiz} onStart={handleStartQuiz} />
        ))}
      </div>

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          onClose={handleCloseQuiz}
          onComplete={handleCompleteQuiz}
        />
      )}

      {quizResult && (
        <QuizResult
          quiz={quizResult.quiz}
          answers={quizResult.answers}
          onClose={handleCloseQuiz}
        />
      )}
    </div>
  );
}
