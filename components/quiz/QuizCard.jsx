"use client";
import { quizImage } from "@/data/quizData";
import Image from "next/image";

export default function QuizCard({ quiz, onStart }) {
  const getImage = () => {
    if (quiz?.name?.includes("Skin")) return quizImage.skinType;
    if (quiz?.name?.includes("Hair")) return quizImage.hairCare;
    if (quiz?.name?.includes("Fragrance")) return quizImage.fragrance;
  };
  return (
    <div className="quiz-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-60">
        <Image
          src={getImage()}
          alt={quiz?.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold mb-2">{quiz?.name}</h3>
          <span className="text-sm text-gray-500"></span>
          <button
            onClick={() => onStart(quiz)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
