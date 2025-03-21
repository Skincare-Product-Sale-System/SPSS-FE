"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import request from "@/utils/axios";
import { useThemeColors } from "@/context/ThemeContext";
import { Typography, Box, Button, Chip, Divider, Paper, Grid, Card, CardContent, CardMedia, Container } from "@mui/material";
import { formatPrice } from "@/utils/priceFormatter";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

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

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-12">
        <Box className="flex justify-center items-center" sx={{ minHeight: '50vh' }}>
          <Typography>Loading...</Typography>
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
        className="bg-white p-6 rounded-lg w-full mx-auto"
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${mainColor.lightGrey}`,
          maxWidth: '1000px'
        }}
      >
        <Box className="flex justify-between items-center mb-6">
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 600, 
              color: skinTypeNameColor,
              fontSize: '1.5rem'
            }}
          >
            Kết Quả {quizInfo?.name || "Quiz"}
          </Typography>
          <Link href="/quiz">
            <Button
              sx={{ 
                minWidth: 'auto', 
                color: mainColor.primary,
                '&:hover': { color: mainColor.primaryDark }
              }}
            >
              Quay lại các bài kiểm tra
            </Button>
          </Link>
        </Box>

        {quizResult && (
          <>
            <Box className="text-center mb-6">
              <Box 
                className="flex justify-center items-center mb-4 mx-auto"
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  backgroundColor: `${mainColor.lightPrimary}`,
                  color: mainColor.primary
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: skinTypeNameColor,
                  fontSize: '1.75rem'
                }}
              >
                {quizResult.name}
              </Typography>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  backgroundColor: mainColor.lightGrey,
                  borderRadius: 2,
                  mb: 3
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: mainColor.text,
                    whiteSpace: 'pre-line',
                    textAlign: 'left'
                  }}
                >
                  {quizResult.description}
                </Typography>
              </Paper>
            </Box>

            {routineSteps.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    color: skinTypeNameColor,
                    textAlign: 'center',
                    fontSize: '1.5rem'
                  }}
                >
                  Quy Trình Chăm Sóc Da Của Bạn
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  {routineSteps.map((step, index) => (
                    <Paper 
                      key={index} 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        mb: 3, 
                        borderRadius: 2,
                        border: `1px solid ${mainColor.lightGrey}`,
                        backgroundColor: index % 2 === 0 ? mainColor.lightGrey : 'white'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography 
                            variant="h6" 
                            component="h4" 
                            sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              color: skinTypeNameColor,
                              fontSize: '1.25rem'
                            }}
                          >
                            {step.stepName}
                          </Typography>
                          
                          <Link 
                            href={`/products?categoryId=${step.category.id}&skinTypeId=${quizResult.skinTypeId}`}
                            passHref
                          >
                            <Chip 
                              label={step.category.categoryName} 
                              size="small" 
                              icon={<ShoppingBagOutlinedIcon />}
                              clickable
                              sx={{ 
                                mb: 2,
                                backgroundColor: mainColor.lightGrey,
                                color: skinTypeNameColor,
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: mainColor.primary,
                                  color: 'white'
                                },
                                cursor: 'pointer'
                              }} 
                            />
                          </Link>
                        </Box>
                        
                        <Button
                          component={Link}
                          href={`/products?categoryId=${step.category.id}&skinTypeId=${quizResult.skinTypeId}`}
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          sx={{ 
                            borderColor: skinTypeNameColor,
                            color: skinTypeNameColor,
                            fontWeight: 600,
                            '&:hover': {
                              backgroundColor: skinTypeNameColor,
                              color: 'white',
                              borderColor: skinTypeNameColor
                            }
                          }}
                        >
                          Xem tất cả
                        </Button>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 3,
                          color: mainColor.text,
                          whiteSpace: 'pre-line'
                        }}
                      >
                        {step.instruction}
                      </Typography>
                      
                      {step.products && step.products.length > 0 && (
                        <>
                          <Divider sx={{ mb: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 700,
                                mb: 2,
                                color: skinTypeNameColor,
                                fontSize: '1.1rem'
                              }}
                            >
                              Sản phẩm đề xuất:
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={2}>
                            {step.products.map((product, idx) => (
                              <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Link 
                                  href={`/product-detail/${product.id}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <Card 
                                    sx={{ 
                                      height: '100%',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      boxShadow: 'none',
                                      border: `1px solid ${mainColor.lightGrey}`,
                                      borderRadius: 2,
                                      transition: 'transform 0.3s, box-shadow 0.3s',
                                      '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                      }
                                    }}
                                  >
                                    <CardMedia
                                      component="img"
                                      height="140"
                                      image={product.thumbnail || "/images/products/placeholder.jpg"}
                                      alt={product.name}
                                      sx={{ objectFit: 'contain', p: 1 }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
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
                                      <Typography 
                                        variant="h6" 
                                        component="div"
                                        sx={{ 
                                          fontWeight: 700,
                                          color: skinTypeNameColor,
                                          fontSize: '1.1rem'
                                        }}
                                      >
                                        {formatPrice(product.price)}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}

        <Box className="flex justify-center mt-6">
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
            Làm Bài Kiểm Tra Khác
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 