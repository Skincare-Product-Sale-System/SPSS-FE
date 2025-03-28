"use client";
import React, { useState } from "react";
import Link from "next/link";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import { openLoginModal } from "@/utils/openLoginModal";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    surName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    surName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Accept formats like: 0912345678 or +84912345678
    const phoneRegex = /^(\+84|0)\d{9,10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, containing at least one letter and one number one special character one capitalized letter
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate in real-time
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value) {
          error = "Tên tài khoản là bắt buộc";
        } else if (value.length < 3) {
          error = "Tên tài khoản phải có ít nhất 3 ký tự";
        }
        break;

      case "surName":
        if (!value) {
          error = "Họ là bắt buộc";
        }
        break;

      case "lastName":
        if (!value) {
          error = "Tên là bắt buộc";
        }
        break;

      case "emailAddress":
        if (!value) {
          error = "Email là bắt buộc";
        } else if (!validateEmail(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "phoneNumber":
        if (!value) {
          error = "Số điện thoại là bắt buộc";
        } else if (!validatePhone(value)) {
          error =
            "Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc +84912345678";
        }
        break;

      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc";
        } else if (value.length < 8) {
          error = "Mật khẩu phải có ít nhất 8 ký tự";
        } else if (!validatePassword(value)) {
          error =
            "Mật khẩu phải chứa ít nhất một chữ cái, một số, một chữ cái viết hoa và một ký tự đặc biệt";
        } else if (
          formData.confirmPassword &&
          value !== formData.confirmPassword
        ) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Mật khẩu không khớp",
          }));
        } else if (
          formData.confirmPassword &&
          value === formData.confirmPassword
        ) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu";
        } else if (value !== formData.password) {
          error = "Mật khẩu không khớp";
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword") {
        // Don't include confirmPassword in API submission
        const fieldValid = validateField(key, formData[key]);
        if (!fieldValid) isValid = false;
      } else {
        // Special validation for confirmPassword
        if (formData.password !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Mật khẩu không khớp",
          }));
          isValid = false;
        }
      }
    });

    if (!isValid) return;

    // Prepare data for API
    const submitData = {
      username: formData.username,
      surName: formData.surName,
      lastName: formData.lastName,
      emailAddress: formData.emailAddress,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    request
      .post("/authentications/register", submitData)
      .then((res) => {
        if (res.status == 200) {
          toast.success("Đăng ký thành công");
          // Open login modal
          openLoginModal();
        }
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Đăng ký thất bại");
      });
  };

  return (
    <div
      className="form-sign-in modal modal-part-content modalCentered fade"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Đăng ký</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={handleSubmit}>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.username ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="text"
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <label className="tf-field-label" htmlFor="">
                  Tên tài khoản *
                </label>
                {errors.username && (
                  <div className="text-danger mt-1 small">
                    {errors.username}
                  </div>
                )}
              </div>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.surName ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="text"
                  required
                  name="surName"
                  value={formData.surName}
                  onChange={handleChange}
                />
                <label className="tf-field-label" htmlFor="">
                  Họ *
                </label>
                {errors.surName && (
                  <div className="text-danger mt-1 small">{errors.surName}</div>
                )}
              </div>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.lastName ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <label className="tf-field-label" htmlFor="">
                  Tên *
                </label>
                {errors.lastName && (
                  <div className="text-danger mt-1 small">
                    {errors.lastName}
                  </div>
                )}
              </div>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.emailAddress ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="email"
                  autoComplete="email"
                  required
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                />
                <label className="tf-field-label" htmlFor="">
                  Email *
                </label>
                {errors.emailAddress && (
                  <div className="text-danger mt-1 small">
                    {errors.emailAddress}
                  </div>
                )}
              </div>

              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.phoneNumber ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="tel"
                  required
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <label className="tf-field-label" htmlFor="">
                  Số điện thoại *
                </label>
                {errors.phoneNumber && (
                  <div className="text-danger mt-1 small">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.password ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Mật khẩu *
                </label>
                {errors.password && (
                  <div className="text-danger mt-1 small">
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="style-1 tf-field">
                <input
                  className={`tf-field-input tf-input ${
                    errors.confirmPassword ? "border-danger" : ""
                  }`}
                  placeholder=" "
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Nhập lại mật khẩu *
                </label>
                {errors.confirmPassword && (
                  <div className="text-danger mt-1 small">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                  >
                    <span>Đăng ký</span>
                  </button>
                </div>
                <div className="w-100">
                  <a
                    id="login"
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link w-100 fw-6 link"
                  >
                    Đã có tài khoản? Đăng nhập tại đây
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
