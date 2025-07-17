import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Grid, IconButton, Paper, Button, useMediaQuery, useTheme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

export default function BankPaymentModal({ open, onClose, order, qrImageUrl }) {
  const [copied, setCopied] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!order) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '95vw' : '85vw',
        maxWidth: 900,
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        outline: 'none',
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" color="primary" fontWeight="bold" align="center" mb={3} mt={1}>
          Thanh toán qua ngân hàng (QR)
        </Typography>
        <Grid container spacing={3} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2} align="center" fontSize={{ xs: 18, md: 20 }}>
                Quét mã QR để thanh toán
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    component="img"
                    src={qrImageUrl}
                    alt="QR thanh toán"
                    sx={{
                      width: { xs: '100%', sm: 280 },
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: { xs: 280, sm: 320 },
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '2px solid #90caf9',
                      background: '#fff'
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2} align="center" fontSize={{ xs: 18, md: 20 }}>
                Thông tin chuyển khoản
              </Typography>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Mã đơn hàng:</span>
                <span style={{ fontWeight: 600 }}>{order.orderId}</span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Ngân hàng:</span>
                <span style={{ fontWeight: 600 }}>MB Bank</span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Số tài khoản:</span>
                <Box display="flex" alignItems="center">
                  <Typography fontWeight={600} fontSize={{ xs: 14, md: 16 }}>0352314340</Typography>
                  <IconButton size="small" onClick={() => handleCopy("0352314340", "stk")}>
                    {copied === "stk" ? <span style={{ color: '#1976d2', fontSize: 13 }}>Đã copy</span> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Tên tài khoản:</span>
                <Typography fontWeight={600} fontSize={{ xs: 14, md: 16 }}>DANG HO TUAN CUONG</Typography>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Số tiền:</span>
                <Box display="flex" alignItems="center">
                  <Typography fontWeight={600} color="#d32f2f" fontSize={{ xs: 14, md: 16 }}>
                    {(order.discountedOrderTotal ?? order.orderTotal)?.toLocaleString()} VNĐ
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(order.discountedOrderTotal ?? order.orderTotal, "amount")}>
                    {copied === "amount" ? <span style={{ color: '#1976d2', fontSize: 13 }}>Đã copy</span> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={{ xs: 14, md: 16 }}>
                <span>Nội dung CK:</span>
                <Box display="flex" alignItems="center">
                  <Typography fontWeight={600} color="#1976d2" fontSize={{ xs: 14, md: 16 }}>{order.id}</Typography>
                  <IconButton size="small" onClick={() => handleCopy(order.id, "nd")}>
                    {copied === "nd" ? <span style={{ color: '#1976d2', fontSize: 13 }}>Đã copy</span> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>
              <Box mt={2} bgcolor="#fffbe6" p={2} borderRadius={2} fontSize={{ xs: 13, md: 14 }} color="#b45309">
                <b>Lưu ý:</b> Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống tự động xác nhận đơn hàng.
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box mt={3} textAlign="center">
          <Button variant="contained" color="primary" onClick={onClose} sx={{ minWidth: 120, fontWeight: 600 }}>Đóng</Button>
        </Box>
      </Box>
    </Modal>
  );
} 