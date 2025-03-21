"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import request from "@/utils/axios";
import { useThemeColors } from "@/context/ThemeContext";
import { Typography, Box, Button, Chip, Divider, Paper, Grid, Card, CardContent, CardMedia, Container, CircularProgress, Stepper, Step, StepLabel, StepContent, Avatar } from "@mui/material";
import { formatPrice } from "@/utils/priceFormatter";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { keyframes } from '@emotion/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

export default function QuizResultPage() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const score = searchParams.get("score");
  
  const mainColor = useThemeColors();
  const [quizResult, setQuizResult] = useState(null);
  const [routineSteps, setRoutineSteps] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy màu từ SkinTypeName để sử dụng cho các phần khác
  const skinTypeNameColor = mainColor.text;

  // Animation cho phần hiển thị kết quả
  const fadeIn = keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  useEffect(() => {
    if (!quizId || !score) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    // Lấy thông tin quiz
    request.get(`/quiz-sets/${quizId}`)
      .then(({ data }) => {
        if (data?.data) {
          setQuizInfo(data.data);
        }
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin quiz:", error);
      });
    
    // Lấy kết quả quiz sử dụng API by-point-and-set
    request.get(`/quiz-results/by-point-and-set?score=${score}&quizSetId=${quizId}`)
      .then(({ data }) => {
        if (data?.data) {
          setQuizResult(data.data);
          
          // Sắp xếp các bước theo thứ tự
          if (data.data.routine && Array.isArray(data.data.routine)) {
            const sortedRoutine = [...data.data.routine].sort((a, b) => a.order - b.order);
            setRoutineSteps(sortedRoutine);
          }
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy kết quả quiz:", error);
        setLoading(false);
      });
  }, [quizId, score]);

  // Hàm in kết quả
  const handlePrint = () => {
    window.print();
  };

  // Hàm chia sẻ kết quả
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Kết quả ${quizInfo?.name || "Quiz"} - Skincede`,
        text: `Kết quả ${quizInfo?.name || "Quiz"} của tôi: ${quizResult?.name || ""}`,
        url: window.location.href,
      }).catch((error) => console.log('Lỗi khi chia sẻ:', error));
    }
  };

  // Thêm component để hiển thị sản phẩm trong carousel
  const ProductCarousel = ({ products, index, mainColor }) => {
    return (
      <Box className="hover-sw-2 hover-sw-nav" sx={{ mt: 3, position: 'relative' }}>
        <Swiper
          dir="ltr"
          modules={[Navigation]}
          navigation={{
            prevEl: `.snmpn-${index}`,
            nextEl: `.snmnn-${index}`,
          }}
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 20,
            }
          }}
          className="swiper tf-product-header wrap-sw-over"
        >
          {products.map((product, idx) => (
            <SwiperSlide key={idx} className="swiper-slide">
              <Link 
                href={`/product-detail/${product.id}`}
                style={{ textDecoration: 'none' }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 3px 15px rgba(0,0,0,0.05)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${mainColor.lightGrey}`,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.thumbnail || "/images/products/placeholder.jpg"}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'contain', 
                      p: 2,
                      backgroundColor: 'white'
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 2.5,
                    backgroundColor: 'white'
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      component="div"
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                        height: 48,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        height: 60,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="h6" 
                        component="div"
                        sx={{ 
                          fontWeight: 700,
                          color: mainColor.primary,
                          fontSize: '1.1rem'
                        }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Chip 
                        label="Xem chi tiết" 
                        size="small"
                        sx={{ 
                          backgroundColor: 'white',
                          border: `1px solid ${mainColor.primary}`,
                          color: mainColor.primary,
                          '&:hover': {
                            backgroundColor: mainColor.primary,
                            color: 'white'
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div 
          className={`nav-next-slider nav-sw box-icon round snmpn-${index} w_46`}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '-15px',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: `1px solid ${mainColor.lightGrey}`,
            color: mainColor.darkGrey,
            cursor: 'pointer',
            zIndex: 9,
            transition: 'all 0.3s ease'
          }}
        >
          <span 
            className="icon icon-arrow-left" 
            style={{ 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center' 
            }} 
          />
        </div>
        
        <div 
          className={`nav-prev-slider nav-sw box-icon round snmnn-${index} w_46`}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '-15px',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: `1px solid ${mainColor.lightGrey}`,
            color: mainColor.darkGrey,
            cursor: 'pointer',
            zIndex: 9,
            transition: 'all 0.3s ease'
          }}
        >
          <span 
            className="icon icon-arrow-right" 
            style={{ 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          />
        </div>
        
        <style jsx global>{`
          .snmpn-${index}:hover, .snmnn-${index}:hover {
            background-color: ${mainColor.primary} !important;
            color: white !important;
            border-color: ${mainColor.primary} !important;
          }
        `}</style>
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Box className="flex justify-center items-center flex-col" sx={{ minHeight: '50vh' }}>
          <CircularProgress size={60} sx={{ color: mainColor.primary, mb: 3 }} />
          <Typography sx={{ color: mainColor.text, fontWeight: 500 }}>
            Đang tải kết quả...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!quizResult) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Box className="flex justify-center items-center flex-col" sx={{ minHeight: '50vh' }}>
          <Typography variant="h5" sx={{ mb: 3, color: mainColor.text }}>
            Không tìm thấy kết quả quiz
          </Typography>
          <Button
            component={Link}
            href="/quiz"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: skinTypeNameColor,
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: mainColor.primaryDark || '#333',
              }
            }}
          >
            Quay lại bài kiểm tra
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-12">
      <Paper 
        elevation={3} 
        className="bg-white p-6 md:p-8 rounded-lg w-full mx-auto"
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${mainColor.lightGrey}`,
          maxWidth: '1300px',
          position: 'relative',
          overflow: 'hidden',
          '@media print': {
            boxShadow: 'none',
            padding: '0.5cm',
          }
        }}
      >
        {/* Banner trang trí ở đầu trang */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: '8px', 
            background: `linear-gradient(90deg, ${mainColor.primary} 0%, ${mainColor.secondary || mainColor.lightPrimary} 100%)` 
          }} 
        />

        <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-2" sx={{ animation: `${fadeIn} 0.5s ease` }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: mainColor.primary,
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontFamily: 'Playfair Display, serif',
              mb: { xs: 2, md: 0 }
            }}
          >
            Kết Quả {quizInfo?.name || "Quiz"}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handlePrint}
              variant="outlined"
              startIcon={<PrintIcon />}
              size="small"
              sx={{ 
                borderColor: mainColor.lightGrey,
                color: mainColor.darkGrey,
                '&:hover': { borderColor: mainColor.primary, color: mainColor.primary },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              In kết quả
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outlined"
              startIcon={<ShareIcon />}
              size="small"
              sx={{ 
                borderColor: mainColor.lightGrey,
                color: mainColor.darkGrey,
                '&:hover': { borderColor: mainColor.primary, color: mainColor.primary },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Chia sẻ
            </Button>
            
            <Button
              component={Link}
              href="/quiz"
              variant="text"
              sx={{ 
                color: mainColor.primary,
                '&:hover': { color: mainColor.primaryDark },
                fontWeight: 500
              }}
            >
              Quay lại
            </Button>
          </Box>
        </Box>

        {quizResult && (
          <>
            <Box 
              className="text-center mb-8" 
              sx={{ 
                animation: `${fadeIn} 0.7s ease`,
                background: `linear-gradient(to bottom, ${mainColor.lightPrimary}20, transparent)`,
                borderRadius: 4,
                p: { xs: 3, md: 5 },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: mainColor.white,
                  color: mainColor.primary,
                  mb: 3,
                  mx: 'auto',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 60 }} />
              </Avatar>
              
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: mainColor.text,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  fontFamily: 'Playfair Display, serif'
                }}
              >
                {quizResult.name}
              </Typography>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, md: 4 }, 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  mb: 3,
                  maxWidth: '800px',
                  mx: 'auto',
                  border: `1px solid ${mainColor.lightGrey}`
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: mainColor.text,
                    whiteSpace: 'pre-line',
                    textAlign: 'left',
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif'
                  }}
                >
                  {quizResult.description}
                </Typography>
              </Paper>
            </Box>

            {routineSteps.length > 0 && (
              <Box sx={{ mb: 6, animation: `${fadeIn} 0.9s ease` }}>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 4,
                    color: mainColor.text,
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    fontFamily: 'Playfair Display, serif',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '3px',
                      backgroundColor: mainColor.primary,
                      borderRadius: '2px'
                    }
                  }}
                >
                  Quy Trình Chăm Sóc Da Của Bạn
                </Typography>
                
                <Stepper orientation="vertical" sx={{ mt: 6 }}>
                  {routineSteps.map((step, index) => (
                    <Step key={index} active={true}>
                      <StepLabel 
                        StepIconProps={{ 
                          sx: { 
                            color: mainColor.primary,
                            '& .MuiStepIcon-text': { fill: 'white' }
                          } 
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600, 
                            color: mainColor.text,
                            fontSize: '1.25rem',
                            fontFamily: 'Playfair Display, serif'
                          }}
                        >
                          {step.stepName}
                        </Typography>
                      </StepLabel>
                      
                      <StepContent>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Link 
                              href={`/products?categoryId=${step.category.id}&skinTypeId=${quizResult.skinTypeId}`}
                              passHref
                            >
                              <Chip 
                                label={step.category.categoryName} 
                                size="medium" 
                                icon={<ShoppingBagOutlinedIcon />}
                                clickable
                                sx={{ 
                                  backgroundColor: mainColor.lightPrimary,
                                  color: mainColor.primary,
                                  fontWeight: 600,
                                  py: 0.5,
                                  '&:hover': {
                                    backgroundColor: mainColor.primary,
                                    color: 'white'
                                  },
                                  cursor: 'pointer'
                                }} 
                              />
                            </Link>
                            
                            <Button
                              component={Link}
                              href={`/products?categoryId=${step.category.id}&skinTypeId=${quizResult.skinTypeId}`}
                              variant="text"
                              endIcon={<ArrowForwardIcon />}
                              sx={{ 
                                color: mainColor.primary,
                                fontWeight: 500,
                                ml: 2,
                                '&:hover': {
                                  color: mainColor.primaryDark,
                                  backgroundColor: 'transparent'
                                }
                              }}
                            >
                              Xem tất cả sản phẩm
                            </Button>
                          </Box>
                          
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              mb: 3,
                              color: mainColor.text,
                              whiteSpace: 'pre-line',
                              lineHeight: 1.7,
                              fontSize: '1rem',
                              fontFamily: 'Roboto, sans-serif',
                              backgroundColor: 'white',
                              p: 2,
                              borderRadius: 2,
                              border: `1px solid ${mainColor.lightGrey}`
                            }}
                          >
                            {step.instruction}
                          </Typography>
                          
                          {step.products && step.products.length > 0 && (
                            <>
                              <Divider sx={{ mb: 3, mt: 1 }} />
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <LocalMallIcon sx={{ color: mainColor.primary, mr: 1 }} />
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: mainColor.text,
                                    fontSize: '1.1rem'
                                  }}
                                >
                                  Sản phẩm đề xuất
                                </Typography>
                              </Box>
                              
                              <ProductCarousel products={step.products} index={index} mainColor={mainColor} />
                            </>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
          </>
        )}

        <Box className="flex justify-center mt-8" sx={{ animation: `${fadeIn} 1.1s ease` }}>
          <Button
            component={Link}
            href="/quiz"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              backgroundColor: mainColor.primary,
              color: 'white',
              fontWeight: 600,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: mainColor.primaryDark || '#333',
                boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
              }
            }}
          >
            Làm Bài Kiểm Tra Khác
          </Button>
        </Box>

        {/* Footer của trang kết quả */}
        <Box sx={{ 
          mt: 8, 
          pt: 3, 
          borderTop: `1px solid ${mainColor.lightGrey}`,
          textAlign: 'center',
          animation: `${fadeIn} 1.3s ease`,
          '@media print': {
            display: 'none'
          }
        }}>
          <Typography variant="body2" sx={{ color: mainColor.darkGrey }}>
            © {new Date().getFullYear()} Skincede. Kết quả này được tạo dựa trên câu trả lời của bạn.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
} 