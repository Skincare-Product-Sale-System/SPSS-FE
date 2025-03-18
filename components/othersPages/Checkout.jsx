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
  const { switcher, revalidate } = useQueryStore();
  const { Id } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('bank');
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
    isDefault: false
  });

  useEffect(() => {
    //> fetch data from server
    request
      .get("/cart-items/user/cart")
      .then(({ data }) => {
        setCartProducts(data?.data?.items);
      })
      .catch((e) => setCartProducts([]));
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
      const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
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
      [name]: type === 'checkbox' ? checked : value
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
      isDefault: false
    });
  };

  // Handle form submission for adding a new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.customerName) {
      toast.error("Customer name is required");
      return;
    }
    if (!formData.phoneNumber) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.streetNumber) {
      toast.error("Street number is required");
      return;
    }
    if (!formData.addressLine1) {
      toast.error("Address Line 1 is required");
      return;
    }
    if (!formData.city) {
      toast.error("City is required");
      return;
    }
    if (!formData.ward) {
      toast.error("Ward is required");
      return;
    }
    if (!formData.province) {
      toast.error("Province is required");
      return;
    }
    if (!formData.postCode) {
      toast.error("Postal code is required");
      return;
    }
    if (!formData.countryId) {
      toast.error("Country is required");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        ...formData,
        userId: Id
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
            const updatedAddressesWithDefault = updatedAddresses.map(addr => 
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
              <h5 className="fw-5">Shipping Address</h5>
              <button
                className="px-4 py-2 rounded-md text-white transition-all hover:opacity-90"
                style={{ backgroundColor: theme.palette.primary.main }}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm ? "Cancel" : "Add a new address"}
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8 border" style={{ borderColor: theme.palette.divider }}>
                <h3 className="text-xl font-medium mb-4" style={{ color: theme.palette.text.primary }}>
                  Add a new address
                </h3>
                
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Customer Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Phone Number
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Street Number
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="streetNumber"
                      name="streetNumber"
                      value={formData.streetNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Address Line 1
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Address Line 2 (Optional)
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      City
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Ward
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="ward"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Province
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Postal Code
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      type="text"
                      id="postCode"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="tf-field md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
                      Country
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: theme.palette.divider,
                        focusRing: theme.palette.primary.light
                      }}
                      id="countryId"
                      name="countryId"
                      value={formData.countryId}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a country</option>
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
                    <label htmlFor="isDefault" style={{ color: theme.palette.text.secondary }}>
                      Set as default address
                    </label>
                  </div>
                  
                  <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border rounded-md"
                      style={{ 
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary
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
                      {saving ? 'Saving...' : 'Add Address'}
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
                <p className="text-gray-600 mb-4">No addresses found. Please add an address to continue.</p>
            </div>
            )}
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">Your order</h5>
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
                      <div className="col-12 fs-18">
                        Your shop cart is empty
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          Explore Products!
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="coupon-box">
                  <input
                    id="voucherId"
                    type="text"
                    placeholder="Discount code"
                  />
                  <a
                    href="#"
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                  >
                    Apply
                  </a>
                </div>
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Total</h6>
                  <h6 className="total fw-5">
                    {formatPrice(totalPrice)}
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
                    <label htmlFor="bank">Direct bank transfer</label>
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
                    <label htmlFor="delivery">Cash on delivery</label>
                  </div>
                  <p className="text_black-2 mb_20">
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our
                    <Link
                      href={`/privacy-policy`}
                      className="text-decoration-underline ps-1"
                    >
                      privacy policy
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
                    <label htmlFor="check-agree" className="text_black-2">
                      I have read and agree to the website
                      <Link
                        href={`/terms-conditions`}
                        className="ps-1 text-decoration-underline"
                      >
                        terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                <button
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                  onClick={async () => {
                    if (!selectedAddress?.id) {
                      toast.error("Please select an address");
                      return;
                    }
                    const voucherId =
                      document.querySelector("input#voucherId").value;
                    const orderData = {
                      addressId: selectedAddress?.id,
                      paymentMethodId:
                        paymentMethod === "bank"
                          ? "354EDA95-5BE5-41BE-ACC3-CFD70188118A" // VNPay
                          : "ABB33A09-6065-4DC2-A943-51A9DD9DF27E", // COD
                      voucherId: voucherId || null,
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
                          // Nếu là bank transfer -> gọi API VNPay và điều hướng
                          // const vnpayRes = await request.get(
                          //   `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A44358`
                          // );
                          const vnpayRes = await request.get(
                            //`/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A44358%2Fpayment-success%3Fid%3D${orderId}`
                            `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=https%3A%2F%2Flocalhost%3A44358`
                          );
                          if (vnpayRes.status === 200) {
                            location.href = vnpayRes.data.data; // Chuyển đến trang thanh toán VNPay
                          }
                        } else {
                          // Nếu là COD -> chuyển thẳng đến trang success
                          location.href = `/payment-success?id=${orderId}`;
                        }
                      }
                    } catch (err) {
                      console.error(err);
                      location.href = "/payment-failure";
                    }
                  }}
                >
                  Place order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
