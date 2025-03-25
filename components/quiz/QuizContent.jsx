"use client";
import { useEffect, useState } from "react";
import QuizCard from "@/components/quiz/QuizCard";
import QuizModal from "@/components/quiz/QuizModal";
import QuizHeader from "@/components/quiz/QuizHeader";
import QuizList from "@/components/quiz/QuizList";
import request from "@/utils/axios";
import { Box } from "@mui/material";
import useAuthStore from "@/context/authStore";

export default function QuizContent() {
  const { Id, Role, Email } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [user, setUser] = useState(null);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleCloseQuiz = () => {
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
    <>
      <QuizHeader />
      
      <Box 
        sx={{ 
          maxWidth: '1200px',
          mx: 'auto',
          px: 4,
          py: 8,
          fontFamily: 'Roboto, sans-serif' 
        }}
      >
        <QuizList 
          quizList={quizList} 
          onStartQuiz={handleStartQuiz} 
          user={user} 
        />

        {selectedQuiz && (
          <QuizModal
            quiz={selectedQuiz}
            onClose={handleCloseQuiz}
          />
        )}
      </Box>
    </>
  );
} 