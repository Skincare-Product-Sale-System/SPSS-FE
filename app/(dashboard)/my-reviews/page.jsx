import dynamic from 'next/dynamic';

export const metadata = {
  title: "Đánh giá của tôi",
  description: "Đánh giá của tôi tại SPSS",
};

const ReviewsContent = dynamic(
  () => import('@/components/myreviews/ReviewsContent'),
  {
    loading: () => (
      <div className="container text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <div className="mt-4">Đang tải đánh giá...</div>
      </div>
    )
  }
);

export default function Page() {
  return <ReviewsContent />;
}
