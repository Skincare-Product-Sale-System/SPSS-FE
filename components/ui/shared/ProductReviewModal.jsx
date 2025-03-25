import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import request from "@/utils/axios";
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from "react-hot-toast";
import getStar from "@/utils/getStar";

export default function ProductReviewModal({ 
  open, 
  onClose, 
  productInfo, 
  orderId,
  onSubmitSuccess 
}) {
  const mainColor = useThemeColors();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up images when closing the modal or component unmounts
  useEffect(() => {
    return () => {
      // Clean up any uploaded images if the component unmounts
      cleanupImages();
    };
  }, []);

  const cleanupImages = async () => {
    // Delete all uploaded images from Firebase if they exist
    if (uploadedImages.length > 0) {
      try {
        const deletePromises = uploadedImages.map(image => 
          request.delete(`/images?imageUrl=${encodeURIComponent(image)}`)
        );
        await Promise.all(deletePromises);
        console.log("Cleaned up all images");
      } catch (error) {
        console.error("Error cleaning up images:", error);
      }
    }
  };

  const handleClose = async () => {
    await cleanupImages();
    setUploadedImages([]);
    setRating(0);
    setComment('');
    onClose();
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

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
        setUploadedImages([...uploadedImages, ...response.data.data]);
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error uploading images");
    } finally {
      setUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = uploadedImages[index];
    
    try {
      // Delete from Firebase
      await request.delete(`/images?imageUrl=${encodeURIComponent(imageToRemove)}`);
      
      // Remove from state
      const newImages = [...uploadedImages];
      newImages.splice(index, 1);
      setUploadedImages(newImages);
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        productItemId: productInfo.productItemId || productInfo.id,
        reviewImages: uploadedImages,
        ratingValue: rating,
        comment: comment,
        orderId: orderId
      };

      console.log(reviewData);
      const response = await request.post('/reviews', reviewData);
      console.log(response);
      if (response.data.success) {
        toast.success("Review submitted successfully");
        // Don't clean up images on successful submission
        setUploadedImages([]);
        onSubmitSuccess?.(); // Callback for parent component
        onClose();
      } else {
        toast.error(response.data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  // Create a custom rating component with 5 clickable stars
  const CustomRating = () => {
    const ratings = [1, 2, 3, 4, 5];
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', mb: 1 }}>
          {/* Show current rating with getStar */}
          {getStar({ rating })}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {ratings.map((value) => (
            <Button
              key={value}
              onClick={() => setRating(value)}
              variant={rating === value ? "contained" : "outlined"}
              sx={{
                minWidth: '36px',
                height: '36px',
                padding: '0',
                color: rating >= value ? '#FFB800' : '#666',
                borderColor: rating >= value ? '#FFB800' : '#ccc',
                backgroundColor: rating === value ? 'rgba(255, 184, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 184, 0, 0.1)',
                  borderColor: '#FFB800'
                }
              }}
            >
              {value}
            </Button>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {rating ? `Bạn đã đánh giá ${rating} sao` : 'Chọn số sao đánh giá'}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          padding: '8px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${mainColor.light || '#f0f0f0'}`,
        pb: 1
      }}>
        <Typography variant="h6">Đánh giá sản phẩm</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" mb={1}>Sản phẩm</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {productInfo.productImage && (
              <img 
                src={productInfo.productImage} 
                alt={productInfo.productName} 
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle1">{productInfo.productName}</Typography>
              {productInfo.variationOptionValues && (
                <Typography variant="body2" color="text.secondary">
                  {productInfo.variationOptionValues.join(', ')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <CustomRating />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" mb={1}>Nội dung</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Nhập nội dung đánh giá"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" mb={1}>Thêm hình ảnh (tùy chọn)</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {uploadedImages.map((image, index) => (
              <Box 
                key={index} 
                sx={{ 
                  position: 'relative', 
                  width: 80, 
                  height: 80,
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={image} 
                  alt={`Image ${index+1}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    p: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(220,0,0,0.7)',
                    }
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            
            <Button
              component="label"
              sx={{ 
                width: 80, 
                height: 80, 
                border: '1px dashed #ccc',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
              {uploading ? (
                <CircularProgress size={24} sx={{ color: mainColor.primary || 'primary' }} />
              ) : (
                <>
                  <AddPhotoAlternateIcon sx={{ mb: 0.5 }} />
                  <Typography variant="caption">Thêm ảnh</Typography>
                </>
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            borderColor: '#ddd',
            color: 'text.primary',
            '&:hover': {
              borderColor: '#ccc',
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmitReview}
          variant="contained"
          disabled={!rating || !comment.trim() || submitting}
          sx={{ 
            backgroundColor: mainColor.primary || 'primary',
            '&:hover': {
              backgroundColor: mainColor.dark || 'primary.dark',
            }
          }}
        >
          {submitting ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            'Gửi đánh giá'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 