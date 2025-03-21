"use client";
import { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Tabs, Tab, Paper, 
  AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem,
  CircularProgress
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import useAuthStore from "@/context/authStore";
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import dynamic from 'next/dynamic';
import toast from "react-hot-toast";

// Import the existing components dynamically to prevent SSR issues
const StaffChat = dynamic(() => import('@/components/admin/StaffChat'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div className="border-b-2 border-primary border-t-2 h-16 rounded-full w-16 animate-spin"></div>
    </Box>
  )
});

const BlogManagement = dynamic(() => import('@/components/admin/BlogManagement'), {
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div className="border-b-2 border-primary border-t-2 h-16 rounded-full w-16 animate-spin"></div>
    </Box>
  )
});

export default function StaffHome() {
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useThemeColors();
  const { isLoggedIn, User, logout, setLoggedOut } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Kiểm tra quyền truy cập khi component được mount - cải tiến để chuyển hướng nhanh hơn
  useEffect(() => {
    // Chạy ngay lập tức, không cần setTimeout
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      
      if (userRole !== 'Staff') {
        // Redirect về home ngay lập tức
        console.log('Non-staff access detected, redirecting...');
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;"><p>Access denied. Redirecting...</p></div>';
        window.location.href = '/';
        return;
      }
      
      // Nếu là Staff, cho phép truy cập
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle logout - sửa lại để xóa hoàn toàn thông tin đăng nhập
  const handleLogout = () => {
    // Xóa localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    
    // Gọi hàm logout từ store
    setLoggedOut();
    
    // Force reload đến trang chủ
    window.location.href = '/';
  };
  
  // Render the active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 0:
        return <StaffChat />;
      case 1:
        return <BlogManagement />;
      default:
        return <StaffChat />;
    }
  };
  
  // Tối ưu loading state - dừng ngay khi phát hiện không có quyền
  if (isLoading && !isAuthorized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={50} sx={{ color: theme.primary }} />
        <Typography>Verifying access...</Typography>
      </Box>
    );
  }
  
  // Nếu không có quyền, không render gì cả (sẽ chuyển hướng ở useEffect)
  if (!isAuthorized) {
    return null;
  }
  
  // Chỉ render UI nếu đã xác thực là nhân viên
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: theme.primary }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              component="img" 
              src="/images/logo/logo-icon.png" 
              alt="Skincede" 
              sx={{ 
                height: 40, 
                objectFit: "contain" 
              }}
            />
            <Typography 
              sx={{ 
                paddingTop: "10px",
                color: "#ffffff",
                fontSize: "30px",
                fontWeight: "600",
                fontFamily: "sora, sans-serif"
              }}
            >
              Skincede
            </Typography>
          </Box>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2, color: 'white' }}>
            Staff Portal
          </Typography>
          
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ bgcolor: theme.secondary, width: 35, height: 35 }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                {User?.name || 'Staff Member'}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
        
        {/* Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            bgcolor: '#fff',
            '& .MuiTab-root': { 
              fontWeight: 600,
              fontSize: '0.95rem',
              textTransform: 'none',
              minHeight: 48,
              color: 'text.primary'
            },
            '& .Mui-selected': {
              color: theme.primary,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: theme.primary,
              height: 3
            }
          }}
          centered
        >
          <Tab label="Customer Chat" />
          <Tab label="Blog Management" />
        </Tabs>
      </AppBar>
      
      {/* Tab Content */}
      <Box sx={{ p: { xs: 1, md: 3 } }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
} 