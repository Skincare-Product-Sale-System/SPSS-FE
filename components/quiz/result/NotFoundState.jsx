"use client";
import { Box, Typography, Button, Container } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from "next/link";

export default function NotFoundState() {
  const mainColor = useThemeColors();
  
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
            backgroundColor: mainColor.primary,
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