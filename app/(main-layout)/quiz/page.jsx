import Quiz from "./_partials/Quiz";
import Overlay from "@/components/common/Overlay";
import { Suspense } from "react";

export const metadata = {
  title: "Quiz",
  description: "Quiz",
};

export default function QuizPage() {
  return (
    <>
      <div
        className="tf-page-title"
        style={{
          position: "relative",
        }}
      >
        <Overlay />
        <div className="container-full">
          <div className="row">
            <div
              className="col-12"
              style={{
                zIndex: 3,
                color: "white",
              }}
            >
              <div className="text-center heading" style={{}}>
                Trắc nghiệm loại da
              </div>
              <p className="text-2 text-center mt_5">
                Làm các bài trắc nghiệm để khám phá sản phẩm làm đẹp phù hợp với bạn
              </p>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
        <Quiz />
      </Suspense>
    </>
  );
}
