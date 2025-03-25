"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Paper, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTheme } from "@mui/material/styles";

// Loading component for Order ID
const OrderIdLoading = () => (
  <div className="container text-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
  </div>
);

// Component that safely uses searchParams
const OrderIdComponent = () => {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  
  return (
    <Box sx={{ mt: 3 }}>
      <Button
        component="a"
        href={`/my-account-orders-details?id=${orderId}`}
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

export default function PaymentFailureContent() {
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
                <ErrorOutlineIcon 
                  sx={{ 
                    fontSize: 80, 
                    color: theme.palette.error.main
                  }} 
                />
              </Box>
              
              <Typography 
                variant="h5" 
                color="error.main" 
                gutterBottom
                fontWeight="bold"
                fontFamily='"Playfair Display", serif'
              >
                Thanh Toán Thất Bại
              </Typography>
              
              <Typography 
                variant="h4" 
                gutterBottom
                fontWeight="semibold"
                fontFamily='"Playfair Display", serif'
              >
                Đã xảy ra lỗi trong quá trình thanh toán
              </Typography>
              
              <Typography 
                variant="body1" 
                gutterBottom
                fontSize="18px"
                fontFamily='"Roboto", sans-serif'
                sx={{ mb: 3 }}
              >
                Chúng tôi không thể xử lý thanh toán của bạn. Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.
              </Typography>

              <Suspense fallback={<OrderIdLoading />}>
                <OrderIdComponent />
              </Suspense>
              
              <Typography 
                variant="body2" 
                sx={{ mt: 4 }}
                fontFamily='"Roboto", sans-serif'
              >
                Bạn cần hỗ trợ?{" "}
                <Link 
                  href="/contact"
                  style={{ 
                    color: theme.palette.primary.main, 
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Liên hệ hỗ trợ
                </Link>
              </Typography>
            </Paper>
          </div>
        </div>
      </div>
    </section>
  );
} 