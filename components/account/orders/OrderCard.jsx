"use client"
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useThemeColors } from "@/context/ThemeContext";
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';
import useAuthStore from "@/context/authStore";
import toast from "react-hot-toast";
import request from "@/utils/axios";
import { CircularProgress, Chip } from "@mui/material";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BankPaymentModal from "@/components/payment/BankPaymentModal";

export default function OrderCard({ 
  order, 
  onReviewClick, 
  formatCurrency, 
  getStatusColor,
  onPayNow
}) {
  const mainColor = useThemeColors();
  const { isLoggedIn, Id } = useAuthStore();
  const [loading, setLoading] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [openBankModal, setOpenBankModal] = React.useState(false);
  const [qrImageUrl, setQrImageUrl] = React.useState("");
  const [orderBankModal, setOrderBankModal] = React.useState(null);

  // Calculate discount percentage if both originalOrderTotal and discountAmount exist
  const discountPercentage = order.originalOrderTotal && order.discountAmount
    ? Math.round((order.discountAmount / order.originalOrderTotal) * 100)
    : null;

  // Tải phương thức thanh toán nếu trạng thái là Awaiting Payment
  React.useEffect(() => {
    if (order.status?.toLowerCase() === "awaiting payment") {
      fetchPaymentMethods();
    }
  }, [order.status]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await request.get("/payment-methods");
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handlePayNowClick = async () => {
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để thanh toán");
      return;
    }

    if (!Id) {
      toast.error("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại");
      return;
    }

    setLoading(true);
    try {
      // Kiểm tra xem phương thức thanh toán có phải COD không
      const paymentMethod = paymentMethods.find(m => m.id === order.paymentMethodId);
      const isCOD = paymentMethod?.paymentType === "COD";

      if (isCOD) {
        toast.info("Đơn hàng này sử dụng phương thức COD, không cần thanh toán online");
        return;
      }

      if (paymentMethod?.paymentType === "VNPAY") {
        const vnpayRes = await request.get(
          `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=https%3A%2F%2Fspssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net`
        );
        
        if (vnpayRes.status === 200) {
          window.location.href = vnpayRes.data.data;
        } else {
          toast.error("Không thể khởi tạo thanh toán");
        }
      } else if (paymentMethod?.paymentType === "BANK") {
        const bankId = "970422";
        const accountNo = "0352314340";
        const template = "print";
        const amount = (order.discountedOrderTotal ?? order.orderTotal)?.toFixed(0) || (order.discountedOrderTotal ?? order.orderTotal);
        const description = encodeURIComponent(order.id);
        const accountName = encodeURIComponent("DANG HO TUAN CUONG");
        const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
        setOrderBankModal(order);
        setQrImageUrl(qrUrl);
        setOpenBankModal(true);
      } else {
        toast.info(`Đã chọn thanh toán qua ${paymentMethod?.paymentType || "phương thức chưa xác định"}`);
        // Chuyển đến trang chi tiết để có thêm tùy chọn
        window.location.href = `/order-details?id=${order.id}`;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Không thể thực hiện thanh toán, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!openBankModal || !orderBankModal?.id) return;
    const timer = setInterval(async () => {
      try {
        const resp = await request.get(`/orders/${orderBankModal.id}`);
        const status = resp.data.data?.status || resp.data.status;
        if (status && status.toLowerCase().trim() === "processing") {
          setOpenBankModal(false);
          window.location.href = `/payment-success?id=${orderBankModal.id}`;
        }
      } catch {}
    }, 4000);
    return () => clearInterval(timer);
  }, [openBankModal, orderBankModal]);

  return (
    <div className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mb-6 overflow-hidden">
      <div className="flex bg-gray-50 border-b justify-between p-4 items-center">
        <div className="flex items-center">
          <span className="font-medium mr-2">Đơn hàng #{order.id.substring(0, 8)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <span className="text-gray-500">{dayjs(order.createdTime).format("MMM DD, YYYY")}</span>
      </div>
      
      <div className="p-4">
        {order.orderDetails.map((item, index) => (
          <div key={index} className="flex justify-between items-start mb-4 last:mb-0">
            <Link 
              href={`/product-detail?id=${item.productId}`}
              className="flex flex-1 p-2 rounded-lg hover:bg-gray-50 items-center transition-all"
              style={{ textDecoration: 'none' }}
            >
              <div className="h-16 w-16 mr-4">
                {item.productImage && (
                  <img 
                    src={item.productImage} 
                    alt={item.productName} 
                    className="h-full rounded w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.productName}</h4>
                {item.variationOptionValues && item.variationOptionValues.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    {item.variationOptionValues.join(', ')}
                  </p>
                )}
                <p className="text-sm">x{item.quantity}</p>
              </div>
            </Link>
            <div className="flex flex-row text-right gap-2 items-end">
              <PriceFormatter price={item.price} className="font-medium" />
              <button
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  order.status?.toLowerCase() === "delivered" && item.isReviewable
                    ? "hover:opacity-90 shadow-sm" 
                    : "cursor-not-allowed opacity-60"
                }`}
                style={{ 
                  backgroundColor: order.status?.toLowerCase() === "delivered" && item.isReviewable 
                    ? mainColor.primary || mainColor 
                    : "#E0E0E0",
                  color: order.status?.toLowerCase() === "delivered" && item.isReviewable 
                    ? "#FFFFFF" 
                    : "#757575",
                  border: "none",
                  fontWeight: "medium",
                  fontFamily: '"Roboto", sans-serif'
                }}
                disabled={order.status?.toLowerCase() !== "delivered" || !item.isReviewable}
                onClick={() => {
                  if (order.status?.toLowerCase() === "delivered" && item.isReviewable) {
                    onReviewClick(item, order.id);
                  }
                }}
              >
                {order.status?.toLowerCase() === "delivered" && !item.isReviewable
                  ? "Đã đánh giá"
                  : "Đánh giá"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 border-t p-4">
        <div className="flex flex-col mb-4">
          {/* Voucher information */}
          {order.voucherCode && (
            <div className="flex items-center mb-2">
              <LocalOfferIcon sx={{ fontSize: 16, color: mainColor.primary, mr: 0.5 }} />
              <span className="text-gray-600 text-sm mr-2">Voucher:</span>
              <Chip 
                label={order.voucherCode}
                size="small"
                sx={{ 
                  bgcolor: `${mainColor.primary}15`, 
                  color: mainColor.primary,
                  fontWeight: 'medium',
                  fontSize: '0.75rem',
                  height: '22px'
                }}
              />
              {discountPercentage && (
                <span className="ml-2 bg-red-100 text-red-700 rounded px-1 py-0.5 text-xs font-medium">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          )}
          
          {/* Original price */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Tổng tiền ({order.orderDetails.length} sản phẩm):</span>
            <div className="text-right">
              {/* If there's a discount, show the original price with strikethrough and discounted price */}
              {order.originalOrderTotal && order.discountedOrderTotal && order.originalOrderTotal !== order.discountedOrderTotal ? (
                <>
                  <div className="line-through text-gray-500 text-sm">
                    <PriceFormatter price={order.originalOrderTotal} />
                  </div>
                  <PriceFormatter 
                    price={order.discountedOrderTotal} 
                    variant="h6" 
                    sx={{ fontWeight: 'bold', color: mainColor.primary }} 
                  />
                </>
              ) : (
                <PriceFormatter 
                  price={order.orderTotal} 
                  variant="h6" 
                  sx={{ fontWeight: 'bold' }} 
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          {order.status?.toLowerCase() === "awaiting payment" && (
            <button
              onClick={handlePayNowClick}
              disabled={loading}
              className="bg-white border rounded-md hover:opacity-90 px-6 py-2.5 transition-all flex items-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
              style={{ 
                color: mainColor.primary || mainColor, 
                borderColor: mainColor.primary || mainColor,
                backgroundColor: `${mainColor.primary || mainColor}10`,
                fontFamily: '"Roboto", sans-serif',
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontWeight: "500"
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ color: mainColor.primary || mainColor }} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  <span>Thanh Toán Ngay</span>
                </>
              )}
            </button>
          )}
          <Link
            href={`/order-details?id=${order.id}`}
            className="bg-white border rounded-md hover:opacity-90 px-6 py-2.5 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            style={{ 
              color: mainColor.primary || mainColor, 
              borderColor: mainColor.primary || mainColor,
              backgroundColor: `${mainColor.primary || mainColor}10`,
              fontFamily: '"Roboto", sans-serif',
              fontWeight: "500"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <span>Xem chi tiết</span>
          </Link>
        </div>
      </div>
      <BankPaymentModal
        open={openBankModal}
        onClose={() => setOpenBankModal(false)}
        order={orderBankModal}
        qrImageUrl={qrImageUrl}
      />
    </div>
  );
}