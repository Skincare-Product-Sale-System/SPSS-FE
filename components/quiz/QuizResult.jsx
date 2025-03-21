"use client";
import { useEffect, useState } from "react";
import request from "@/utils/axios";
import { useThemeColors } from "@/context/ThemeContext";
import { Typography, Box, Button, Chip, Divider, Paper, Grid, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import { formatPrice } from "@/utils/priceFormatter";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';

export default function QuizResult({ quiz, answers, onClose }) {
  const mainColor = useThemeColors();
  const [quizResult, setQuizResult] = useState(null);
  const [routineSteps, setRoutineSteps] = useState([]);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Lấy màu từ SkinTypeName để sử dụng cho các phần khác
  const skinTypeNameColor = mainColor.text;

  // Effect để tăng giá trị progress khi đang redirect
  useEffect(() => {
    if (isRedirecting) {
      const timer = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + 4; // Giảm tốc độ tăng xuống (100% / 25 bước = 4% mỗi bước)
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200); // Tăng khoảng thời gian giữa các bước lên 200ms
      
      return () => clearInterval(timer);
    }
  }, [isRedirecting]);

  useEffect(() => {
    const fetchQuizResult = async () => {
      try {
        const score = answers.reduce((a, b) => a + b, 0);
        const { data } = await request.get(
          `/quiz-results/by-point-and-set?score=${score}&quizSetId=${quiz.id}`
        );
        
        if (data?.data) {
          setQuizResult(data.data);
          
          // Sắp xếp các bước theo thứ tự
          if (data.data.routine && Array.isArray(data.data.routine)) {
            const sortedRoutine = [...data.data.routine].sort((a, b) => a.order - b.order);
            setRoutineSteps(sortedRoutine);
          }
          
          // Chuyển hướng đến trang kết quả quiz
          setIsRedirecting(true);
          // Không sử dụng ID của kết quả vì trang kết quả sẽ dùng API by-point-and-set
          setTimeout(() => {
            const url = `/quiz-result?score=${score}&quizId=${quiz.id}`;
            console.log("Redirecting to:", url);
            router.push(url);
          }, 6000); // Tăng thời gian delay lên 5 giây (5000ms)
        }
      } catch (error) {
        console.error("Lỗi khi lấy kết quả quiz:", error);
      }
    };
    
    fetchQuizResult();
  }, [quiz, answers, router]);

  // Animation pulse chậm hơn
  const pulse = keyframes`
    0% {
      transform: scale(0.98);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.02);
      opacity: 1;
    }
    100% {
      transform: scale(0.98);
      opacity: 0.9;
    }
  `;

  // Hiển thị loading nếu đang chuyển hướng
  if (isRedirecting) {
    return (
      <div className="flex bg-black bg-opacity-50 justify-center fixed inset-0 items-center z-[900]">
        <Paper 
          elevation={3} 
          className="bg-white p-8 rounded-lg w-full max-w-md mx-4 text-center"
          sx={{ 
            borderRadius: 2,
            border: `1px solid ${mainColor.lightGrey}`,
            animation: `${pulse} 2.5s infinite ease-in-out` // Tăng thời gian animation pulse
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <CircularProgress
                variant="determinate"
                value={loadingProgress}
                size={80}
                thickness={4}
                sx={{ color: mainColor.primary }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleIcon sx={{ 
                  color: mainColor.primary, 
                  fontSize: 40,
                  opacity: loadingProgress >= 100 ? 1 : 0.5,
                  transition: 'opacity 0.3s ease'
                }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: mainColor.text,
                fontWeight: 600
              }}
            >
              Đang chuẩn bị kết quả của bạn...
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: mainColor.darkGrey,
                mb: 3
              }}
            >
              Chúng tôi đang phân tích câu trả lời và tạo quy trình chăm sóc da phù hợp nhất.
            </Typography>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: 8, 
                backgroundColor: mainColor.lightGrey,
                borderRadius: 4,
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  width: `${loadingProgress}%`, 
                  height: '100%', 
                  backgroundColor: mainColor.primary,
                  borderRadius: 4,
                  transition: 'width 0.5s ease'
                }}
              />
            </Box>
            
            <Typography variant="caption" sx={{ color: mainColor.darkGrey }}>
              {loadingProgress < 100 ? `${loadingProgress}% hoàn thành` : 'Sẵn sàng chuyển trang...'}
            </Typography>
          </Box>
        </Paper>
      </div>
    );
  }
  
  // Trả về null nếu không có kết quả
  return null;
}
