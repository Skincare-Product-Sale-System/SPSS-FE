"use client";

import request from "@/utlis/axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Rating from "../common/Rating";
import { defaultProductImage, defaultUserImage } from "@/utlis/default";
import { Box, Typography, Divider, Paper } from "@mui/material";

const tabs = [
  { title: "Description", active: true },
  { title: "Review", active: false },
  { title: "Shipping", active: false },
  { title: "Return Policies", active: false },
];

export default function ShopDetailsTab({ product }) {
  const [currentTab, setCurrentTab] = useState(1);
  const [reviews, setReviews] = useState([]);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    request
      .get(`/reviews/product/${product.id}?pageSize=20`)
      .then(({ data }) => {
        setReviews(data?.data?.items);
      });
  }, []);

  const fetchReviews = async (page) => {
    request
      .get(`/reviews/product/${product.id}?pageSize=20&pageNumber=${page}`)
      .then(({ data }) => {
        setReviews(data?.data?.items);
      });
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [searchParams]);

  // Check if specifications exist
  const specs = product?.specifications || {};

  return (
    <section
      className="flat-spacing-17 pt_0 bg-neutral-50"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Paper elevation={0} className="widget-tabs style-has-border rounded-lg overflow-hidden">
              <Box className="widget-menu-tab" sx={{ 
                display: 'flex', 
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#fff'
              }}>
                {tabs.map((elm, i) => (
                  <Box
                    key={i}
                    onClick={() => setCurrentTab(i + 1)}
                    className={`item-title ${
                      currentTab == i + 1 ? "active" : ""
                    }`}
                    sx={{
                      cursor: 'pointer',
                      padding: '1rem 1.5rem',
                      position: 'relative',
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 500,
                      color: currentTab == i + 1 ? '#4ECDC4' : '#64748b',
                      '&::after': currentTab == i + 1 ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#4ECDC4'
                      } : {}
                    }}
                  >
                    <span className="inner">{elm.title}</span>
                  </Box>
                ))}
              </Box>
              <div className="widget-content-tab bg-white p-6">
                <div
                  className={`widget-content-inner ${
                    currentTab == 1 ? "active" : ""
                  } `}
                >
                  <div className="">
                    {product.description && (
                      <Typography variant="body1" className="mb_30 text-neutral-700">
                        {product.description}
                      </Typography>
                    )}
                    
                    <div className="tf-product-des-demo desc">
                      {(specs.storageInstruction || specs.usageInstruction) && (
                        <div className="right">
                          <Typography variant="h6" className="fs-16 fw-5 font-serif text-primary-800 mb-3">
                            Instruction
                          </Typography>
                          <ul className="space-y-2">
                            {specs.storageInstruction && (
                              <li className="flex items-start">
                                <span className="desc-li font-medium text-neutral-800 mr-2">Storage:</span>{" "}
                                <span className="text-neutral-600">{specs.storageInstruction}</span>
                              </li>
                            )}
                            {specs.usageInstruction && (
                              <li className="flex items-start">
                                <span className="desc-li font-medium text-neutral-800 mr-2">Usage:</span>{" "}
                                <span className="text-neutral-600">{specs.usageInstruction}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {(specs.detailedIngredients || specs.keyActiveIngredients) && (
                        <>
                          {(specs.storageInstruction || specs.usageInstruction) && (
                            <Divider orientation="vertical" flexItem sx={{ mx: 4, display: { xs: 'none', md: 'block' } }} />
                          )}
                          
                          <div className="right">
                            <Typography variant="h6" className="fs-16 fw-5 font-serif text-primary-800 mb-3">
                              Ingredients
                            </Typography>
                            <ul className="mb-0 space-y-2">
                              {specs.detailedIngredients && (
                                <li className="flex items-start">
                                  <span className="desc-li font-medium text-neutral-800 mr-2">
                                    Detailed Ingredients:
                                  </span>{" "}
                                  <span className="text-neutral-600">{specs.detailedIngredients}</span>
                                </li>
                              )}
                              {specs.keyActiveIngredients && (
                                <li className="flex items-start">
                                  <span className="desc-li font-medium text-neutral-800 mr-2">
                                    Key Ingredients:
                                  </span>{" "}
                                  <span className="text-neutral-600">{specs.keyActiveIngredients}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                      
                      {(specs.mainFunction || specs.texture || specs.skinIssues || specs.expiryDate) && (
                        <>
                          {(specs.storageInstruction || specs.usageInstruction || 
                            specs.detailedIngredients || specs.keyActiveIngredients) && (
                            <Divider orientation="vertical" flexItem sx={{ mx: 4, display: { xs: 'none', md: 'block' } }} />
                          )}
                          
                          <div className="left">
                            <Typography variant="h6" className="fs-16 fw-5 font-serif text-primary-800 mb-3">
                              Description
                            </Typography>
                            <div className="space-y-2">
                              <ul className="mb-0">
                                {specs.mainFunction && (
                                  <li className="flex items-start">
                                    <span className="desc-li font-medium text-neutral-800 mr-2">Function:</span>{" "}
                                    <span className="text-neutral-600">{specs.mainFunction}</span>
                                  </li>
                                )}
                                {specs.texture && (
                                  <li className="flex items-start">
                                    <span className="desc-li font-medium text-neutral-800 mr-2">Texture:</span>{" "}
                                    <span className="text-neutral-600">{specs.texture}</span>
                                  </li>
                                )}
                                {specs.skinIssues && (
                                  <li className="flex items-start">
                                    <span className="desc-li font-medium text-neutral-800 mr-2">For Skin Issues:</span>{" "}
                                    <span className="text-neutral-600">{specs.skinIssues}</span>
                                  </li>
                                )}
                                {specs.expiryDate && (
                                  <li className="flex items-start">
                                    <span className="desc-li font-medium text-neutral-800 mr-2">Expiry Date:</span>{" "}
                                    <span className="text-neutral-600">
                                      {dayjs(specs.expiryDate).format("DD/MM/YYYY")}
                                    </span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 2 ? "active" : ""
                  } `}
                >
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Paper 
                        key={review.id} 
                        elevation={0} 
                        className="review-card p-4 mb-4 border border-neutral-200 rounded-lg"
                      >
                        <div className="review-header flex items-start">
                          <img
                            src={review.avatarUrl || defaultUserImage}
                            alt={`${review.userName}'s avatar`}
                            className="avatar w-12 h-12 rounded-full object-cover mr-3"
                          />
                          <div className="user-info">
                            <div className="user-name font-medium text-neutral-800">
                              {review.userName} -{" "}
                              <span className="text-muted fs-12 text-neutral-500">
                                {dayjs(review.createdAt).format("DD/MM/YYYY")}
                              </span>
                            </div>
                            <Rating number={review.ratingValue} />
                          </div>
                        </div>
                        <div className="review-content mt-3">
                          <p className="text-neutral-700">{review.comment}</p>
                          {review.reviewImages && review.reviewImages.length > 0 && (
                            <div className="review-images flex flex-wrap gap-2 mt-3">
                              {review.reviewImages.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="review-image w-16 h-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body1" className="text-center text-neutral-500 py-8">
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 3 ? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <Typography variant="h5" component="div" className="title font-serif text-primary-800 mb-4">
                      Shipping Policy
                    </Typography>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      We strive to deliver your skincare products as quickly and safely as possible. All orders are processed within 1-2 business days after receiving your order confirmation.
                    </Typography>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      Shipping times vary depending on your location:
                    </Typography>
                    <ul className="list-disc pl-5 mb-4 text-neutral-700">
                      <li className="mb-1">Domestic (Vietnam): 1-3 business days</li>
                      <li className="mb-1">International: 7-14 business days</li>
                    </ul>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      For international orders, please note that customs fees may apply depending on your country's regulations. These fees are the responsibility of the customer.
                    </Typography>
                    <Typography variant="body1" className="text-neutral-700">
                      All orders include tracking information that will be sent to your email once your package has been shipped.
                    </Typography>
                  </div>
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 4 ? "active" : ""
                  } `}
                >
                  <div className="tf-page-privacy-policy">
                    <Typography variant="h5" component="div" className="title font-serif text-primary-800 mb-4">
                      Return Policy
                    </Typography>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      We want you to be completely satisfied with your purchase. If you're not happy with your skincare products, we accept returns within 30 days of delivery for a full refund or exchange.
                    </Typography>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      To be eligible for a return, your item must be:
                    </Typography>
                    <ul className="list-disc pl-5 mb-4 text-neutral-700">
                      <li className="mb-1">Unused and in the same condition that you received it</li>
                      <li className="mb-1">In the original packaging</li>
                      <li className="mb-1">Accompanied by the receipt or proof of purchase</li>
                    </ul>
                    <Typography variant="body1" className="mb-3 text-neutral-700">
                      Please note that certain items are non-returnable for hygiene reasons, including opened skincare products, sample sizes, and gift sets.
                    </Typography>
                    <Typography variant="body1" className="text-neutral-700">
                      To initiate a return, please contact our customer service team at returns@skincarestore.com with your order number and reason for return.
                    </Typography>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </section>
  );
}
