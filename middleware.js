import { NextResponse } from 'next/server';

// This middleware can be used to add metadata to the response
// for routes that need special handling with useSearchParams
export function middleware(request) {
  // The only purpose of this middleware is to ensure optimized
  // handling of routes with dynamic parameters
  const response = NextResponse.next();
  
  // Add routing constraints to help Next.js optimize dynamic routes
  response.headers.set('x-next-cache-tags', 'dynamic-route');
  
  return response;
}

// Match all routes that need special handling for useSearchParams
export const config = {
  matcher: ['/quiz/:path*', '/products/:path*', '/search/:path*', '/shop/:path*'],
}; 