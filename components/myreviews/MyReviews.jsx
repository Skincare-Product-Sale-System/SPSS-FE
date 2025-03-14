"use client";
import { useContextElement } from "@/context/Context";
import request from "@/utlis/axios";
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
  Container
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editImages, setEditImages] = useState([]);
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      const { data } = await request.get(
        `/reviews/user?pageSize=20`
      );
      setReviews(data.data.items);
      setLoading(false);
    })();
  }, []);

  const fetchMyReviews = async (page) => {
    try {
      setLoading(true);
      const response = await request.get(`/reviews/user?pageSize=20&pageNumber=${page}`);
      console.log("API Response:", response.data);
      setReviews(response.data.data.items);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews(currentPage);
  }, [searchParams]);

  const handleEditClick = (review) => {
    setCurrentReview(review);
    setEditRating(review.ratingValue);
    setEditComment(review.comment);
    setEditImages(review.reviewImages || []);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setCurrentReview(null);
  };

  const handleRatingChange = (event, newValue) => {
    setEditRating(newValue);
  };

  const handleRemoveImage = (indexToRemove) => {
    setEditImages(editImages.filter((_, index) => index !== indexToRemove));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map(file => {
      return URL.createObjectURL(file);
    });

    setEditImages([...editImages, ...newImages]);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdateReview = async () => {
    try {
      // Create updated review object with new rating, comment and images
      const updatedReview = {
        ...currentReview,
        ratingValue: editRating,
        comment: editComment,
        reviewImages: editImages
      };
      
      // Implement API call to update the review
      await request.put(`/reviews/${updatedReview.id}`, updatedReview);
      
      // Update local state
      const updatedReviews = reviews.map(review => 
        review.id === updatedReview.id ? updatedReview : review
      );
      setReviews(updatedReviews);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="text.primary">
        My Reviews
      </Typography>
      
      <Stack spacing={3}>
        {reviews.map((review) => (
          <Card key={review.id} variant="outlined" sx={{ 
            borderRadius: 2,
            transition: 'all 0.3s',
            '&:hover': { boxShadow: 3 }
          }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      src={review.avatarUrl} 
                      alt={review.userName}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {review.userName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(review.lastUpdatedTime).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center">
                    <Box 
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: 1, 
                        overflow: 'hidden',
                        position: 'relative',
                        mr: 2,
                        flexShrink: 0
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
                      <Typography variant="subtitle1" fontWeight="medium">
                        {review.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.variationOptionValues.join(" / ")}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <MuiRating value={review.ratingValue} readOnly precision={1} />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(review)}
                    color="primary"
                  >
                    Edit
                  </Button>
                </Box>
                
                <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                  {review.comment}
                </Typography>
                
                {review.reviewImages?.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {review.reviewImages.map((image, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: 1, 
                          overflow: 'hidden',
                          position: 'relative' 
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
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      mt: 2, 
                      borderRadius: 2,
                      bgcolor: 'background.paper' 
                    }}
                  >
                    <Box display="flex">
                      <Avatar
                        src={review.reply.avatarUrl}
                        alt={review.reply.userName}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {review.reply.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {dayjs(review.reply.lastUpdatedTime).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {review.reply.replyContent}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Edit Review Dialog */}
      <Dialog 
        open={showEditModal} 
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        sx={{ zIndex: 2000 }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Review</Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Product
              </Typography>
              {currentReview && (
                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 1, 
                      overflow: 'hidden',
                      position: 'relative',
                      mr: 2 
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
                    <Typography variant="body1" fontWeight="medium">
                      {currentReview?.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentReview?.variationOptionValues.join(" / ")}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rating
              </Typography>
              <MuiRating 
                value={editRating} 
                onChange={handleRatingChange}
                size="large"
                precision={1}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Review
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                variant="outlined"
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Images
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {editImages.map((image, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 1, 
                      overflow: 'hidden',
                      position: 'relative' 
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
                  onClick={handleAddImage}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: 1,
                    border: '2px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <AddIcon color="action" />
                </Box>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }} 
                  accept="image/*" 
                  multiple
                  onChange={handleFileChange}
                />
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateReview} 
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
