"use client";
import React from "react";
import Link from "next/link";

export default function Login() {
  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="lg-col-2 tf-grid-layout tf-login-wrap">
          <div className="tf-login-form">
            <div id="recover">
              <h5 className="mb_24" style={{ fontFamily: 'Playfair Display, serif' }}>Khôi phục mật khẩu</h5>
              <p className="mb_30" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Chúng tôi sẽ gửi email hướng dẫn khôi phục mật khẩu cho bạn
              </p>
              <div>
                <form onSubmit={(e) => e.preventDefault()} className="">
                  <div className="mb_15 style-1 tf-field">
                    <input
                      className="tf-field-input tf-input"
                      placeholder=""
                      required
                      type="email"
                      autoComplete="abc@xyz.com"
                      id="property3"
                      name="email"
                    />
                    <label
                      className="fw-4 text_black-2 tf-field-label"
                      htmlFor="property3"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Email *
                    </label>
                  </div>
                  <div className="mb_20">
                    <a href="#login" className="btn-line tf-btn" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Hủy
                    </a>
                  </div>
                  <div className="">
                    <button
                      type="submit"
                      className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Khôi phục mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div id="login">
              <h5 className="mb_36" style={{ fontFamily: 'Playfair Display, serif' }}>Đăng nhập</h5>
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb_15 style-1 tf-field">
                    <input
                      required
                      className="tf-field-input tf-input"
                      placeholder=""
                      type="email"
                      autoComplete="abc@xyz.com"
                      id="property3"
                      name="email"
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
                      required
                      className="tf-field-input tf-input"
                      placeholder=""
                      type="password"
                      id="property4"
                      name="password"
                      autoComplete="current-password"
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
                    <a href="#recover" className="btn-line tf-btn" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="">
                    <button
                      type="submit"
                      className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      Đăng nhập
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="tf-login-content">
            <h5 className="mb_36" style={{ fontFamily: 'Playfair Display, serif' }}>Bạn chưa có tài khoản?</h5>
            <p className="mb_20" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Đăng ký để được cập nhật sớm nhất về khuyến mãi, sản phẩm mới và các xu hướng mới nhất. Bạn có thể hủy đăng ký bất kỳ lúc nào.
            </p>
            <Link href={`/register`} className="btn-line tf-btn" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Đăng ký
              <i className="icon icon-arrow1-top-left" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
