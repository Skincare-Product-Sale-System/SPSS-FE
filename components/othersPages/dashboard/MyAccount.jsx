"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import request from "@/utlis/axios";
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
      toast.error("Failed to load account information");
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
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Create a FormData object to send the file
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        
        // Show loading state
        toast.loading('Uploading image...');
        
        // Call API to upload to Firebase
        const response = await request.post('/upload/image', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Get the URL from the response
        const imageUrl = response.data.url;
        
        // Update form data with the new URL
        setFormData({
          ...formData,
          avatarUrl: imageUrl
        });
        
        toast.dismiss();
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.dismiss();
        toast.error('Failed to upload image');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </div>
    );
  }

  return (
    <div className="my-account-content account-dashboard bg-white p-6 rounded-lg shadow-sm border" 
         style={{ borderColor: theme.palette.divider }}>
      
      {/* User Profile Section - Highlighted */}
      <div className="p-6 mb-8 rounded-lg" style={{ backgroundColor: theme.palette.primary.light + '20' }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {!isEditing ? (
            <Avatar 
              src={userData?.avatarUrl || "/images/default-avatar.png"} 
              alt={userData?.userName}
              sx={{ 
                width: 120, 
                height: 120,
                border: `3px solid ${theme.palette.primary.main}`
              }}
            />
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
              <div className="absolute inset-0 flex items-center justify-center">
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
            </div>
          )}
          
          <div className="flex-1 text-left md:text-left">
            <h3 className="text-2xl font-semibold mb-3" style={{ color: theme.palette.primary.dark }}>
              {isEditing ? "Edit Profile" : `${userData?.surName} ${userData?.lastName}`}
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {!isEditing ? (
                  <>
                    <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                      <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                        First Name
                      </p>
                      <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                        {userData?.surName || "N/A"}
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                      <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                        Last Name
                      </p>
                      <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                        {userData?.lastName || "N/A"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <TextField
                      label="First Name"
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
                      label="Last Name"
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
              
              {!isEditing ? (
                <>
                  <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                    <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                      Username
                    </p>
                    <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {userData?.userName || "N/A"}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                    <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                      Email Address
                    </p>
                    <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {userData?.emailAddress || "N/A"}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                    <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                      Phone Number
                    </p>
                    <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {userData?.phoneNumber || "N/A"}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md border" style={{ borderColor: theme.palette.divider, height: '56px' }}>
                    <p className="text-sm font-medium mb-0" style={{ color: theme.palette.text.secondary }}>
                      Member Since
                    </p>
                    <p className="font-medium" style={{ color: theme.palette.text.primary }}>
                      {userData?.createdTime ? new Date(userData.createdTime).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <TextField
                    label="Username"
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
                    label="Email Address"
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
                    label="Phone Number"
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
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-block px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: theme.palette.primary.main }}>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-block px-4 py-2 rounded-md text-white text-sm font-medium"
                  style={{ backgroundColor: theme.palette.primary.main }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button 
                  onClick={() => setIsEditing(false)}
                  className="inline-block px-4 py-2 rounded-md text-sm font-medium border"
                  style={{ 
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider
                  }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Skin Type Section */}
      {userData?.skinType ? (
        <div className="p-5 rounded-lg mb-6 border" style={{ borderColor: theme.palette.primary.main }}>
          <h5 className="text-lg font-medium mb-3" style={{ color: theme.palette.primary.main }}>
            Your Skin Type
          </h5>
          <div className="flex items-center">
            <span 
              className="inline-block px-4 py-2 rounded-full text-white font-medium mr-3"
              style={{ backgroundColor: theme.palette.primary.main }}
            >
              {userData.skinType || "Specific Skin Type"}
            </span>
            <p style={{ color: theme.palette.text.primary }}>
              <Link href="/quiz" className="text-sm font-medium hover:underline" 
                    style={{ color: theme.palette.primary.main }}>
                Take our skin quiz again
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-lg mb-6 border border-dashed" style={{ borderColor: theme.palette.primary.main }}>
          <h5 className="text-lg font-medium mb-2" style={{ color: theme.palette.primary.main }}>
            Discover Your Skin Type
          </h5>
          <p className="mb-3" style={{ color: theme.palette.text.primary }}>
            Take our quick skin quiz to get personalized product recommendations for your skin type.
          </p>
          <Link href="/quiz" 
                className="inline-block px-4 py-2 rounded-md text-white text-sm"
                style={{ backgroundColor: theme.palette.primary.main }}>
            Take Skin Quiz
          </Link>
        </div>
      )}
      
      {/* Account Navigation Section */}
      <div className="p-5 rounded-lg mb-6" style={{ backgroundColor: theme.palette.background.paper }}>
        <h5 className="text-lg font-medium mb-3" style={{ color: theme.palette.text.primary }}>
          Account Management
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/my-account-orders" className="p-4 rounded-lg border hover:shadow-md transition-all flex flex-col items-center text-center"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-3xl mb-2" style={{ color: theme.palette.primary.main }}>
              <ShoppingBagOutlinedIcon fontSize="inherit" />
            </span>
            <span className="font-medium" style={{ color: theme.palette.text.primary }}>My Orders</span>
          </Link>
          
          <Link href="/my-account-address" className="p-4 rounded-lg border hover:shadow-md transition-all flex flex-col items-center text-center"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-3xl mb-2" style={{ color: theme.palette.primary.main }}>
              <HomeOutlinedIcon fontSize="inherit" />
            </span>
            <span className="font-medium" style={{ color: theme.palette.text.primary }}>My Addresses</span>
          </Link>
          
          <Link href="/my-reviews" className="p-4 rounded-lg border hover:shadow-md transition-all flex flex-col items-center text-center"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-3xl mb-2" style={{ color: theme.palette.primary.main }}>
              <StarOutlinedIcon fontSize="inherit" />
            </span>
            <span className="font-medium" style={{ color: theme.palette.text.primary }}>My Reviews</span>
          </Link>
          
          <Link href="/change-password" className="p-4 rounded-lg border hover:shadow-md transition-all flex flex-col items-center text-center"
                style={{ borderColor: theme.palette.divider }}>
            <span className="text-3xl mb-2" style={{ color: theme.palette.primary.main }}>
              <LockOutlinedIcon fontSize="inherit" />
            </span>
            <span className="font-medium" style={{ color: theme.palette.text.primary }}>Change Password</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
