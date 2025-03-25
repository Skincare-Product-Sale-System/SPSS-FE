import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Image
} from "@mui/material";
import ProductReviewModal from "@/components/ui/shared/ProductReviewModal";

export default function OrderDialogs({
  openCancelDialog,
  handleCloseCancelDialog,
  selectedReason,
  setCancelReason,
  reasons,
  handleCancelOrder,
  mainColor,
  
  reviewModalOpen,
  handleCloseReviewModal,
  selectedProduct,
  order,
  fetchOrderDetails,
  
  openPaymentDialog,
  handleClosePaymentDialog,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentMethodError,
  setPaymentMethodError,
  paymentMethods,
  updatingPayment,
  handleUpdatePaymentMethod
}) {
  return (
    <>
      {/* Cancel Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          {"Hủy Đơn Hàng"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "0.9rem" }}
          >
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <FormControl fullWidth error={!selectedReason}>
          <InputLabel>Lý do hủy</InputLabel>
          <Select
            value={selectedReason}
            onChange={(e) => setCancelReason(e.target.value)}
            label="Lý do hủy"
          >
            {reasons.map((reason) => (
              <MenuItem key={reason.id} value={reason.id}>
                {reason.description}
              </MenuItem>
            ))}
          </Select>
          {!selectedReason && (
            <FormHelperText>Vui lòng chọn lý do hủy đơn hàng</FormHelperText>
          )}
        </FormControl>
        <DialogActions sx={{ padding: "8px 16px" }}>
          <Button
            onClick={handleCloseCancelDialog}
            variant="outlined"
            size="small"
            sx={{
              borderColor: mainColor,
              color: mainColor,
              "&:hover": {
                borderColor: mainColor,
                backgroundColor: `${mainColor}10`,
              },
            }}
          >
            Không, Giữ Đơn Hàng
          </Button>
          <Button
            onClick={handleCancelOrder}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
            disabled={!selectedReason}
          >
            Có, Hủy Đơn Hàng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      {selectedProduct && (
        <ProductReviewModal
          open={reviewModalOpen}
          onClose={handleCloseReviewModal}
          productInfo={selectedProduct}
          orderId={order?.id}
          onSubmitSuccess={fetchOrderDetails}
        />
      )}

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => !updatingPayment && handleClosePaymentDialog()}
        aria-labelledby="payment-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="payment-dialog-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          Thay đổi phương thức thanh toán
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.9rem", mb: 2 }}>
            Chọn phương thức thanh toán bạn muốn sử dụng cho đơn hàng này.
          </DialogContentText>
          
          <FormControl 
            fullWidth 
            error={!!paymentMethodError}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            <InputLabel id="payment-method-label">Phương thức thanh toán</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method-select"
              value={selectedPaymentMethod}
              onChange={(e) => {
                setSelectedPaymentMethod(e.target.value);
                setPaymentMethodError("");
              }}
              label="Phương thức thanh toán"
              disabled={updatingPayment}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  <div className="flex items-center gap-2">
                    {method.imageUrl && (
                      <img 
                        src={method.imageUrl} 
                        alt={method.paymentType}
                        width={24} 
                        height={24}
                        className="object-contain rounded"
                      />
                    )}
                    <span>{method.paymentType}</span>
                  </div>
                </MenuItem>
              ))}
            </Select>
            {paymentMethodError && <FormHelperText>{paymentMethodError}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "8px 16px" }}>
          <Button
            onClick={handleClosePaymentDialog}
            variant="outlined"
            size="small"
            disabled={updatingPayment}
            sx={{
              borderColor: "#9e9e9e",
              color: "#757575",
              "&:hover": {
                borderColor: "#757575",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdatePaymentMethod}
            variant="contained"
            size="small"
            disabled={updatingPayment}
            sx={{
              backgroundColor: mainColor,
              color: "white",
              "&:hover": {
                backgroundColor: `${mainColor}dd`,
              },
            }}
          >
            {updatingPayment ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 