"use client";

import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Button, Grid, Pagination } from "@mui/material";
import Rating from "../common/Rating";
import { defaultUserImage } from "@/utlis/default";
import dayjs from "dayjs";
import request from "@/utlis/axios";
import StarIcon from '@mui/icons-material/Star';
import { useThemeColors } from "@/context/ThemeContext";

export default function ProductReviews({ productId }) {
  const mainColor = useThemeColors();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeStarFilter, setActiveStarFilter] = useState(0);
  const [hasImages, setHasImages] = useState(false);
  const [stats, setStats] = useState({
    average: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  // Fetch reviews and stats when component mounts or filters change
  useEffect(() => {
    console.log("Effect triggered with filters:", { activeStarFilter, hasImages, activeFilter });
    fetchReviews();
  }, [productId, currentPage, activeStarFilter, hasImages, activeFilter]);

  // Fetch stats only once when component mounts
  useEffect(() => {
    fetchReviewStats();
  }, [productId]);

  const fetchReviewStats = async () => {
    try {
      // This would ideally be a separate API endpoint for stats
      // For now, we'll use the first page of reviews to calculate stats
      const { data } = await request.get(`/reviews/product/${productId}?pageSize=100&pageNumber=1`);
      
      if (data?.data?.items) {
        const reviews = data.data.items;
        const totalReviews = data.data.totalCount || reviews.length;
        
        if (totalReviews > 0) {
          // Calculate average rating
          const sum = reviews.reduce((acc, review) => acc + review.ratingValue, 0);
          const average = sum / reviews.length;
          
          // Calculate distribution
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          reviews.forEach(review => {
            const rating = Math.floor(review.ratingValue);
            if (distribution[rating] !== undefined) {
              distribution[rating]++;
            }
          });
          
          setStats({
            average: average.toFixed(1),
            distribution
          });
        }
      }
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('pageSize', pageSize);
      params.append('pageNumber', currentPage);
      
      // Sử dụng ratingFilter thay vì ratingValue/rating
      if (activeStarFilter > 0) {
        params.append('ratingFilter', activeStarFilter);
      }
      
      // Add image filter if active
      if (hasImages) {
        params.append('hasImages', 'true');
      }
      
      const url = `/reviews/product/${productId}?${params.toString()}`;
      console.log("Fetching reviews with URL:", url);
      
      const { data } = await request.get(url);
      
      if (data?.data) {
        console.log("Reviews response:", data.data);
        setReviews(data.data.items || []);
        setTotalCount(data.data.totalCount || 0);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleStarFilter = (star) => {
    console.log("Star filter clicked:", star, "Current filter:", activeStarFilter);
    
    if (activeStarFilter === star) {
      // Clear filter if clicking the same star
      setActiveStarFilter(0);
      setActiveFilter("all");
      console.log("Clearing star filter");
    } else {
      // Set new filter
      setActiveStarFilter(star);
      setActiveFilter("star");
      console.log("Setting star filter to:", star);
    }
    
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  const handleAllFilter = () => {
    console.log("All filter clicked");
    setActiveStarFilter(0);
    setHasImages(false);
    setCurrentPage(1);
    setActiveFilter("all");
  };

  const handleHasCommentsFilter = () => {
    console.log("Comments filter clicked");
    setActiveFilter("comments");
    setCurrentPage(1);
    // In this implementation, all reviews have comments, so no additional filtering needed
  };

  const handleHasImagesFilter = () => {
    console.log("Images filter clicked, current state:", hasImages);
    setHasImages(!hasImages);
    setCurrentPage(1);
    setActiveFilter(hasImages ? "all" : "images");
  };

  return (
    <section className="product-reviews-section bg-neutral-50 py-5">
      <div className="container">
        <Paper elevation={0} className="p-4 rounded-lg mb-4">
          <Typography variant="h5" component="h2" className="font-medium mb-4 text-neutral-800">
            ĐÁNH GIÁ SẢN PHẨM
          </Typography>
          
          {/* Rating Summary */}
          <div className="rating-summary mb-4 p-4 bg-neutral-50 rounded-lg">
            <div className="d-flex align-items-center mb-3">
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold', 
                  marginRight: '8px',
                  color: mainColor.primary
                }}
              >
                {stats.average}
              </Typography>
              <div className="d-flex flex-column">
                <div className="d-flex mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star} 
                      sx={{ 
                        color: star <= Math.round(stats.average) ? mainColor.primary : '#e0e0e0', 
                        fontSize: '20px' 
                      }} 
                    />
                  ))}
                </div>
                <Typography variant="body2" component="div" className="text-neutral-600">
                  trên 5
                </Typography>
              </div>
            </div>
            
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Button 
                variant={activeFilter === "all" ? "contained" : "outlined"}
                className="rounded-full px-4 py-1"
                onClick={handleAllFilter}
                sx={{ 
                  borderColor: '#e5e7eb',
                  backgroundColor: activeFilter === "all" ? mainColor.primary : 'transparent',
                  color: activeFilter === "all" ? '#fff' : mainColor.text,
                  '&:hover': {
                    backgroundColor: activeFilter === "all" ? mainColor.primaryDark : '#f9fafb',
                    borderColor: activeFilter === "all" ? mainColor.primaryDark : '#d1d5db',
                  }
                }}
              >
                Tất Cả
              </Button>
              
              {[5, 4, 3, 2, 1].map(star => (
                <Button 
                  key={star}
                  variant={(activeFilter === "star" && activeStarFilter === star) ? "contained" : "outlined"}
                  className="rounded-full px-3 py-1"
                  onClick={() => handleStarFilter(star)}
                  sx={{ 
                    borderColor: '#e5e7eb',
                    backgroundColor: (activeFilter === "star" && activeStarFilter === star) ? mainColor.primary : 'transparent',
                    color: (activeFilter === "star" && activeStarFilter === star) ? '#fff' : mainColor.text,
                    '&:hover': {
                      backgroundColor: (activeFilter === "star" && activeStarFilter === star) ? mainColor.primaryDark : '#f9fafb',
                      borderColor: (activeFilter === "star" && activeStarFilter === star) ? mainColor.primaryDark : '#d1d5db',
                    }
                  }}
                >
                  {star} Sao ({stats.distribution[star] || 0})
                </Button>
              ))}
            </div>
            
            <div className="d-flex gap-2">
              <Button 
                variant={activeFilter === "comments" ? "contained" : "outlined"}
                className="rounded-full px-4 py-1"
                onClick={handleHasCommentsFilter}
                sx={{ 
                  borderColor: '#e5e7eb',
                  backgroundColor: activeFilter === "comments" ? mainColor.primary : 'transparent',
                  color: activeFilter === "comments" ? '#fff' : mainColor.text,
                  '&:hover': {
                    backgroundColor: activeFilter === "comments" ? mainColor.primaryDark : '#f9fafb',
                    borderColor: activeFilter === "comments" ? mainColor.primaryDark : '#d1d5db',
                  }
                }}
              >
                Có Bình Luận ({totalCount})
              </Button>
              
              <Button 
                variant={activeFilter === "images" ? "contained" : "outlined"}
                className="rounded-full px-4 py-1"
                onClick={handleHasImagesFilter}
                sx={{ 
                  borderColor: '#e5e7eb',
                  backgroundColor: activeFilter === "images" ? mainColor.primary : 'transparent',
                  color: activeFilter === "images" ? '#fff' : mainColor.text,
                  '&:hover': {
                    backgroundColor: activeFilter === "images" ? mainColor.primaryDark : '#f9fafb',
                    borderColor: activeFilter === "images" ? mainColor.primaryDark : '#d1d5db',
                  }
                }}
              >
                Có Hình Ảnh / Video
              </Button>
            </div>
          </div>
          
          {/* Debug Info - Remove in production */}
          <div className="debug-info mb-3 p-2 bg-gray-100 rounded text-xs" style={{ display: 'none' }}>
            <div>Active Filter: {activeFilter}</div>
            <div>Star Filter: {activeStarFilter}</div>
            <div>Has Images: {hasImages ? 'Yes' : 'No'}</div>
            <div>Current Page: {currentPage}</div>
            <div>Total Pages: {totalPages}</div>
          </div>
          
          {/* Reviews List */}
          <div className="reviews-list">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Paper 
                  key={review.id} 
                  elevation={0} 
                  className="review-card p-4 mb-3 border border-neutral-200 rounded-lg"
                >
                  <div className="review-header d-flex items-start mb-3">
                    <img
                      src={review.avatarUrl || defaultUserImage}
                      alt={`${review.userName}'s avatar`}
                      className="avatar w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div className="user-info">
                      <div className="user-name font-medium text-neutral-800 fs-15 mb-1">
                        {review.userName}
                      </div>
                      <div className="d-flex align-items-center">
                        <Rating number={review.ratingValue} />
                        <span className="text-muted fs-13 text-neutral-500 ml-2">
                          {dayjs(review.lastUpdatedTime).format("YYYY-MM-DD HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Variation Options */}
                  {review.variationOptionValues && review.variationOptionValues.length > 0 && (
                    <div className="review-details mb-3">
                      <div className="d-flex flex-wrap mb-2">
                        <Typography variant="body2" className="text-neutral-600 fs-14">
                          <span className="font-medium">Phân loại hàng:</span> {review.variationOptionValues.join(", ")}
                        </Typography>
                      </div>
                    </div>
                  )}
                  
                  <div className="review-content">
                    <Typography variant="body1" className="text-neutral-700 fs-15 mb-3">
                      {review.comment}
                    </Typography>
                    
                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div className="review-images d-flex flex-wrap gap-2 mb-3">
                        {review.reviewImages.map((image, index) => (
                          <div key={index} className="review-image-container" style={{ width: '80px', height: '80px' }}>
                            <img
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="review-image w-100 h-100 object-cover rounded"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Shop Reply */}
                    {review.reply && (
                      <div className="shop-reply mt-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="d-flex items-start">
                          <div className="shop-info">
                            <div className="shop-name font-medium text-neutral-800 fs-14 mb-1">
                              <span style={{ color: mainColor.primary }}>Shop</span> {review.reply.userName}
                            </div>
                            <Typography variant="body2" className="text-neutral-700 fs-14">
                              {review.reply.replyContent}
                            </Typography>
                            <div className="text-muted fs-12 text-neutral-500 mt-1">
                              {dayjs(review.reply.lastUpdatedTime).format("YYYY-MM-DD HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Paper>
              ))
            ) : (
              <Typography variant="body1" className="text-center text-neutral-500 py-4">
                Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
              </Typography>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                  sx={{
                    '& .MuiPaginationItem-root.Mui-selected': {
                      backgroundColor: mainColor.primary,
                      color: '#fff'
                    }
                  }}
                  shape="rounded"
                />
              </div>
            )}
          </div>
        </Paper>
      </div>
    </section>
  );
} 