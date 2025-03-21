"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/context/authStore';

export default function AdminLayout({ children }) {
  const { isLoggedIn, Role } = useAuthStore();
  const router = useRouter();
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check directly from localStorage for more reliability
    const userRole = localStorage.getItem('userRole');
    console.log("Role from localStorage:", userRole);
    
    setIsStaff(userRole === 'Staff');
    setLoading(false);
    
    // Redirect to home if user is not a staff member
    // Uncomment this when you're ready to implement role-based access control
    /*
    if (userRole !== 'Staff') {
      router.push('/');
    }
    */
  }, [router]);
  
  // Show loading state while checking role
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-b-2 border-primary border-t-2 h-12 rounded-full w-12 animate-spin"></div>
      </div>
    );
  }
  
  // Show admin content (temporarily for everyone, later only for staff)
  return (
    <div>
      {children}
    </div>
  );
} 