"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";

export default function Footer1({ bgColor = "" }) {
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-moblie");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");

      parent.classList.toggle("open");
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const email = e.target.email.value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        e.target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", error.response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      e.target.reset(); // Reset the form
    }
  };

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-6 col-xl-3">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link
                      href={`/`}
                      className="d-flex align-items-center gap-2"
                    >
                      <img
                        alt="image"
                        src="/images/logo/logo-icon.png"
                        width="40"
                        height="21"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                      <div
                        className="font-sora"
                        style={{
                          paddingTop: "10px",
                          color: "#0077ffb2",
                          fontSize: "30px",
                          fontWeight: "600",
                        }}
                      >
                        Skincede
                      </div>
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>
                        Địa chỉ: 1234 Đường Thời Trang, Số 567, <br />
                        Hà Nội, Việt Nam 10001
                      </p>
                    </li>
                    <li>
                      <p>
                        Email: <Link href="mailto:info@Skincede.com">info@Skincede.com</Link>
                      </p>
                    </li>
                    <li>
                      <p>
                        Điện thoại: <Link href="tel:(024) 5555-1234">(024) 5555-1234</Link>
                      </p>
                    </li>
                  </ul>
                  <Link href={`/contact-1`} className="btn-line tf-btn">
                    Chỉ đường
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                  <ul className="d-flex gap-10 tf-social-icon">
                    <li>
                      <a
                        href="#"
                        className="box-icon round social-facebook social-line w_34"
                      >
                        <i className="fs-14 icon icon-fb" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon round social-line social-twiter w_34"
                      >
                        <i className="fs-12 icon icon-Icon-x" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon round social-instagram social-line w_34"
                      >
                        <i className="fs-14 icon icon-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon round social-line social-tiktok w_34"
                      >
                        <i className="fs-14 icon icon-tiktok" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon round social-line social-pinterest w_34"
                      >
                        <i className="fs-14 icon icon-pinterest-1" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-3 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Trợ giúp</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Trợ giúp</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-12 col-md-6 col-xl-3 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Về chúng tôi</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Về chúng tôi</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {aboutLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-12 col-md-6 col-xl-3">
                <div className="footer-col-block footer-newsletter">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Đăng ký nhận tin</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Đăng ký nhận tin</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      Đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi, 
                      nội dung độc quyền, sự kiện và nhiều hơn nữa!
                    </div>
                    <div
                      className={`tfSubscribeMsg ${
                        showMessage ? "active" : ""
                      }`}
                    >
                      {success ? (
                        <p style={{ color: "rgb(52, 168, 83)" }}>
                          Bạn đã đăng ký thành công.
                        </p>
                      ) : (
                        <p style={{ color: "red" }}>Đã xảy ra lỗi</p>
                      )}
                    </div>
                    <form
                      ref={formRef}
                      onSubmit={sendEmail}
                      className="form-newsletter subscribe-form"
                      action="#"
                      method="post"
                      acceptCharset="utf-8"
                      data-mailchimp="true"
                    >
                      <div className="subscribe-content">
                        <fieldset className="email">
                          <input
                            required
                            type="email"
                            name="email"
                            className="subscribe-email"
                            placeholder="Nhập email của bạn...."
                            tabIndex={0}
                            aria-required="true"
                            autoComplete="abc@xyz.com"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            className="btn-fill btn-icon btn-sm animate-hover-btn radius-3 subscribe-button tf-btn"
                            type="submit"
                          >
                            Đăng ký
                            <i className="icon icon-arrow1-top-left" />
                          </button>
                        </div>
                      </div>
                      <div className="subscribe-msg" />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="d-flex flex-wrap align-items-center justify-content-between footer-bottom-wrap gap-20">
                  <div className="footer-menu_item">
                    © {new Date().getFullYear()} Skincede Store. Đã đăng ký Bản quyền
                  </div>
                  <div className="tf-payment">
                    {paymentImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
