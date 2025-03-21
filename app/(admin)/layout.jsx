"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/context/authStore';

export default function AdminLayout({ children }) {
  const { isLoggedIn, Role } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    // Temporarily disabled role check
    // Redirect to home if user is not logged in or is not a staff member
    /*
    if (!isLoggedIn || Role !== 'Staff') {
      router.push('/');
    }
    */
    console.log("Current role:", Role); // Debug log to see what role is detected
  }, [isLoggedIn, Role, router]);
  
  // Temporarily disabled role check
  // If not authenticated as staff, show nothing until redirect happens
  /*
  if (!isLoggedIn || Role !== 'Staff') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-b-2 border-primary border-t-2 h-12 rounded-full w-12 animate-spin"></div>
      </div>
    );
  }
  */
  
  // Show admin content (temporarily for everyone)
  return (
    <div>
      {children}
    </div>
  );
} 