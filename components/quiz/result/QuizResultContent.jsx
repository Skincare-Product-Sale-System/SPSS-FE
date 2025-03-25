"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import request from "@/utils/axios";
import { useThemeColors } from "@/context/ThemeContext";
import { Box, Container, Paper } from "@mui/material";
import { keyframes } from '@emotion/react';

import QuizHeader from "@/components/quiz/result/QuizHeader";
import SkinTypeResult from "@/components/quiz/result/SkinTypeResult";
import RoutineSteps from "@/components/quiz/result/RoutineSteps";
import LoadingState from "@/components/quiz/result/LoadingState";
import NotFoundState from "@/components/quiz/result/NotFoundState";

export default function QuizResultContent() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const score = searchParams.get("score");
  
  const mainColor = useThemeColors();
  const [quizResult, setQuizResult] = useState(null);
  const [routineSteps, setRoutineSteps] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm in kết quả
  const handlePrint = () => {
    window.print();
  };

  // Hàm chia sẻ kết quả
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Kết quả ${quizInfo?.name || "Quiz"} - Skincede`,
        text: `Kết quả ${quizInfo?.name || "Quiz"} của tôi: ${quizResult?.name || ""}`,
        url: window.location.href,
      }).catch((error) => console.log('Lỗi khi chia sẻ:', error));
    }
  };

  useEffect(() => {
    if (!quizId || !score) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Lấy thông tin quiz
    request.get(`/quiz-sets/${quizId}`)
      .then(({ data }) => {
        if (data?.data) {
          setQuizInfo(data.data);
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin quiz:", error);
      });
    
    // Lấy kết quả quiz sử dụng API by-point-and-set
    request.get(`/quiz-results/by-point-and-set?score=${score}&quizSetId=${quizId}`)
      .then(({ data }) => {
        if (data?.data) {
          setQuizResult(data.data);
          
          // Sắp xếp các bước theo thứ tự
          if (data.data.routine && Array.isArray(data.data.routine)) {
            const sortedRoutine = [...data.data.routine].sort((a, b) => a.order - b.order);
            setRoutineSteps(sortedRoutine);
          }
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy kết quả quiz:", error);
        setLoading(false);
      });
  }, [quizId, score]);

  if (loading) {
    return <LoadingState />;
  }

  if (!quizResult) {
    return <NotFoundState />;
  }

  return (
    <Container maxWidth="lg" className="py-12">
      <Paper 
        elevation={3} 
        className="bg-white p-6 md:p-8 rounded-lg w-full mx-auto"
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${mainColor.lightGrey}`,
          maxWidth: '1300px',
          position: 'relative',
          overflow: 'hidden',
          '@media print': {
            boxShadow: 'none',
            padding: '0.5cm',
          }
        }}
      >
        <QuizHeader 
          quizInfo={quizInfo} 
          handlePrint={handlePrint} 
          handleShare={handleShare} 
        />

        <SkinTypeResult quizResult={quizResult} />
        
        <RoutineSteps routineSteps={routineSteps} />
      </Paper>
    </Container>
  );
} 