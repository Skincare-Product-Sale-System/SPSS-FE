"use client";
import { useContextElement } from "@/context/Context";
import request from "@/utils/axios";
import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Grid, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Rating as MuiRating, 
  IconButton, 
  Chip, 
  CircularProgress,
  Paper,
  Stack,
  Divider,
  Container,
  useTheme,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useThemeColors } from "@/context/ThemeContext";
import toast from "react-hot-toast";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import getStar from "@/utils/getStar";

// Tương tự như trong ProductReviewModal, tạo một component chọn rating thay thế
const CustomRatingSelector = ({ value, onChange }) => {
  const ratings = [1, 2, 3, 4, 5];
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', mb: 1 }}>
        {/* Show current rating with getStar */}
        {getStar({ rating: value })}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {ratings.map((ratingValue) => (
          <Button
            key={ratingValue}
            onClick={() => onChange(ratingValue)}
            variant={value === ratingValue ? "contained" : "outlined"}
            sx={{
              minWidth: '36px',
              height: '36px',
              padding: '0',
              color: value >= ratingValue ? '#FFB800' : '#666',
              borderColor: value >= ratingValue ? '#FFB800' : '#ccc',
              backgroundColor: value === ratingValue ? 'rgba(255, 184, 0, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 184, 0, 0.1)',
                borderColor: '#FFB800'
              }
            }}
          >
            {ratingValue}
          </Button>
        ))}
      </Box>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        {value ? `Bạn đã đánh giá ${value} sao` : 'Chọn số sao đánh giá'}
      </Typography>
    </Box>
  );
};

