import React from 'react';
import { Button } from "@mui/material";
import PaymentIcon from '@mui/icons-material/Payment';

export default function ActionButtons({ 
  order, 
  mainColor, 
  handleOpenCancelDialog, 
  handleOpenPaymentDialog,
  handlePayNow,
  paymentMethods,
  paymentMethodId
}) {
  if (!(order.status === "Processing" || order.status === "Awaiting Payment")) {
    return null;
  }

  // Tìm phương thức thanh toán để kiểm tra xem có phải COD không
  const paymentMethod = paymentMethods?.find(m => m.id === order.paymentMethodId);
  const isCOD = paymentMethod?.paymentType === "COD";

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
          {!isCOD && (
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
          )}
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