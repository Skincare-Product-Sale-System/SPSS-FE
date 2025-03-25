import { Suspense } from "react";
import dynamic from "next/dynamic";

const ReviewsContent = dynamic(() => import("@/components/account/reviews/ReviewsContent"), {
  loading: () => (
    <div className="container text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      <div className="mt-4">Đang tải đánh giá...</div>
    </div>
  ),
});

export default function MyReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="container text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      }
    >
      <main className="main">
        <div className="tf-page-title">
            <div className="container-full">
            <div className="heading text-center">Đánh giá của tôi</div>
            </div>
        </div>
        <ReviewsContent />
      </main>
    </Suspense>
  );
} 