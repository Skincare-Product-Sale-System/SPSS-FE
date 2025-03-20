"use client";
import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

const ClientReviewsWrapper = dynamic(
  () => import('./ClientReviewsWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="container text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <div className="mt-4">Đang tải đánh giá...</div>
      </div>
    )
  }
);

export default function ReviewsContent() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Đánh giá của tôi</div>
        </div>
      </div>
      <section>
        <Container>
          <ClientReviewsWrapper />
        </Container>
      </section>
    </>
  );
} 