export default function MyReviews() {
  const mainColor = useThemeColors();
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]); // Store all fetched reviews
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" for newest first, "asc" for oldest first
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();
  const pageSize = 5; // Number of reviews per page
  const [uploadingImages, setUploadingImages] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState([]);

  // Fetch all reviews once
  useEffect(() => {
    fetchAllReviews();
  }, []);

  // Apply sorting and pagination when sort order or page changes
  useEffect(() => {
    if (allReviews.length > 0) {
      applyFiltersAndPagination();
    }
  }, [sortOrder, currentPage, allReviews]);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/reviews/user?pageSize=100`); // Fetch a large number to get all
      console.log("API Response:", response.data);
      
      const fetchedReviews = response.data.data.items || [];
      setAllReviews(fetchedReviews);
      
      // Calculate total pages
      setTotalPages(Math.ceil(fetchedReviews.length / pageSize));
      
      // Initial sort and pagination
      applyFiltersAndPagination();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndPagination = () => {
    // Sort reviews by date
    const sortedReviews = [...allReviews].sort((a, b) => {
      const dateA = new Date(a.lastUpdatedTime).getTime();
      const dateB = new Date(b.lastUpdatedTime).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedReviews = sortedReviews.slice(startIndex, startIndex + pageSize);
    
    setReviews(paginatedReviews);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1); // Reset to first page when sort order changes
  };

  const handleEditClick = (review) => {
    setCurrentReview(review);
    setEditRating(review.ratingValue);
    setEditComment(review.comment);
    setEditImages(review.reviewImages || []);
    setShowEditModal(true);
  };

  const handleCloseModal = async () => {
    // Clean up any newly uploaded images if user cancels
    const oldImages = currentReview?.reviewImages || [];
    const newImages = editImages.filter(img => !oldImages.includes(img));
    
    if (newImages.length > 0) {
      try {
        const deletePromises = newImages.map(image => 
          request.delete(`/images?imageUrl=${encodeURIComponent(image)}`)
        );
        await Promise.all(deletePromises);
        console.log("Cleaned up new images after cancel");
      } catch (error) {
        console.error("Error cleaning up images:", error);
      }
    }
    
    setShowEditModal(false);
    setCurrentReview(null);
  };

  const handleRatingChange = (event, newValue) => {
    setEditRating(newValue);
  };

  const handleRemoveImage = async (indexToRemove) => {
    // Get the image URL that needs to be removed
    const imageToRemove = editImages[indexToRemove];
    
    try {
      // Only attempt to delete from Firebase if it's a URL (not a local file)
      if (imageToRemove && imageToRemove.startsWith('http')) {
        // Delete from Firebase
        await request.delete(`/images?imageUrl=${encodeURIComponent(imageToRemove)}`);
      }
      
      // Remove from state
      const newImages = [...editImages];
      newImages.splice(indexToRemove, 1);
      setEditImages(newImages);
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      
      // Add all selected files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await request.post('/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.data) {
        // Add the new image URLs to the existing ones
        setEditImages([...editImages, ...response.data.data]);
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images");
    } finally {
      setUploadingImages(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpdateReview = async () => {
    try {
      // Validate input
      if (!editComment.trim()) {
        toast.error("Please enter a review comment");
        return;
      }
      
      if (editRating === 0) {
        toast.error("Please select a rating");
        return;
      }
      
      // Create updated review object with new rating, comment and images
      const updatedReview = {
        id: currentReview.id,
        ratingValue: editRating,
        comment: editComment,
        reviewImages: editImages
      };
      
      // Implement API call to update the review
      const response = await request.patch(`/reviews/${updatedReview.id}`, updatedReview);
      
      if (response.data.success) {
        toast.success("Review updated successfully");
        
        // Update local state
        const updatedAllReviews = allReviews.map(review => 
          review.id === updatedReview.id ? {
            ...review,
            ratingValue: updatedReview.ratingValue,
            comment: updatedReview.comment,
            reviewImages: updatedReview.reviewImages,
            lastUpdatedTime: new Date().toISOString()
          } : review
        );
        
        setAllReviews(updatedAllReviews);
        
        // Re-apply filters and pagination
        applyFiltersAndPagination();
        
        setShowEditModal(false);
        setCurrentReview(null);
      } else {
        toast.error(response.data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Error updating review");
    }
  };

  const handleImagePreview = (images, index) => {
    setCurrentImageSet(images.map(img => ({ src: img })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="70vh"
        sx={{
          background: mainColor.gradient,
        }}
      >
        <CircularProgress sx={{ color: mainColor.primary }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        background: mainColor.gradient,
        py: 6,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        {/* Sort control */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mb: 3,
            alignItems: 'center'
          }}
        >
          <FormControl 
            variant="outlined" 
            size="small"
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
                '& fieldset': {
                  borderColor: `rgba(78, 205, 196, 0.3)`,
                },
                '&:hover fieldset': {
                  borderColor: `rgba(78, 205, 196, 0.5)`,
                },
                '&.Mui-focused fieldset': {
                  borderColor: mainColor.primary,
                },
              }
            }}
          >
            <InputLabel 
              id="sort-order-label"
              sx={{ color: mainColor.text }}
            >
              Sắp xếp theo ngày
            </InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              onChange={handleSortChange}
              label="Sắp xếp theo ngày"
              sx={{ 
                color: mainColor.text,
                '& .MuiSvgIcon-root': {
                  color: mainColor.text,
                }
              }}
            >
              <MenuItem value="desc">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowDownwardIcon fontSize="small" sx={{ mr: 1 }} />
                  Mới nhất trước
                </Box>
              </MenuItem>
              <MenuItem value="asc">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpwardIcon fontSize="small" sx={{ mr: 1 }} />
                  Cũ nhất trước
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Stack spacing={3}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card 
                key={review.id} 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  transition: 'all 0.4s ease',
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
                    transform: 'translateY(-4px)'
                  },
                  overflow: 'hidden',
                  border: `1px solid rgba(78, 205, 196, 0.1)`,
                  backgroundColor: 'white'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={review.avatarUrl} 
                          alt={review.userName}
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            mr: 2,
                            border: `2px solid rgba(78, 205, 196, 0.2)`
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 500,
                              color: '#4a4a4a'
                            }}
                          >
                            {review.userName}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.85rem'
                            }}
                          >
                            {dayjs(review.lastUpdatedTime).format("DD/MM/YYYY HH:mm")}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Link
                        href={`/product-detail/${review.productId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Box 
                          display="flex" 
                          alignItems="center"
                          sx={{
                            borderRadius: 2,
                            p: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: mainColor.light,
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(78, 205, 196, 0.1)'
                            },
                            cursor: 'pointer'
                          }}
                        >
                          <Box 
                            sx={{ 
                              width: 70, 
                              height: 70, 
                              borderRadius: 2, 
                              overflow: 'hidden',
                              position: 'relative',
                              mr: 2,
                              flexShrink: 0,
                              border: `1px solid rgba(78, 205, 196, 0.1)`,
                            }}
                          >
                            <img
                              src={review.productImage}
                              alt={review.productName}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 500,
                                color: mainColor.text,
                              }}
                            >
                              {review.productName}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'text.secondary',
                                fontSize: '0.85rem'
                              }}
                            >
                              {review.variationOptionValues.join(" / ")}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Box>
                        {getStar({ rating: review.ratingValue })}
                      </Box>
                      {review.isEditble !== false ? (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(review)}
                          sx={{
                            borderColor: mainColor.primary,
                            color: mainColor.text,
                            borderRadius: 6,
                            px: 2,
                            '&:hover': {
                              borderColor: mainColor.primary,
                              backgroundColor: mainColor.light,
                            }
                          }}
                        >
                          Chỉnh sửa đánh giá
                        </Button>
                      ) : (
                        <Chip
                          label="Đã chỉnh sửa"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(158, 158, 158, 0.2)',
                            color: '#757575',
                            borderRadius: 6,
                            fontSize: '0.75rem',
                            height: 28
                          }}
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      paragraph 
                      sx={{ 
                        mt: 2,
                        color: '#4a4a4a',
                        lineHeight: 1.7,
                        fontSize: '0.95rem'
                      }}
                    >
                      {review.comment}
                    </Typography>
                    
                    {review.reviewImages?.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                        {review.reviewImages.map((image, index) => (
                          <Box 
                            key={index} 
                            onClick={() => handleImagePreview(review.reviewImages, index)}
                            sx={{ 
                              width: 90, 
                              height: 90, 
                              borderRadius: 2, 
                              overflow: 'hidden',
                              position: 'relative',
                              border: `1px solid rgba(78, 205, 196, 0.1)`,
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'scale(1.03)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                              }
                            }}
                          >
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}

                    {review.reply && (
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2.5, 
                          mt: 3, 
                          borderRadius: 3,
                          bgcolor: mainColor.light,
                          border: `1px solid rgba(78, 205, 196, 0.1)`
                        }}
                      >
                        <Box display="flex">
                          <Avatar
                            src={review.reply.avatarUrl}
                            alt={review.reply.userName}
                            sx={{ 
                              width: 44, 
                              height: 44, 
                              mr: 2,
                              border: `2px solid rgba(78, 205, 196, 0.2)`
                            }}
                          />
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 500,
                                color: mainColor.text
                              }}
                            >
                              {review.reply.userName}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                display: 'block',
                                mb: 1
                              }}
                            >
                              {dayjs(review.reply.lastUpdatedTime).format("DD/MM/YYYY HH:mm")}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 1,
                                color: '#4a4a4a',
                                lineHeight: 1.6
                              }}
                            >
                              {review.reply.replyContent}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                backgroundColor: 'white',
                borderRadius: 3,
                border: `1px solid rgba(78, 205, 196, 0.1)`,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: mainColor.text,
                  fontWeight: 500,
                  mb: 2
                }}
              >
                Không tìm thấy đánh giá
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary'
                }}
              >
                Bạn chưa viết đánh giá nào.
              </Typography>
            </Box>
          )}
        </Stack>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 5,
              mb: 3
            }}
          >
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: mainColor.text,
                  '&.Mui-selected': {
                    backgroundColor: mainColor.light,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: mainColor.medium,
                    }
                  },
                  '&:hover': {
                    backgroundColor: mainColor.light,
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Edit Review Dialog */}
        <Dialog 
          open={showEditModal} 
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          sx={{ 
            zIndex: 2000,
            '& .MuiDialog-paper': {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: `1px solid rgba(78, 205, 196, 0.1)`,
              pb: 2
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: mainColor.text,
                fontWeight: 500,
                fontFamily: '"Roboto", sans-serif',
              }}
            >
              Chỉnh sửa đánh giá
            </Typography>
            <IconButton 
              onClick={handleCloseModal} 
              size="small"
              sx={{
                color: mainColor.text,
                '&:hover': {
                  backgroundColor: mainColor.light
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 3 }}>
            <Stack spacing={4}>
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ 
                    color: mainColor.text,
                    fontWeight: 500,
                    mb: 1.5
                  }}
                >
                  Sản phẩm
                </Typography>
                {currentReview && (
                  <Box 
                    display="flex" 
                    alignItems="center"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: mainColor.light,
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        position: 'relative',
                        mr: 2,
                        border: `1px solid rgba(78, 205, 196, 0.1)`,
                      }}
                    >
                      <img
                        src={currentReview.productImage}
                        alt={currentReview.productName}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 500,
                          color: mainColor.text
                        }}
                      >
                        {currentReview?.productName}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary'
                        }}
                      >
                        {currentReview?.variationOptionValues.join(" / ")}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ 
                    color: mainColor.text,
                    fontWeight: 500,
                    mb: 1
                  }}
                >
                  Đánh giá
                </Typography>
                <Box className="d-flex justify-content-center mb-3">
                  <CustomRatingSelector
                    value={editRating}
                    onChange={(value) => setEditRating(value)}
                  />
                </Box>
              </Box>
              
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ 
                    color: mainColor.text,
                    fontWeight: 500,
                    mb: 1
                  }}
                >
                  Review
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: `rgba(78, 205, 196, 0.2)`,
                      },
                      '&:hover fieldset': {
                        borderColor: `rgba(78, 205, 196, 0.3)`,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: mainColor.primary,
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography 
                  variant="subtitle2" 
                  gutterBottom
                  sx={{ 
                    color: mainColor.text,
                    fontWeight: 500,
                    mb: 1.5
                  }}
                >
                  Hình ảnh
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {editImages.map((image, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        width: 90, 
                        height: 90, 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        position: 'relative',
                        border: `1px solid rgba(78, 205, 196, 0.1)`,
                      }}
                    >
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                      <IconButton 
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          p: '4px',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Box 
                    component="label"
                    htmlFor="upload-images"
                    sx={{ 
                      width: 90, 
                      height: 90, 
                      borderRadius: 2,
                      border: '2px dashed',
                      borderColor: `rgba(78, 205, 196, 0.3)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: mainColor.primary,
                        bgcolor: mainColor.light
                      }
                    }}
                  >
                    {uploadingImages ? (
                      <CircularProgress size={24} sx={{ color: mainColor.primary }} />
                    ) : (
                      <AddIcon sx={{ color: mainColor.primary }} />
                    )}
                    <input 
                      id="upload-images"
                      type="file" 
                      ref={fileInputRef}
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      multiple
                      onChange={handleFileChange}
                      disabled={uploadingImages}
                    />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2.5 }}>
            <Button 
              onClick={handleCloseModal} 
              variant="outlined"
              sx={{
                borderColor: `rgba(78, 205, 196, 0.5)`,
                color: mainColor.text,
                borderRadius: 6,
                px: 3,
                '&:hover': {
                  borderColor: mainColor.primary,
                  backgroundColor: mainColor.light,
                }
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateReview} 
              variant="contained" 
              sx={{
                bgcolor: mainColor.primary,
                color: 'white',
                borderRadius: 6,
                px: 3,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: mainColor.dark,
                  boxShadow: `0 4px 12px rgba(78, 205, 196, 0.2)`,
                }
              }}
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add the image lightbox component */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={currentImageSet}
          index={lightboxIndex}
        />
      </Container>
    </Box>
  );
}
