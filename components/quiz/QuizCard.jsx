"use client";
import { quizImage } from "@/data/quizData";
import Image from "next/image";

export default function QuizCard({ quiz, onStart,user }) {
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
        <div className="flex flex-col justify-start items-start">
          <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>{quiz?.name}</h3>
          <span className="text-gray-500 text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}></span>
          <button
            onClick={() => {
              if (!user?.skinType) {
                onStart(quiz);
              }
            }}
            className={`rounded-md text-white duration-300 px-4 py-2 transition-colors ${!user?.skinType ? 'hover:bg-blue-700 bg-blue-600 cursor-not-allowed' : 'bg-zinc-400 '}`}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
          {!user?.skinType ? 'Bắt đầu': "Đã làm"} 
          </button>
        </div>
      </div>
    </div>
  );
}
