"use client";
import request from "@/utils/axios";
import { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useThemeColors } from "@/context/ThemeContext";

export default function QuizModal({ quiz, onClose, onComplete }) {
  const router = useRouter();
  const mainColor = useThemeColors();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < quizData?.quizQuestions?.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Hiển thị animation phân tích
      setAnalyzing(true);
      
      // Tính tổng điểm
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);

      // Bắt đầu animation loading
      const timer = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + 2;
          if (newProgress >= 100) {
            clearInterval(timer);
            
            // Đợi thêm 1 giây sau khi đạt 100% trước khi chuyển trang
            setTimeout(() => {
              // Chuyển hướng đến trang kết quả với quizId và score
              router.push(`/quiz-result?quizId=${quiz.id}&score=${totalScore}`);
              // Đóng modal
              onClose();
            }, 1000);
            
            return 100;
          }
          return newProgress;
        });
      }, 100);
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

  // Animation pulse chậm hơn
  const pulse = keyframes`
    0% {
      transform: scale(0.98);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.02);
      opacity: 1;
    }
    100% {
      transform: scale(0.98);
      opacity: 0.9;
    }
  `;

  // Các thông báo phân tích theo tiến trình
  const getAnalysisMessage = () => {
    if (loadingProgress < 20) {
      return "Đang phân tích câu trả lời của bạn...";
    } else if (loadingProgress < 40) {
      return "Xác định loại da của bạn...";
    } else if (loadingProgress < 60) {
      return "Tìm kiếm sản phẩm phù hợp nhất...";
    } else if (loadingProgress < 80) {
      return "Tạo quy trình chăm sóc da cho bạn...";
    } else {
      return "Sẵn sàng hiển thị kết quả...";
    }
  };

  return (
    <div className="flex bg-black bg-opacity-50 justify-center fixed inset-0 items-center z-[900]">
      {analyzing ? (
        <Paper 
          elevation={3} 
          className="bg-white p-8 rounded-lg w-full max-w-md mx-4 text-center"
          sx={{ 
            borderRadius: 2,
            border: `1px solid ${mainColor.lightGrey}`,
            animation: `${pulse} 2.5s infinite ease-in-out`
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <CircularProgress
                variant="determinate"
                value={loadingProgress}
                size={80}
                thickness={4}
                sx={{ color: mainColor.primary }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleIcon sx={{ 
                  color: mainColor.primary, 
                  fontSize: 40,
                  opacity: loadingProgress >= 100 ? 1 : 0.5,
                  transition: 'opacity 0.3s ease'
                }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: mainColor.text,
                fontWeight: 600,
                fontFamily: 'Playfair Display, serif'
              }}
            >
              Đang chuẩn bị kết quả của bạn...
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: mainColor.darkGrey,
                mb: 3,
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              {getAnalysisMessage()}
            </Typography>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: mainColor.lightGrey,
                borderRadius: 4,
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  width: `${loadingProgress}%`, 
                  height: '100%', 
                  backgroundColor: mainColor.primary,
                  borderRadius: 4,
                  transition: 'width 0.5s ease'
                }}
              />
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: mainColor.darkGrey,
                fontFamily: 'Roboto, sans-serif'
              }}
            >
              {loadingProgress < 100 ? `${loadingProgress}% hoàn thành` : 'Sẵn sàng chuyển trang...'}
            </Typography>
          </Box>
        </Paper>
      ) : (
        <div 
          className="bg-white p-8 rounded-lg w-full mx-4" 
          style={{ 
            fontFamily: 'Roboto, sans-serif',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflowY: 'auto',
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
      )}
    </div>
  );
}