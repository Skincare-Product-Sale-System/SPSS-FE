"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import request from "@/utils/axios";
import useAuthStore from "@/context/authStore";
import { useTheme } from "@mui/material/styles";
import { 
  CircularProgress, 
  Avatar, 
  TextField, 
  Button,
  ShoppingBagOutlined,
  HomeOutlined,
  StarOutlined,
  LockOutlined,
  IconButton
} from "@mui/material";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { PhotoCamera } from '@mui/icons-material';
import toast from "react-hot-toast";

export default function MyAccount() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  // const { Id } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await request.get(`/accounts`);
      setUserData(data.data);
      setFormData({
        userName: data.data.userName || "",
        surName: data.data.surName || "",
        lastName: data.data.lastName || "",
        emailAddress: data.data.emailAddress || "",
        phoneNumber: data.data.phoneNumber || "",
        avatarUrl: data.data.avatarUrl || "",
      });
      console.log(formData);
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải thông tin tài khoản");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log(formData);
      await request.patch(`/accounts`, formData);
      setUserData({
        ...userData,
        ...formData
      });
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      toast.error("Không thể cập nhật hồ sơ");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Vui lòng chọn file hình ảnh');
          return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error('Kích thước file không được vượt quá 5MB');
          return;
        }

        // Create FormData and append file with correct field name
        const formDataFile = new FormData();
        formDataFile.append('avatarFiles', file); // Changed to match controller parameter name
        
        toast.loading('Đang tải ảnh đại diện...');
        
        const response = await request.post('/accounts/upload-avatar', formDataFile);
        
        if (response.data && response.data.success) {
          // Fetch updated user data to get new avatar URL
          await fetchUserData();
          
          toast.dismiss();
          toast.success('Tải ảnh đại diện thành công');
        } else {
          throw new Error(response.data?.message || 'Failed to upload avatar');
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Failed to upload avatar');
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!formData.avatarUrl) {
      toast.error('Không có ảnh đại diện để xóa');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh đại diện?')) {
      try {
        toast.loading('Đang xóa ảnh đại diện...');
        
        // Send the current avatar URL as a query parameter
        await request.delete(`/accounts/delete-avatar?imageUrl=${encodeURIComponent(formData.avatarUrl)}`);
        
        // Update form data and userData to remove avatar
        setFormData(prev => ({
          ...prev,
          avatarUrl: ""
        }));
        
        setUserData(prev => ({
          ...prev,
          avatarUrl: ""
        }));
        
        toast.dismiss();
        toast.success('Xóa ảnh đại diện thành công');
      } catch (error) {
        console.error('Error deleting avatar:', error);
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Failed to delete avatar');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </div>
    );
  }

  return (
    <div className="bg-white border p-3 rounded-lg shadow-sm account-dashboard my-account-content sm:p-6" 
         style={{ borderColor: theme.palette.divider }}>
      
      {/* User Profile Section */}
      <div className="p-3 rounded-lg mb-6 sm:mb-8 sm:p-6" style={{ backgroundColor: theme.palette.primary.light + '20' }}>
        <div className="flex flex-col gap-4 items-center md:flex-row md:items-start sm:gap-6">
          {/* Avatar Section */}
          <div className="flex justify-center w-full md:w-auto">
            {!isEditing ? (
              <div className="relative">
                <Avatar 
                  src={userData?.avatarUrl || "/images/default-avatar.png"} 
                  alt={userData?.userName}
                  sx={{ 
                    width: { xs: 100, sm: 120 }, 
                    height: { xs: 100, sm: 120 },
                    border: `3px solid ${theme.palette.primary.main}`
                  }}
                />
              </div>
            ) : (
              <div className="relative">
                <Avatar 
                  src={formData.avatarUrl || "/images/default-avatar.png"} 
                  alt={formData.userName}
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: `3px solid ${theme.palette.primary.main}`,
                    filter: 'brightness(0.8)',
                  }}
                />
                <div className="flex justify-center absolute inset-0 items-center">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="avatar-upload">
                    <IconButton 
                      component="span"
                      sx={{ 
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.5)',
                        }
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </div>
                {formData.avatarUrl && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="bg-red-500 p-1.5 rounded-full text-white -bottom-2 -right-2 absolute hover:bg-red-600 transition-colors"
                    style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    title="Delete avatar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Form Section */}
          <div className="flex-1 text-center w-full md:text-left">
            <h3 className="text-xl font-semibold mb-3 sm:text-2xl" style={{ color: theme.palette.primary.dark }}>
              {isEditing ? "Chỉnh Sửa Hồ Sơ" : `${userData?.surName} ${userData?.lastName}`}
            </h3>
            
            <div className="mb-4 space-y-3">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {!isEditing ? (
                  <>
                    <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                      <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                        Họ
                      </p>
                      <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                        {userData?.surName || "N/A"}
                      </p>
                    </div>
                    
                    <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                      <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                        Tên
                      </p>
                      <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                        {userData?.lastName || "N/A"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <TextField
                      label="Họ"
                      name="surName"
                      value={formData.surName}
                      onChange={handleInputChange}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    
                    <TextField
                      label="Tên"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </>
                )}
              </div>

              {/* Other Fields */}
              {!isEditing ? (
                <div className="space-y-3">
                  <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                    <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                      Tên đăng nhập
                    </p>
                    <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                      {userData?.userName || "N/A"}
                    </p>
                  </div>
                  
                  <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                    <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                      Địa chỉ email
                    </p>
                    <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                      {userData?.emailAddress || "N/A"}
                    </p>
                  </div>
                  
                  <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                    <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                      Số điện thoại
                    </p>
                    <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                      {userData?.phoneNumber || "N/A"}
                    </p>
                  </div>
                  
                  <div className="border p-2 rounded-md sm:p-3" style={{ borderColor: theme.palette.divider }}>
                    <p className="text-xs font-medium mb-0 sm:text-sm" style={{ color: theme.palette.text.secondary }}>
                      Thành viên từ
                    </p>
                    <p className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
                      {userData?.createdTime ? new Date(userData.createdTime).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <TextField
                    label="Tên đăng nhập"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  
                  <TextField
                    label="Địa chỉ email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                  
                  <TextField
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 md:justify-start">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="rounded-md text-sm text-white w-full font-medium px-4 py-2 sm:w-auto"
                  style={{ backgroundColor: theme.palette.primary.main }}>
                  Chỉnh Sửa Hồ Sơ
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-md text-sm text-white w-full font-medium px-4 py-2 sm:w-auto"
                    style={{ backgroundColor: theme.palette.primary.main }}>
                    {saving ? 'Saving...' : 'Lưu thay đổi'}
                  </button>
                  
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="border rounded-md text-sm w-full font-medium px-4 py-2 sm:w-auto"
                    style={{ 
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider
                    }}>
                    Hủy
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Skin Type Section */}
      <div className={`border ${userData?.skinType ? '' : 'border-dashed'} p-3 sm:p-5 rounded-lg mb-4 sm:mb-6`} 
           style={{ borderColor: theme.palette.primary.main }}>
        <h5 className="text-base font-medium mb-2 sm:mb-3 sm:text-lg" style={{ color: theme.palette.primary.main }}>
          {userData?.skinType ? 'Loại da của bạn' : 'Khám phá loại da của bạn'}
        </h5>
        
        {userData?.skinType ? (
          <div className="flex flex-col gap-2 items-center sm:flex-row sm:gap-0">
            <span 
              className="rounded-full text-center text-sm text-white w-full font-medium px-4 py-2 sm:mr-3 sm:w-auto"
              style={{ backgroundColor: theme.palette.primary.main }}
            >
              {userData.skinType}
            </span>
            <Link href="/quiz" className="text-center text-sm w-full font-medium hover:underline sm:w-auto" 
                  style={{ color: theme.palette.primary.main }}>
              Làm lại khảo sát da
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm mb-3 sm:text-base sm:text-left" style={{ color: theme.palette.text.primary }}>
              Làm khảo sát nhanh để nhận được đề xuất sản phẩm phù hợp với loại da của bạn.
            </p>
            <div className="flex justify-center sm:justify-start">
              <Link href="/quiz" 
                    className="rounded-md text-center text-sm text-white w-full px-4 py-2 sm:w-auto"
                    style={{ backgroundColor: theme.palette.primary.main }}>
                Làm Khảo Sát Da
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Account Navigation Section */}
      <div className="p-3 rounded-lg sm:p-5" style={{ backgroundColor: theme.palette.background.paper }}>
        <h5 className="text-base text-center font-medium mb-3 sm:text-left sm:text-lg" style={{ color: theme.palette.text.primary }}>
          Quản Lý Tài Khoản
        </h5>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 sm:gap-4">
          <Link href="/my-account-orders" 
                className="flex flex-col border p-2 rounded-lg text-center hover:shadow-md items-center sm:p-4 transition-all"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-2xl mb-1 sm:mb-2 sm:text-3xl" style={{ color: theme.palette.primary.main }}>
              <ShoppingBagOutlinedIcon fontSize="inherit" />
            </span>
            <span className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
              Đơn Hàng
            </span>
          </Link>
          
          <Link href="/my-account-address" 
                className="flex flex-col border p-2 rounded-lg text-center hover:shadow-md items-center sm:p-4 transition-all"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-2xl mb-1 sm:mb-2 sm:text-3xl" style={{ color: theme.palette.primary.main }}>
              <HomeOutlinedIcon fontSize="inherit" />
            </span>
            <span className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
              Sổ Địa Chỉ
            </span>
          </Link>
          
          <Link href="/my-reviews" 
                className="flex flex-col border p-2 rounded-lg text-center hover:shadow-md items-center sm:p-4 transition-all"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-2xl mb-1 sm:mb-2 sm:text-3xl" style={{ color: theme.palette.primary.main }}>
              <StarOutlinedIcon fontSize="inherit" />
            </span>
            <span className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
              Đánh Giá Của Tôi
            </span>
          </Link>
          
          <Link href="/change-password" 
                className="flex flex-col border p-2 rounded-lg text-center hover:shadow-md items-center sm:p-4 transition-all"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-2xl mb-1 sm:mb-2 sm:text-3xl" style={{ color: theme.palette.primary.main }}>
              <LockOutlinedIcon fontSize="inherit" />
            </span>
            <span className="text-sm font-medium sm:text-base" style={{ color: theme.palette.text.primary }}>
              Đổi Mật Khẩu
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
