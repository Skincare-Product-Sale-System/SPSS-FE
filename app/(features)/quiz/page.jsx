import QuizPage from "@/pages/QuizPage";
import { Suspense } from "react";

export const metadata = {
  title: "Quiz",
  description: "Quiz",
};

export default function Quiz() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <QuizPage />
    </Suspense>
  );
}
