"use client";
import { useQuiz } from '@/context/QuizContext';
import QuizResult from './QuizResult';

export default function QuizResultModal() {
  const { quizState, closeQuizResult } = useQuiz();
  
  if (!quizState.isOpen) return null;
  
  return (
    <QuizResult 
      quiz={quizState.quiz} 
      answers={quizState.answers} 
      onClose={closeQuizResult} 
      savedResult={quizState.result}
      savedRoutineSteps={quizState.routineSteps}
    />
  );
} 