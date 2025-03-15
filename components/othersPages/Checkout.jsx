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

export default function Checkout() {
  const [cartProducts, setCartProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { switcher, revalidate } = useQueryStore();
  const { Id } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('bank');

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
    request.get("/address").then(({ data }) => {
      setAddresses(data?.data?.items);
    });
  }, []);

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">Shipping Address</h5>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-lg border ${
                    selectedAddress?.id == address.id
                      ? "border-blue-500 shadow-md bg-blue-200"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  } transition-all`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <AddressItem key={address.id} address={address} />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3">
              <a
                href="/profile/addresses"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add New Address
              </a>
            </div>
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
                          ${(elm.price * elm.quantity).toLocaleString()}
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
                    ${totalPrice.toLocaleString()} USD
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
                      paymentMethodId: paymentMethod === 'bank' 
                        ? "2BBC0050-BFAE-4764-8BD7-8C73579EE3E1"  // Direct bank transfer
                        : "F351955F-F25A-4CFB-8542-1F58043DE654",  // Cash on delivery
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
                        
                        if (paymentMethod === 'bank') {
                          // Nếu chọn bank transfer -> gọi API VNPay và điều hướng
                          const vnpayRes = await request.get(
                            `/VNPAY/get-transaction-status-vnpay?orderId=${orderId}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A3000%2Fpayment-success%3Fid%3D${orderId}`
                          );
                          if (vnpayRes.status === 200) {
                            location.href = vnpayRes.data.data; // Chuyển đến trang thanh toán VNPay
                          }
                        } else {
                          // Nếu chọn COD -> điều hướng thẳng đến trang success
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
