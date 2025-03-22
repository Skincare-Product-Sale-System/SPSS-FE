"use client";
import { useEffect, useState } from "react";
import QuizCard from "@/components/quiz/QuizCard";
import QuizModal from "@/components/quiz/QuizModal";
import QuizResult from "@/components/quiz/QuizResult";
import request from "@/utils/axios";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import useAuthStore from "@/context/authStore";

export default function Quiz() {
  const theme = useTheme();
  const { Id, Role, Email } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    console.log("id", Id);
    console.log("role", Role);
    console.log("email", Email);
    request.get(`/accounts`).then(({ data }) => {
      setUser(data.data);
    });
  },[])


  return (
    <Box 
      sx={{ 
        maxWidth: '1200px',
        mx: 'auto',
        px: 4,
        py: 8,
        fontFamily: 'Roboto, sans-serif' 
      }}
    >

      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 8
        }}
      >
        {quizList?.map((quiz) => (
          <QuizCard key={quiz.id + "1"} quiz={quiz} onStart={handleStartQuiz} user={user} />
        ))}
      </Box>

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
    </Box>
  );
}
