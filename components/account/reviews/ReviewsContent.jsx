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
    <section className="flat-spacing-11">
      <Container>
        <ClientReviewsWrapper />
      </Container>
    </section>
  );
} 