import { ClientProvider } from '@/providers/ClientProvider';
import { Suspense } from 'react';

export default function ClientLayout({ children }) {
  return (
    <ClientProvider>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        {children}
      </Suspense>
    </ClientProvider>
  );
} 