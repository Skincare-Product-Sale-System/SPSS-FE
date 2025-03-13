"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import request from "@/utlis/axios";
import { ProductCard } from "../shopCards/ProductCard";

export default function QuizResult({ quiz, answers, onClose }) {
  const [quizResult, setQuizResult] = useState(null);
  const [quizRecommendations, setQuizRecommendations] = useState([]);

  useEffect(() => {
    request
      .get(
        `/quiz-results/by-point-and-set?score=${answers.reduce(
          (a, b) => a + b,
          0
        )}&quizSetId=${quiz.id}`
      )
      .then(({ data }) => {
        setQuizResult(data.data);
      });
  }, [quiz, answers]);

  useEffect(() => {
    if (quizResult?.skinTypeId) {
      request
        .get(
          `/products-for-skin-type/${quizResult?.skinTypeId}?pageNumber=1&pageSize=100`
        )
        .then(({ data }) => {
          setQuizRecommendations(data.data.items[0]);
        });
    }
  }, [quizResult]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[900]">
      <div className="border border-black bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-600">
            {quiz.name} Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="icon-close text-xl"></span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="icon-check text-3xl text-blue-600"></span>
          </div>
          <h3 className="text-xl font-bold mb-2">{quizResult?.name}</h3>
          <p className="text-gray-600">Your skin: {quizResult?.description}</p>
          <p className="text-gray-600">Routine: {quizResult?.routine}</p>
        </div>

        {quizRecommendations?.products?.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold mb-4 text-base">Recommendations:</h4>
            <div className="grid grid-cols-3 gap-3">
              {quizRecommendations?.products?.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
              {/* <li key={index} className="flex items-start">
                  <span className="icon-tick text-blue-600 mr-2 mt-1">
                    {product?.name}1
                  </span>
                  <span>{product?.name}</span>
                </li> */}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
