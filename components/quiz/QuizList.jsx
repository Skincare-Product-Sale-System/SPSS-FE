"use client";
import { Box } from "@mui/material";
import QuizCard from "@/components/quiz/QuizCard";
import { useTheme } from "@mui/material/styles";

export default function QuizList({ quizList, onStartQuiz, user }) {
  const theme = useTheme();
  
  return (
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
        <QuizCard key={quiz.id + "1"} quiz={quiz} onStart={onStartQuiz} user={user} />
      ))}
    </Box>
  );
} 