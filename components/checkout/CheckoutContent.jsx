"use client";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/context/authStore";
import useQueryStore from "@/context/queryStore";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/priceFormatter";
import AddressSection from "./AddressSection";
import PaymentMethodsSection from "./PaymentMethodsSection";
import OrderSummarySection from "./OrderSummarySection";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import BankPaymentModal from "@/components/payment/BankPaymentModal";
import { useRouter } from "next/navigation";

export default function CheckoutContent() {
  const router = useRouter();
  const theme = useTheme();
  const [cartProducts, setCartProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [voucher, setVoucher] = useState({
    id: "",
    code: "",
    discountRate: 0,
  });
  const { switcher } = useQueryStore();
  const { Id } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [countries, setCountries] = useState([]);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [orderBankModal, setOrderBankModal] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState("");

  const totalPrice = cartProducts.reduce((a, b) => {
    return a + b.quantity * b.price;
  }, 0);

  const discountedTotal = totalPrice * (1 - voucher.discountRate / 100);

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
    fetchCountries();
    fetchPaymentMethods();
  }, [switcher]);

  const fetchCartItems = async () => {
    try {
      const { data } = await request.get("/cart-items/user/cart");
      const items = data?.data?.items || [];
      setCartProducts(items);

      // Redirect to cart page if cart is empty
      if (items.length === 0) {
        window.location.href = "/cart";
      }
    } catch (e) {
      setCartProducts([]);
      // Redirect to cart page if there's an error fetching cart
      window.location.href = "/cart";
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data } = await request.get("/addresses/user");
      const addressList = data?.data?.items || [];
      setAddresses(addressList);

      // Find default address (isDefault = true) or use the first one
      const defaultAddress =
        addressList.find((addr) => addr.isDefault) || addressList[0];
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    }
  };

  const fetchCountries = async () => {
    try {
      const { data } = await request.get(`/countries`);
      setCountries(data.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data } = await request.get("/payment-methods");
      const methods = data?.data?.items || [];
      setPaymentMethods(methods);

      // Set default payment method if available
      if (methods.length > 0) {
        setPaymentMethod(methods[0].id);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    }
  };

  const handleApplyVoucher = async (voucherCode) => {
    try {
      const { data } = await request.get(`/voucher/code/${voucherCode}`);

      // Validate voucher
      const currentDate = new Date();
      const startDate = new Date(data.data.startDate);
      const endDate = new Date(data.data.endDate);

      if (currentDate < startDate) {
        toast.error("Voucher chưa đến thời gian sử dụng");
        return false;
      } else if (currentDate > endDate) {
        toast.error("Voucher đã hết hạn sử dụng");
        return false;
      } else if (data.data.minimumOrderValue > totalPrice) {
        toast.error(`Đơn hàng phải có giá trị tối thiểu ${formatPrice(data.data.minimumOrderValue)}`);
        return false;
      } else if (data.data.usageLimit <= 0) {
        toast.error("Voucher đã hết lượt sử dụng");
        return false;
      }

      // Valid voucher
      setVoucher({
        id: data.data.id,
        code: data.data.code,
        discountRate: data?.data?.discountRate,
      });
      return true;
    } catch (err) {
      setVoucher({
        id: "",
        code: "invalid",
        discountRate: 0,
      });
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    // Check if payment method is selected
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    // Check if terms are agreed
    const agreeCheckbox = document.getElementById("check-agree");
    if (!agreeCheckbox.checked) {
      toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    // Check if shipping address is selected
    if (!selectedAddress?.id) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    // Check if cart is not empty
    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    // Check for invalid products
    const invalidProducts = cartProducts.filter(elm => !elm.productItemId);
    if (invalidProducts.length > 0) {
      toast.error("Có sản phẩm không hợp lệ trong giỏ hàng");
      return;
    }

    // Check if total price is greater than 0
    if (totalPrice <= 0) {
      toast.error("Tổng tiền đơn hàng phải lớn hơn 0");
      return;
    }

    // Prepare order data
    const orderData = {
      addressId: selectedAddress.id,
      paymentMethodId: paymentMethod,
      voucherId: voucher?.id || null,
      orderDetail: cartProducts.map((elm) => ({
        productItemId: elm.productItemId,
        quantity: elm.quantity,
      })),
    };

    try {
      const res = await request.post("/orders", orderData);

      if (res.status === 201) {
        const orderId = res.data.data.id;
        const orderDataFull = res.data.data;

        // Handle VNPay redirects if needed
        if (paymentMethods.find(m => m.id === paymentMethod)?.paymentType === "VNPAY") {
          const vnpayRes = await request.get(
            `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=https%3A%2F%2Fspssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net`
          );
          if (vnpayRes.status === 200) {
            location.href = vnpayRes.data.data;
          } else {
            toast.error("Không thể khởi tạo thanh toán VNPay");
          }
        } else if (paymentMethods.find(m => m.id === paymentMethod)?.paymentType === "BANK") {
          // Hiển thị modal QR code
          const bankId = "970422";
          const accountNo = "0352314340";
          const template = "print";
          const amount = (orderDataFull.discountedOrderTotal ?? orderDataFull.orderTotal)?.toFixed(0) || (orderDataFull.discountedOrderTotal ?? orderDataFull.orderTotal);
          const description = encodeURIComponent(orderDataFull.id);
          const accountName = encodeURIComponent("DANG HO TUAN CUONG");
          const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
          setOrderBankModal(orderDataFull);
          setQrImageUrl(qrUrl);
          setOpenBankModal(true);
        } else {
          // Redirect to success page
          location.href = `/payment-success?id=${orderId}`;
        }
      }
    } catch (err) {
      console.error("Lỗi tạo đơn hàng:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng");
      location.href = "/payment-failure";
    }
  };

  // Theo dõi trạng thái đơn hàng khi modal mở
  useEffect(() => {
    if (!openBankModal || !orderBankModal?.id) return;
    const timer = setInterval(async () => {
      try {
        const resp = await request.get(`/orders/${orderBankModal.id}`);
        const status = resp.data.data?.status || resp.data.status;
        if (status && status.toLowerCase().trim() === "processing") {
          setOpenBankModal(false);
          window.location.href = `/payment-success?id=${orderBankModal.id}`;
        }
      } catch { }
    }, 4000);
    return () => clearInterval(timer);
  }, [openBankModal, orderBankModal, router]);

  return (
    <>
      <section className="py-4">
        <div className="container">
          <div className="row g-4">
            {/* Left column - Address and Order Info */}
            <div className="col-lg-7">
              {/* Address Section */}
              <AddressSection
                addresses={addresses}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                countries={countries}
                onAddressAdded={(newAddress) => {
                  setAddresses([...addresses, newAddress]);
                  setSelectedAddress(newAddress);
                }}
              />

              {/* Order Information Section */}
              <OrderSummarySection cartProducts={cartProducts} />
            </div>

            {/* Right column - Payment Methods & Checkout */}
            <div className="col-lg-5">
              <div className="bg-white p-4 rounded-lg shadow-sm sticky-top" style={{ top: '20px' }}>
                {/* Payment Methods Section */}
                <PaymentMethodsSection
                  paymentMethods={paymentMethods}
                  selectedPaymentMethod={paymentMethod}
                  onSelectPaymentMethod={setPaymentMethod}
                />

                {/* Coupon Section */}
                <div className="mb-3">
                  <h5 className="fw-5 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
                    Mã Giảm Giá
                  </h5>
                  <div className="input-group">
                    <input
                      id="voucherId"
                      type="text"
                      className="form-control"
                      placeholder="Mã giảm giá"
                    />
                    <button
                      className="btn text-white"
                      style={{ backgroundColor: theme.palette.primary.main }}
                      onClick={() => {
                        const voucherElem = document.getElementById("voucherId");
                        handleApplyVoucher(voucherElem.value);
                      }}
                    >
                      Áp dụng
                    </button>
                  </div>

                  {voucher.code !== "" && (
                    <div
                      className={`mt-2 ${voucher.code !== "invalid"
                        ? "text-success fw-medium"
                        : "text-danger"
                        }`}
                    >
                      {voucher.code !== "invalid" && voucher.code
                        ? `Áp dụng mã: ${voucher.code} với giảm giá ${voucher.discountRate}%`
                        : "Mã giảm giá không hợp lệ"}
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="border-top border-bottom py-3 mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {voucher.code !== "invalid" && voucher.code && (
                    <div className="d-flex justify-content-between mb-2 text-success">
                      <span>Giảm giá ({voucher.discountRate}%):</span>
                      <span>-{formatPrice(totalPrice * voucher.discountRate / 100)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(0)}</span>
                  </div>

                  <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                    <span>Tổng tiền:</span>
                    <span>{formatPrice(discountedTotal)}</span>
                  </div>
                </div>

                {/* Terms and conditions agreement */}
                <div className="form-check mb-3">
                  <input
                    required
                    type="checkbox"
                    id="check-agree"
                    className="form-check-input"
                  />
                  <label className="form-check-label fs-14" htmlFor="check-agree">
                    Tôi đã đọc và đồng ý với
                    <Link href="/terms-conditions" className="text-decoration-underline ms-1">
                      điều khoản và điều kiện
                    </Link>
                    của website.
                  </label>
                </div>

                {/* Place order button */}
                {cartProducts.length > 0 && (
                  <button
                    className="btn text-white w-100 py-2"
                    style={{ backgroundColor: theme.palette.primary.main }}
                    onClick={handlePlaceOrder}
                  >
                    Đặt hàng
                  </button>
                )}

                {/* Privacy policy note */}
                <div className="mt-3 fs-14 text-muted">
                  Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và hỗ trợ trải nghiệm của bạn trên website này.
                  <Link href="/privacy-policy" className="text-decoration-underline ms-1">
                    Xem thêm trong chính sách bảo mật
                  </Link>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BankPaymentModal open={openBankModal} onClose={() => setOpenBankModal(false)} order={orderBankModal} qrImageUrl={qrImageUrl} />
    </>
  );
} 