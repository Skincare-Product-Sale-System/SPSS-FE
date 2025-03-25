import React from 'react';
import { Button } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';

export default function ActionButtons({ 
  order, 
  mainColor, 
  handleOpenCancelDialog, 
  handleOpenPaymentDialog,
  handlePayNow 
}) {
  if (!(order.status === "Processing" || order.status === "Awaiting Payment")) {
    return null;
  }

  return (
    <div className="flex justify-end gap-3 mt-4">
      {order.status === "Awaiting Payment" && (
        <>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PaymentIcon />}
            onClick={handleOpenPaymentDialog}
            sx={{
              borderColor: mainColor,
              color: mainColor,
              "&:hover": {
                borderColor: mainColor,
                backgroundColor: `${mainColor}15`,
              },
            }}
          >
            Đổi phương thức
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handlePayNow}
            sx={{
              backgroundColor: mainColor,
              "&:hover": {
                backgroundColor: `${mainColor}dd`,
              },
            }}
          >
            Thanh Toán Ngay
          </Button>
        </>
      )}
      <Button
        onClick={handleOpenCancelDialog}
        variant="contained"
        size="small"
        sx={{
          backgroundColor: "#d32f2f",
          color: "white",
          "&:hover": {
            backgroundColor: "#c62828",
          },
        }}
      >
        Hủy Đơn Hàng
      </Button>
    </div>
  );
} 