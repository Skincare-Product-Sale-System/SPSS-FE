"use client";
import { Suspense } from 'react';
import { useClient } from '@/providers/ClientProvider';

const DefaultLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export function withClientSide(Component, LoadingComponent = DefaultLoading) {
  return function ClientSideComponent(props) {
    const { isClient, isLoading } = useClient();

    if (isLoading) {
      return <LoadingComponent />;
    }

    if (!isClient) {
      return null;
    }

    return (
      <Suspense fallback={<LoadingComponent />}>
        <Component {...props} />
      </Suspense>
    );
  };
} 