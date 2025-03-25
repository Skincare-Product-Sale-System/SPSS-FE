"use client";
import { Box, Typography, CircularProgress, Container } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

export default function LoadingState() {
  const mainColor = useThemeColors();
  
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