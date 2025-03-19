"use client";
import useAuthStore from "@/context/authStore";
import { useContextElement } from "@/context/Context";
import useQueryStore from "@/context/queryStore";
import request from "@/utlis/axios";
import { defaultProductImage } from "@/utlis/default";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddressItem from "../address/AddressItem";
import toast from "react-hot-toast";
import { formatPrice } from "@/utils/priceFormatter";
import { useTheme } from "@mui/material/styles";
// import AddressItem from "../addresses/AddressItem";

export default function Checkout() {
  const theme = useTheme();
  const [cartProducts, setCartProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [voucher, setVoucher] = useState({
    id: "",
    code: "",
    discountRate: 0,
  });
  const { switcher, revalidate } = useQueryStore();
  const { Id } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [countries, setCountries] = useState([]);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    streetNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    ward: "",
    province: "",
    postCode: "",
    countryId: "",
    isDefault: false,
  });

  useEffect(() => {
    //> fetch data from server
    request
      .get("/cart-items/user/cart")
      .then(({ data }) => {
        const items = data?.data?.items || [];
        setCartProducts(items);

        // Redirect to cart page if cart is empty
        if (items.length === 0) {
          window.location.href = "/view-cart";
        }
      })
      .catch((e) => {
        setCartProducts([]);
        // Redirect to cart page if there's an error fetching cart
        window.location.href = "/view-cart";
      });
  }, [switcher]);

  const totalPrice = cartProducts.reduce((a, b) => {
    return a + b.quantity * b.price;
  }, 0);

  useEffect(() => {
    fetchAddresses();
    fetchCountries();
  }, []);

  const fetchAddresses = async () => {
    try {
      const { data } = await request.get("/addresses/user");
      const addressList = data?.data?.items || [];
      setAddresses(addressList);

      // Tìm địa chỉ mặc định (isDefault = true) hoặc lấy địa chỉ đầu tiên
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      streetNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      ward: "",
      province: "",
      postCode: "",
      countryId: "",
      isDefault: false,
    });
  };

  // Handle form submission for adding a new address
  const handleAddAddress = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.customerName) {
      toast.error("Tên khách hàng là bắt buộc");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Số điện thoại là bắt buộc");
      return;
    }
    if (!formData.streetNumber) {
      toast.error("Số nhà là bắt buộc");
      return;
    }
    if (!formData.addressLine1) {
      toast.error("Địa chỉ là bắt buộc");
      return;
    }
    if (!formData.city) {
      toast.error("Thành phố là bắt buộc");
      return;
    }
    if (!formData.ward) {
      toast.error("Phường/Xã là bắt buộc");
      return;
    }
    if (!formData.province) {
      toast.error("Quận/Huyện là bắt buộc");
      return;
    }
    if (!formData.postCode) {
      toast.error("Mã bưu điện là bắt buộc");
      return;
    }
    if (!formData.countryId) {
      toast.error("Quốc gia là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        userId: Id,
      };

      const response = await request.post("/addresses", payload);

      if (response.data && response.data.success) {
        toast.success("Address added successfully");

        // Lấy địa chỉ mới từ response
        const newAddress = response.data.data;

        // Đảm bảo newAddress có đầy đủ thông tin
        console.log("New address created:", newAddress);

        if (newAddress && newAddress.id) {
          // Thêm địa chỉ mới vào danh sách địa chỉ
          const updatedAddresses = [...addresses, newAddress];
          setAddresses(updatedAddresses);

          // Chọn địa chỉ mới làm địa chỉ hiện tại
          setSelectedAddress(newAddress);

          // Nếu địa chỉ mới là mặc định, cập nhật các địa chỉ khác
          if (newAddress.isDefault) {
            const updatedAddressesWithDefault = updatedAddresses.map((addr) =>
              addr.id !== newAddress.id ? { ...addr, isDefault: false } : addr
            );
            setAddresses(updatedAddressesWithDefault);
          }
        } else {
          console.error("Invalid address data in response:", response.data);
          // Nếu không có dữ liệu trả về, fetch lại danh sách địa chỉ
          await fetchAddresses();
        }

        // Reset form và UI state
        setShowAddressForm(false);
        resetForm();
      } else {
        console.error("Error in response:", response.data);
        toast.error(response.data?.message || "Failed to add address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      toast.error("Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <div className="flex justify-between items-center mb-4">
              <h5 className="fw-5" style={{ fontFamily: '"Roboto", sans-serif' }}>Địa Chỉ Giao Hàng</h5>
              <button
                className="px-4 py-2 rounded-md text-white transition-all hover:opacity-90"
                style={{ backgroundColor: theme.palette.primary.main, fontFamily: '"Roboto", sans-serif' }}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "Hủy" : "Thêm địa chỉ mới"}
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <div
                className="bg-white p-6 rounded-lg shadow-md mb-8 border"
                style={{ borderColor: theme.palette.divider }}
              >
                <h3
                  className="text-xl font-medium mb-4"
                  style={{ color: theme.palette.text.primary }}
                >
                  Add a new address
                </h3>

                <form
                  onSubmit={handleAddAddress}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Tên Khách Hàng
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Số Điện Thoại
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Số Nhà
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="streetNumber"
                      name="streetNumber"
                      value={formData.streetNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Địa Chỉ 1
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Địa Chỉ 2 (Tùy chọn)
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Thành Phố
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Phường/Xã
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Quận/Huyện
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Mã Bưu Điện
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      type="text"
                      id="postCode"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="tf-field md:col-span-2">
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Quốc Gia
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light,
                      }}
                      id="countryId"
                      name="countryId"
                      value={formData.countryId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn quốc gia</option>
                      {countries && countries.length > 0 ? (
                        countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.countryName}
                          </option>
                        ))
                      ) : (
                        <option disabled>No countries available</option>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label
                      htmlFor="isDefault"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      Đặt làm địa chỉ mặc định
                    </label>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded-md"
                      style={{
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                      }}
                      onClick={() => {
                        setShowAddressForm(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: theme.palette.primary.main }}
                      disabled={saving}
                    >
                      {saving ? "Đang lưu..." : "Thêm Địa Chỉ"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-lg border ${
                    selectedAddress?.id == address.id
                      ? "border-blue-500 shadow-md bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  } transition-all cursor-pointer`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <AddressItem key={address.id} address={address} />
                </div>
              ))}
            </div>

            {addresses.length === 0 && !showAddressForm && (
              <div className="text-center py-8 rounded-lg border border-gray-200 bg-gray-50">
                <p className="text-gray-600 mb-4" style={{ fontFamily: '"Roboto", sans-serif' }}>
                  Chưa có địa chỉ nào. Vui lòng thêm địa chỉ để tiếp tục.
                </p>
              </div>
            )}
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20" style={{ fontFamily: '"Roboto", sans-serif' }}>Đơn hàng của bạn</h5>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="tf-page-cart-checkout widget-wrap-checkout"
              >
                <ul className="wrap-checkout-product">
                  {cartProducts.map((elm, i) => (
                    <li key={i} className="checkout-product-item">
                      <figure className="img-product">
                        <Image
                          alt="product"
                          src={elm.productImageUrl || defaultProductImage}
                          width={720}
                          height={1005}
                        />
                        <span className="quantity">{elm.quantity}</span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p className="name">{elm.productName}</p>
                          <span className="variant">
                            {elm.variationOptionValues[0]}
                          </span>
                        </div>
                        <span className="price">
                          {formatPrice(elm.price * elm.quantity)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {!cartProducts.length && (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18" style={{ fontFamily: '"Roboto", sans-serif' }}>
                        Giỏ hàng của bạn đang trống
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content", fontFamily: '"Roboto", sans-serif' }}
                        >
                          Khám phá sản phẩm!
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="coupon-box">
                  <input
                    id="voucherId"
                    type="text"
                    placeholder="Mã giảm giá"
                  />
                  <div
                    onClick={() => {
                      const voucherElem = document.getElementById("voucherId");
                      request
                        .get(`/voucher/code/${voucherElem.value}`)
                        .then(({ data }) => {
                          const currentDate = new Date();
                          const startDate = new Date(data.data.startDate);
                          const endDate = new Date(data.data.endDate);

                          if (currentDate < startDate) {
                            toast.error("Voucher chưa đến thời gian sử dụng");
                          } else if (currentDate > endDate) {
                            toast.error("Voucher đã hết hạn sử dụng");
                          } else if (data.data.minimumOrderValue > totalPrice) {
                            toast.error(`Đơn hàng phải có giá trị tối thiểu ${formatPrice(data.data.minimumOrderValue)}`);
                          } else if (data.data.usageLimit <= 0) {
                            toast.error("Voucher đã hết lượt sử dụng");
                          } else {
                            setVoucher({
                              id: data.data.id,
                              code: data.data.code,
                              discountRate: data?.data?.discountRate,
                            });
                          }
                        })
                        .catch((err) => {
                          setVoucher({
                            id: "",
                            code: "invalid",
                            discountRate: 0,
                          });
                        });
                    }}
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                  >
                    Áp dụng
                  </div>
                </div>
                {voucher.code != "" && (
                  <div
                    className={`font-semibold ${
                      voucher.code != "invalid"
                        ? "text-blue-500"
                        : "text-red-400"
                    }`}
                    style={{ fontFamily: '"Roboto", sans-serif' }}
                  >
                    {voucher.code != "invalid" && voucher.code
                      ? `Applied voucher: ${voucher.code} with discount ${
                          voucher.discountRate
                        }%`
                      : "Invalid voucher"}
                  </div>
                )}

                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Total</h6>
                  <h6 className="total fw-5">
                    {formatPrice(totalPrice * (1 - voucher.discountRate/100))}
                    {voucher.code != "invalid" && voucher.code && (
                      <span className="strikethrough ml-2">
                        {formatPrice(totalPrice)}
                      </span>
                    )}
                  </h6>
                </div>
                <div className="wd-check-payment">
                  <div className="fieldset-radio mb_20">
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="bank"
                      className="tf-check"
                      defaultChecked
                      value="bank"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="bank">Thanh toán qua VNPAY</label>
                  </div>
                  <div className="fieldset-radio mb_20">
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="delivery"
                      className="tf-check"
                      value="cod"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="delivery">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  <p className="text_black-2 mb_20" style={{ fontFamily: '"Roboto", sans-serif' }}>
                    Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng và hỗ trợ trải nghiệm của bạn trên website này. Xem thêm trong 
                    <Link
                      href={`/privacy-policy`}
                      className="text-decoration-underline ps-1"
                    >
                      chính sách bảo mật
                    </Link>
                    .
                  </p>
                  <div className="box-checkbox fieldset-radio mb_20">
                    <input
                      required
                      type="checkbox"
                      id="check-agree"
                      className="tf-check"
                    />
                    <label htmlFor="check-agree" className="text_black-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Tôi đã đọc và đồng ý với
                      <Link
                        href={`/terms-conditions`}
                        className="ps-1 text-decoration-underline"
                      >
                        điều khoản và điều kiện
                      </Link>
                      của website.
                    </label>
                  </div>
                </div>
                {cartProducts.length ? (
                  <button
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                    onClick={async () => {
                      if (!selectedAddress?.id) {
                        toast.error("Please select an address");
                        return;
                      }
                      const orderData = {
                        addressId: selectedAddress?.id,
                        paymentMethodId:
                          paymentMethod === "bank"
                            ? "354EDA95-5BE5-41BE-ACC3-CFD70188118A" // VNPay
                            : "ABB33A09-6065-4DC2-A943-51A9DD9DF27E", // COD
                        voucherId: voucher.id || null,
                        orderDetail: cartProducts.map((elm) => ({
                          productItemId: elm.productItemId,
                          quantity: elm.quantity,
                        })),
                      };

                      try {
                        const res = await request.post("/orders", orderData);

                        if (res.status === 201) {
                          const orderId = res.data.data.id;

                          if (paymentMethod === "bank") {
                            const vnpayRes = await request.get(
                              `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=https%3A%2F%2Flocalhost%3A44358`
                            );
                            if (vnpayRes.status === 200) {
                              location.href = vnpayRes.data.data;
                            }
                          } else {
                            location.href = `/payment-success?id=${orderId}`;
                          }
                        }
                      } catch (err) {
                        console.error(err);
                        location.href = "/payment-failure";
                      }
                    }}
                  >
                    Đặt hàng
                  </button>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}