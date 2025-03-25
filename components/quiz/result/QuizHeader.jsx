"use client";
import { Typography, Box, Button, Container, Paper } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import { keyframes } from '@emotion/react';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Link from "next/link";

export default function QuizHeader({ quizInfo, handlePrint, handleShare }) {
  const mainColor = useThemeColors();
  
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

  return (
    <>
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
    </>
  );
} 