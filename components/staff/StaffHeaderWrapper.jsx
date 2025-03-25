"use client";
import { useState, useEffect } from 'react';
import Header2 from '@/components/ui/headers/Header';
import { usePathname } from 'next/navigation';

export default function StaffHeaderWrapper() {
  const [isStaff, setIsStaff] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
    
    // Chỉ truy cập localStorage sau khi component đã được mount trong trình duyệt
    if (typeof window !== 'undefined') {
      try {
        const userRole = localStorage.getItem("userRole");
        console.log('Path changed. User role:', userRole);
        
        // Kiểm tra xem userRole có phải là "Staff" không
        setIsStaff(userRole === 'Staff');
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    }
  }, [pathname]);
  
  // Không render gì trong quá trình SSR hoặc nếu người dùng là nhân viên
  if (!mounted) return null;
  
  return isStaff ? null : <Header2 />;
} 