"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Paper, Typography, Button } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

// Loading component for order ID
const OrderIdLoading = () => (
  <div className="container text-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
  </div>
);

// Component that safely uses searchParams
const OrderIdComponent = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  
  return (
    <Box sx={{ mt: 3}}>
      <Button
        component="a"
        href={`/order-details?id=${orderId}`}
        variant="contained"
        fullWidth
        sx={{ 
          mb: 2, 
          py: 1.5, 
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          },
          fontWeight: 'bold',
          fontFamily: '"Roboto", sans-serif'
        }}
      >
        Theo dõi đơn hàng
      </Button>
      
      <Button
        component={Link}
        href="/products"
        variant="outlined"
        fullWidth
        sx={{ 
          py: 1.5, 
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: `${theme.palette.primary.main}15`
          },
          fontWeight: 'bold',
          fontFamily: '"Roboto", sans-serif'
        }}
      >
        Tiếp tục mua sắm
      </Button>
    </Box>
  );
};

export default function PaymentSuccessContent() {
  const theme = useTheme();
  
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <Paper 
              elevation={2} 
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                borderRadius: 2
              }}
            >
              <Box 
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <CheckCircle 
                  sx={{ 
                    fontSize: 80, 
                    color: theme.palette.success.main
                  }} 
                />
              </Box>
              
              <Typography 
                variant="h5" 
                color="success.main" 
                gutterBottom
                fontWeight="bold"
                fontFamily='"Playfair Display", serif'
              >
                Đặt hàng thành công
              </Typography>
              
              <Typography 
                variant="h4" 
                gutterBottom
                fontWeight="semibold"
                fontFamily='"Playfair Display", serif'
              >
                Cảm ơn bạn đã mua hàng!
              </Typography>
              
              <Typography 
                variant="body1" 
                gutterBottom
                fontSize="18px"
                fontFamily='"Roboto", sans-serif'
                sx={{ mb: 3 }}
              >
                Đơn hàng của bạn đang được xử lý
              </Typography>

              <Suspense fallback={<OrderIdLoading />}>
                <OrderIdComponent />
              </Suspense>
            </Paper>
          </div>
        </div>
      </div>
    </section>
  );
} 