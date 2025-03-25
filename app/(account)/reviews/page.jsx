import dynamic from 'next/dynamic';

export const metadata = {
  title: "My Reviews",
  description: "My Reviews at SPSS",
};

const MyReviewsPage = dynamic(
  () => import('@/pages/MyReviewsPage'),
  {
    loading: () => (
      <div className="container text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <div className="mt-4">Loading reviews...</div>
      </div>
    )
  }
);

export default function Page() {
  return <MyReviewsPage />;
}
