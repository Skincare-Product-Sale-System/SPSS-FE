"use client";
import request from "@/utils/axios";
import { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function QuizModal({ quiz, onClose, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < quizData?.quizQuestions?.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
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
      <div 
        className="bg-white p-8 rounded-lg w-full mx-4" 
        style={{ 
          fontFamily: 'Roboto, sans-serif',
          maxWidth: '1000px',  // Tăng width hơn nữa
          maxHeight: '90vh',   // Giới hạn chiều cao tối đa
          overflowY: 'auto',   // Cho phép cuộn nếu nội dung dài
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-2xl font-semibold" 
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              color: '#333'
            }}
          >
            {quizData?.quizSetName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            style={{ fontSize: '1.25rem' }}
          >
            <span className="text-xl icon-close"></span>
          </button>
        </div>

        <div className="mb-8">
          <div 
            className="flex justify-between text-gray-600 items-center mb-3" 
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontSize: '1rem'
            }}
          >
            <span>Câu hỏi {currentQuestion + 1} / {quizData?.quizQuestions?.length}</span>
            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="flex text-blue-600 hover:text-blue-800 items-center"
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
                Quay lại
              </button>
            )}
          </div>
          <h3 
            className="text-xl mb-4" 
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#222'
            }}
          >
            {question?.value}
          </h3>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {question?.quizOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className={`border p-4 rounded-lg text-left w-full duration-300 hover:bg-blue-50 hover:border-blue-500 transition-colors ${
                  answers[currentQuestion] === option.score 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-gray-200'
                }`}
                style={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '1.05rem',
                  lineHeight: 1.4,
                  height: 'auto',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex-1 bg-gray-200 h-3 rounded-full mr-4">
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
          <span 
            className="text-gray-600" 
            style={{ 
              fontFamily: 'Roboto, sans-serif',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
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
