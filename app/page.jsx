"use client";
import { Suspense, lazy } from 'react';
import { useRouterEvents } from './RouterEventsProvider';

// Lazy load HomePage component
const HomePage = lazy(() => import('@/pages/HomePage'));

export default function Home() {
  const { isPageLoading } = useRouterEvents();

  return (
    <>
      {isPageLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        }>
          <HomePage />
        </Suspense>
      )}
    </>
  );
}
