import React from "react";
import { Modal, Box, Typography, Grid, IconButton, Paper, Button } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

export default function BankPaymentModal({ open, onClose, order, qrImageUrl }) {
  const [copied, setCopied] = React.useState("");
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
        width: '70vw',
        maxWidth: 900,
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: 6,
        outline: 'none',
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" color="primary" fontWeight="bold" align="center" mb={3}>
          Thanh toán qua ngân hàng (QR)
        </Typography>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2} align="center" fontSize={24}>
                Quét mã QR để thanh toán
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <img src={qrImageUrl} alt="QR thanh toán" style={{ width: 320, height: 320, borderRadius: 16, border: '3px solid #90caf9', background: '#fff', marginBottom: 12 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" mb={3} align="center" fontSize={24}>
                Thông tin chuyển khoản
              </Typography>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Mã đơn hàng:</span>
                <span style={{ fontWeight: 600 }}>{order.orderId}</span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Ngân hàng:</span>
                <span style={{ fontWeight: 600 }}>MB Bank</span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Số tài khoản:</span>
                <span style={{ fontWeight: 600 }}>
                  0352314340
                  <IconButton size="small" onClick={() => handleCopy("0352314340", "stk")}>{copied==="stk" ? <span style={{color:'#1976d2',fontSize:15}}>Đã copy</span> : <ContentCopyIcon fontSize="medium" />}</IconButton>
                </span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Tên tài khoản:</span>
                <span style={{ fontWeight: 600 }}>DANG HO TUAN CUONG</span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Số tiền:</span>
                <span style={{ fontWeight: 600, color: '#d32f2f' }}>{(order.discountedOrderTotal ?? order.orderTotal)?.toLocaleString()} VNĐ
                  <IconButton size="small" onClick={() => handleCopy(order.discountedOrderTotal ?? order.orderTotal, "amount")}>{copied==="amount" ? <span style={{color:'#1976d2',fontSize:15}}>Đã copy</span> : <ContentCopyIcon fontSize="medium" />}</IconButton>
                </span>
              </Box>
              <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" fontSize={18}>
                <span>Nội dung CK:</span>
                <span style={{ fontWeight: 600, color: '#1976d2', fontSize: 18 }}>{order.id}
                  <IconButton size="small" onClick={() => handleCopy(order.id, "nd")}>{copied==="nd" ? <span style={{color:'#1976d2',fontSize:15}}>Đã copy</span> : <ContentCopyIcon fontSize="medium" />}</IconButton>
                </span>
              </Box>
              <Box mt={3} bgcolor="#fffbe6" p={2} borderRadius={2} fontSize={15} color="#b45309">
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