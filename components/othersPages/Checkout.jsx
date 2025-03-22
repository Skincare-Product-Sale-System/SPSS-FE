"use client";
import useAuthStore from "@/context/authStore";
import { useContextElement } from "@/context/Context";
import useQueryStore from "@/context/queryStore";
import request from "@/utils/axios";
import { defaultProductImage } from "@/utils/default";
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
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
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
    fetchPaymentMethods();
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
    <section className="py-4">
      <div className="container">
        <div className="row g-4">
          {/* Left column - Address and Order Info */}
          <div className="col-lg-7">
            {/* Address Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-5 mb-0" style={{ fontFamily: '"Roboto", sans-serif' }}>
                  1. Địa Chỉ Giao Hàng
                </h5>
              <button
                  className="btn btn-sm text-white"
                style={{ backgroundColor: theme.palette.primary.main, fontFamily: '"Roboto", sans-serif' }}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "Hủy" : "Thêm địa chỉ mới"}
              </button>
            </div>

              {selectedAddress && !showAddressForm && (
                <div className="border rounded p-3 mb-2" 
                     style={{ borderColor: theme.palette.primary.light, backgroundColor: `${theme.palette.primary.main}08` }}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="fw-medium mb-1">
                        {selectedAddress.customerName} • {selectedAddress.phoneNumber}
                      </p>
                      <p className="fs-14 text-muted mb-0">
                        {selectedAddress.streetNumber}, {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}, 
                        {selectedAddress.ward}, {selectedAddress.province}, {selectedAddress.city}
                      </p>
                    </div>
                    <button 
                      className="text-primary fs-14 text-decoration-underline bg-transparent border-0"
                      onClick={() => document.getElementById('address-list').classList.toggle('d-none')}
                    >
                      Thay đổi
                    </button>
                  </div>
                </div>
              )}

              {/* Collapsed address list */}
              <div id="address-list" className="d-none mb-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded p-3 mb-2 cursor-pointer ${
                      selectedAddress?.id === address.id
                        ? "border-primary bg-light"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedAddress(address);
                      document.getElementById('address-list').classList.add('d-none');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <p className="fw-medium mb-1">
                      {address.customerName} • {address.phoneNumber}
                    </p>
                    <p className="fs-14 text-muted mb-0">
                      {address.streetNumber}, {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}, 
                      {address.ward}, {address.province}, {address.city}
                    </p>
                  </div>
                ))}
              </div>

              {/* Address form - show when needed */}
              {showAddressForm && (
                <div className="border rounded p-3">
                  <form onSubmit={handleAddAddress} className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Tên Khách Hàng</label>
                    <input
                      type="text"
                        className="form-control"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>

                    <div className="col-md-6">
                      <label className="form-label">Số Điện Thoại</label>
                    <input
                      type="text"
                        className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                    {/* Add other form fields in a grid layout */}
                    
                    <div className="col-12 mt-3 d-flex justify-content-end">
                    <button
                      type="button"
                        className="btn btn-outline-secondary me-2"
                      onClick={() => {
                        setShowAddressForm(false);
                        resetForm();
                      }}
                    >
                        Hủy
                    </button>
                    <button
                      type="submit"
                        className="btn text-white"
                      style={{ backgroundColor: theme.palette.primary.main }}
                      disabled={saving}
                    >
                      {saving ? "Đang lưu..." : "Thêm Địa Chỉ"}
                    </button>
                  </div>
                </form>
              </div>
            )}

              {addresses.length === 0 && !showAddressForm && (
                <div className="alert alert-secondary">
                  Chưa có địa chỉ nào. Vui lòng thêm địa chỉ để tiếp tục.
                </div>
              )}
            </div>

            {/* Order Information Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h5 className="fw-5 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
                3. Thông Tin Đơn Hàng
              </h5>
              
              <div className="table-responsive mb-3">
                <table className="table table-borderless">
                  <thead className="border-bottom">
                    <tr className="text-muted fs-14">
                      <th scope="col" style={{ width: '40%' }}>Sản phẩm</th>
                      <th scope="col" className="text-center">Số lượng</th>
                      <th scope="col" className="text-end">Giá</th>
                      <th scope="col" className="text-end">Tổng giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((item, i) => (
                      <tr key={i} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <Link href={`/product-detail/${item.productId}`}>
                                <Image
                                  src={item.productImageUrl || defaultProductImage}
                                  alt={item.productName}
                                  width={60}
                                  height={60}
                                  className="rounded object-cover"
                                />
                              </Link>
                            </div>
                            <div>
                              <Link 
                                href={`/product-detail/${item.productId}`}
                                className="text-decoration-none fw-medium text-dark mb-1 d-block fs-14 hover-primary"
                              >
                                {item.productName}
                              </Link>
                              <span className="text-muted fs-12 d-block">
                                {item.variationOptionValues[0]}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="text-center align-middle">
                          <span className="d-inline-block bg-light px-2 py-1 rounded fs-14">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="text-end align-middle">
                          <span className="fs-14">{formatPrice(item.price)}</span>
                        </td>
                        <td className="text-end align-middle fw-medium">
                          <span className="fs-14">{formatPrice(item.price * item.quantity)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column - Payment Methods & Checkout */}
          <div className="col-lg-5">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky-top" style={{ top: '20px' }}>
              <h5 className="fw-5 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
                2. Phương Thức Thanh Toán
              </h5>
              
              <div className="mb-4">
                <div className="row g-2">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-md-6">
                      <div 
                        className={`border rounded p-3 ${paymentMethod === method.id ? 'border-primary' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="form-check d-flex align-items-center gap-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="payment"
                            id={method.id}
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                          />
                        <Image
                            src={method.imageUrl} 
                            alt={method.paymentType} 
                            width={40} 
                            height={25} 
                            className="object-contain"
                          />
                          <label className="form-check-label ms-1" htmlFor={method.id}>
                            {method.paymentType === "COD" ? "Thanh toán khi nhận hàng (COD)" : `Thanh toán qua ${method.paymentType}`}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                      </div>
                    </div>
              
              {/* Coupon */}
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
                      request
                        .get(`/voucher/code/${voucherElem.value}`)
                        .then(({ data }) => {
                          // existing voucher logic
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
                  >
                    Áp dụng
                  </button>
                </div>
                
                {voucher.code != "" && (
                  <div
                    className={`mt-2 ${
                      voucher.code != "invalid"
                        ? "text-success fw-medium"
                        : "text-danger"
                    }`}
                  >
                    {voucher.code != "invalid" && voucher.code
                      ? `Áp dụng mã: ${voucher.code} với giảm giá ${voucher.discountRate}%`
                      : "Mã giảm giá không hợp lệ"}
                  </div>
                )}
              </div>
              
              {/* Order Total moved here */}
              <div className="border-top border-bottom py-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                
                {voucher.code != "invalid" && voucher.code && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Giảm giá ({voucher.discountRate}%):</span>
                    <span>-{formatPrice(totalPrice * voucher.discountRate/100)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                  <span>Tổng tiền:</span>
                  <span>{formatPrice(totalPrice * (1 - voucher.discountRate/100))}</span>
                </div>
                    </div>
              
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
                    onClick={async () => {
                      // Kiểm tra đã chọn phương thức thanh toán chưa
                      if (!paymentMethod) {
                        toast.error("Vui lòng chọn phương thức thanh toán");
                        return;
                      }

                      // Kiểm tra đã đồng ý điều khoản chưa 
                      const agreeCheckbox = document.getElementById("check-agree");
                      if (!agreeCheckbox.checked) {
                        toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
                        return;
                      }

                      if (!selectedAddress?.id) {
                        toast.error("Vui lòng chọn địa chỉ giao hàng");
                        return;
                      }

                      if (!cartProducts || cartProducts.length === 0) {
                        toast.error("Giỏ hàng trống");
                        return;
                      }

                      // Kiểm tra sản phẩm có hợp lệ không
                      const invalidProducts = cartProducts.filter(elm => !elm.productItemId);
                      if (invalidProducts.length > 0) {
                        toast.error("Có sản phẩm không hợp lệ trong giỏ hàng");
                        return;
                      }

                      // Kiểm tra tổng tiền đơn hàng phải lớn hơn 0
                      if (totalPrice <= 0) {
                        toast.error("Tổng tiền đơn hàng phải lớn hơn 0");
                        return;
                      }

                      const voucherId = document.querySelector("input#voucherId").value;
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

                          if (paymentMethods.find(m => m.id === paymentMethod)?.paymentType === "VNPAY") {
                            const vnpayRes = await request.get(
                              `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=https%3A%2F%2Fspssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net`
                            );
                            if (vnpayRes.status === 200) {
                              location.href = vnpayRes.data.data;
                            } else {
                              toast.error("Không thể khởi tạo thanh toán VNPay");
                            }
                          } else {
                            location.href = `/payment-success?id=${orderId}`;
                          }
                        }
                      } catch (err) {
                        console.error("Lỗi tạo đơn hàng:", err);
                        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng");
                        location.href = "/payment-failure";
                      }
                    }}
                  >
                    Đặt hàng
                  </button>
              )}
              
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
  );
}