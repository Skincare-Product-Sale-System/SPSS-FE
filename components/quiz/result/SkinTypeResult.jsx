"use client";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import { keyframes } from '@emotion/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function SkinTypeResult({ quizResult }) {
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
            fontSize: '1.05rem'
          }}
        >
          {quizResult.description}
        </Typography>
      </Paper>
    </Box>
  );
} 