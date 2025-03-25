"use client"
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { 
  CircularProgress, 
  Avatar, 
  TextField, 
  Button,
  IconButton
} from "@mui/material";
import { PhotoCamera } from '@mui/icons-material';
import toast from "react-hot-toast";

export default function ProfileSection({ userData, onUpdateUserData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: userData?.userName || "",
    surName: userData?.surName || "",
    lastName: userData?.lastName || "",
    emailAddress: userData?.emailAddress || "",
    phoneNumber: userData?.phoneNumber || "",
    avatarUrl: userData?.avatarUrl || "",
  });
  const [saving, setSaving] = useState(false);
  const theme = useTheme();

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
      await onUpdateUserData(formData);
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
        if (!file.type.startsWith('image/')) {
          toast.error('Vui lòng chọn file hình ảnh');
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error('Kích thước file không được vượt quá 5MB');
          return;
        }

        const formDataFile = new FormData();
        formDataFile.append('avatarFiles', file);
        
        toast.loading('Đang tải ảnh đại diện...');
        
        const response = await request.post('/accounts/upload-avatar', formDataFile);
        
        if (response.data && response.data.success) {
          await onUpdateUserData();
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
        
        await request.delete(`/accounts/delete-avatar?imageUrl=${encodeURIComponent(formData.avatarUrl)}`);
        
        setFormData(prev => ({
          ...prev,
          avatarUrl: ""
        }));
        
        onUpdateUserData({
          ...userData,
          avatarUrl: ""
        });
        
        toast.dismiss();
        toast.success('Xóa ảnh đại diện thành công');
      } catch (error) {
        console.error('Error deleting avatar:', error);
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Failed to delete avatar');
      }
    }
  };

  return (
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
          <h3 className="text-xl font-semibold mb-3 sm:text-2xl" 
            style={{ color: theme.palette.primary.dark, fontFamily: 'Playfair Display, serif' }}>
            {isEditing ? "Chỉnh Sửa Hồ Sơ" : `${userData?.surName} ${userData?.lastName}`}
          </h3>
          
          <div className="mb-4 space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {isEditing ? (
                <>
                  <TextField
                    label="Họ"
                    name="surName"
                    variant="outlined"
                    fullWidth
                    value={formData.surName}
                    onChange={handleInputChange}
                    size="small"
                    InputProps={{
                      style: { fontFamily: 'Roboto, sans-serif' }
                    }}
                    InputLabelProps={{
                      style: { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                  <TextField
                    label="Tên"
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleInputChange}
                    size="small"
                    InputProps={{
                      style: { fontFamily: 'Roboto, sans-serif' }
                    }}
                    InputLabelProps={{
                      style: { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </>
              ) : (
                <div className="col-span-2">
                  <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <span className="font-medium">Tên đầy đủ:</span> {userData?.surName} {userData?.lastName}
                  </p>
                </div>
              )}
            </div>
            
            {/* Username Field */}
            {isEditing ? (
              <TextField
                label="Tên người dùng"
                name="userName"
                variant="outlined"
                fullWidth
                value={formData.userName}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
                InputLabelProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
              />
            ) : (
              <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <span className="font-medium">Tên người dùng:</span> {userData?.userName}
              </p>
            )}
            
            {/* Email Field */}
            {isEditing ? (
              <TextField
                label="Email"
                name="emailAddress"
                variant="outlined"
                fullWidth
                type="email"
                value={formData.emailAddress}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
                InputLabelProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
              />
            ) : (
              <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <span className="font-medium">Email:</span> {userData?.emailAddress}
              </p>
            )}
            
            {/* Phone Field */}
            {isEditing ? (
              <TextField
                label="Số điện thoại"
                name="phoneNumber"
                variant="outlined"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
                InputLabelProps={{
                  style: { fontFamily: 'Roboto, sans-serif' }
                }}
              />
            ) : (
              <p className="text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <span className="font-medium">Số điện thoại:</span> {userData?.phoneNumber || "Chưa cập nhật"}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{ 
                    fontFamily: 'Roboto, sans-serif',
                    minWidth: '120px'
                  }}
                >
                  {saving ? <CircularProgress size={24} color="inherit" /> : "Lưu thay đổi"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      userName: userData.userName || "",
                      surName: userData.surName || "",
                      lastName: userData.lastName || "",
                      emailAddress: userData.emailAddress || "",
                      phoneNumber: userData.phoneNumber || "",
                      avatarUrl: userData.avatarUrl || "",
                    });
                  }}
                  sx={{ 
                    fontFamily: 'Roboto, sans-serif',
                    minWidth: '120px'
                  }}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  minWidth: '120px'
                }}
              >
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 