"use client";
import React from "react";
import Link from "next/link";
export default function Register() {
  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="form-register-wrap">
          <div className="align-items-start flat-title gap-0 mb_30 px-0">
            <h5 className="mb_18" style={{ fontFamily: 'Playfair Display, serif' }}>Đăng ký</h5>
            <p className="text_black-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Đăng ký để nhận thông tin khuyến mãi sớm nhất cùng với các sản phẩm mới, 
              xu hướng và ưu đãi đặc biệt. Bạn có thể hủy đăng ký bất kỳ lúc nào bằng cách 
              nhấp vào liên kết hủy đăng ký trong email của chúng tôi
            </p>
          </div>
          <div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className=""
              id="register-form"
              action="#"
              method="post"
              acceptCharset="utf-8"
              data-mailchimp="true"
            >
              <div className="mb_15 style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="property1"
                  name="first name"
                  required
                />
                <label
                  className="fw-4 text_black-2 tf-field-label"
                  htmlFor="property1"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Họ
                </label>
              </div>
              <div className="mb_15 style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  id="property2"
                  name="last name"
                  required
                />
                <label
                  className="fw-4 text_black-2 tf-field-label"
                  htmlFor="property2"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Tên
                </label>
              </div>
              <div className="mb_15 style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  autoComplete="abc@xyz.com"
                  id="property3"
                  name="email"
                  required
                />
                <label
                  className="fw-4 text_black-2 tf-field-label"
                  htmlFor="property3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Email *
                </label>
              </div>
              <div className="mb_30 style-1 tf-field">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  id="property4"
                  name="password"
                  autoComplete="current-password"
                  required
                />
                <label
                  className="fw-4 text_black-2 tf-field-label"
                  htmlFor="property4"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Mật khẩu *
                </label>
              </div>
              <div className="mb_20">
                <button
                  type="submit"
                  className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Đăng ký
                </button>
              </div>
              <div className="text-center">
                <Link href={`/login`} className="btn-line tf-btn" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Đã có tài khoản? Đăng nhập tại đây
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
