"use client";
import { Box, Typography } from '@mui/material';
import { skincareColors } from "@/context/ThemeContext";

export default function ReviewHeader() {
  return (
    <div style={{ backgroundColor: '#4ECDC4' }}>
      <div className="container-full">
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 4
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              fontWeight: 500,
              color: '#212529',
              fontFamily: '"Playfair Display", serif',
              position: 'relative',
              display: 'inline-block',
              pb: 2,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 60,
                height: 2,
                backgroundColor: '#212529',
                opacity: 0.7
              }
            }}
          >
            My Reviews
          </Typography>
        </Box>
      </div>
    </div>
  );
}