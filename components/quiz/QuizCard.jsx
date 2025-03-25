"use client";
import { quizImage } from "@/data/quizData";
import Image from "next/image";
import useAuthStore from "@/context/authStore";
import { openLoginModal } from "@/utils/openLoginModal";

export default function QuizCard({ quiz, onStart, user }) {
  const { isLoggedIn } = useAuthStore();
  
  const getImage = () => {
    return quizImage.skinType1;
  };
  
  const handleQuizStart = () => {
    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, hiển thị login modal
      openLoginModal();
    } else if (!user?.skinType) {
      // Nếu đã đăng nhập và chưa làm bài trắc nghiệm
      onStart(quiz);
    }
    // Nếu đã đăng nhập và đã làm bài trắc nghiệm thì không làm gì
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
            onClick={handleQuizStart}
            className={`rounded-md text-white duration-300 px-4 py-2 transition-colors ${
              isLoggedIn && user?.skinType 
                ? 'bg-zinc-400' 
                : 'hover:bg-blue-700 bg-blue-600'
            }`}
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {!isLoggedIn 
              ? 'Đăng nhập để bắt đầu' 
              : user?.skinType 
                ? 'Đã làm' 
                : 'Bắt đầu'
            }
          </button>
        </div>
      </div>
    </div>
  );
}