"use client";
import { quizImage } from "@/data/quizData";
import Image from "next/image";

export default function QuizCard({ quiz, onStart }) {
  const getImage = () => {
    return quizImage.skinType1;
  };
  return (
    <div className="bg-white rounded-lg shadow-md duration-300 hover:shadow-lg overflow-hidden quiz-card transition-shadow">
      <div className="h-60 relative">
        <Image
          src={getImage()}
          alt={quiz?.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>{quiz?.name}</h3>
          <span className="text-gray-500 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}></span>
          <button
            onClick={() => onStart(quiz)}
            className="bg-blue-600 rounded-md text-white duration-300 hover:bg-blue-700 px-4 py-2 transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
}
